import {
  StreamableValue,
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState
} from 'ai/rsc'
import { CoreMessage, generateId, ToolResultPart } from 'ai'
import { Spinner } from '@/components/ui/spinner'
import { Section } from '@/components/section'
import { FollowupPanel } from '@/components/followup-panel'
import { inquire, researcher, taskManager, querySuggestor } from '@/lib/agents'
import { writer } from '@/lib/agents/writer'
import { saveChat } from '@/lib/actions/chat'
import { Chat } from '@/lib/types'
import { AIMessage } from '@/lib/types'
import { UserMessage } from '@/components/user-message'
import { SearchSection } from '@/components/search-section'
import SearchRelated from '@/components/search-related'
import { CopilotDisplay } from '@/components/copilot-display'
import RetrieveSection from '@/components/retrieve-section'
import { VideoSearchSection } from '@/components/video-search-section'
import { transformToolMessages } from '@/lib/utils'
import { AnswerSection } from '@/components/answer-section'
import { ErrorCard } from '@/components/error-card'
import { MESSAGE_TYPES, MODEL_CONFIG } from '@/lib/constants'
import { getProviderConfig } from '@/lib/utils/providers'

async function submit(
  formData?: FormData,
  skip?: boolean,
  retryMessages?: AIMessage[]
) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()
  const uiStream = createStreamableUI()
  const isGenerating = createStreamableValue(true)
  const isCollapsed = createStreamableValue(false)

  const aiMessages = [...(retryMessages ?? aiState.get().messages)]
  // Get the messages from the state, filter out the tool messages
  const messages: CoreMessage[] = aiMessages
    .filter(
      message =>
        message.role !== 'tool' &&
        message.type !== MESSAGE_TYPES.FOLLOWUP &&
        message.type !== MESSAGE_TYPES.RELATED &&
        message.type !== MESSAGE_TYPES.END
    )
    .map(message => {
      const { role, content } = message
      return { role, content } as CoreMessage
    })

  // groupId is used to group the messages for collapse
  const groupId = generateId()

  const { useSpecificAPI, useOllama: useOllamaProvider } = getProviderConfig()
  const maxMessages = useSpecificAPI
    ? MODEL_CONFIG.MAX_MESSAGES_SPECIFIC_API
    : useOllamaProvider
      ? MODEL_CONFIG.MAX_MESSAGES_OLLAMA
      : MODEL_CONFIG.MAX_MESSAGES_DEFAULT
  // Limit the number of messages to the maximum
  messages.splice(0, Math.max(messages.length - maxMessages, 0))
  // Get the user input from the form data
  const userInput = skip
    ? `{"action": "skip"}`
    : (formData?.get('input') as string)

  const content = skip
    ? userInput
    : formData
    ? JSON.stringify(Object.fromEntries(formData))
    : null
  const type = skip
    ? undefined
    : formData?.has('input')
    ? MESSAGE_TYPES.INPUT
    : formData?.has('related_query')
    ? MESSAGE_TYPES.INPUT_RELATED
    : MESSAGE_TYPES.INQUIRY

  // Add the user message to the state
  if (content) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: 'user',
          content,
          type
        }
      ]
    })
    messages.push({
      role: 'user',
      content
    })
  }

  async function handleInquiryBranch() {
    const inquiry = await inquire(uiStream, messages)
    uiStream.done()
    isGenerating.done()
    isCollapsed.done(false)
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: 'assistant',
          content: `inquiry: ${inquiry?.question}`,
          type: MESSAGE_TYPES.INQUIRY
        }
      ]
    })
  }

  async function runResearchLoop(streamText: ReturnType<typeof createStreamableValue<string>>) {
    let answer = ''
    let stopReason = ''
    let toolOutputs: ToolResultPart[] = []
    let errorOccurred = false

    while (
      useSpecificAPI
        ? toolOutputs.length === 0 && answer.length === 0 && !errorOccurred
        : (stopReason !== 'stop' || answer.length === 0) && !errorOccurred
    ) {
      const { fullResponse, hasError, toolResponses, finishReason } =
        await researcher(uiStream, streamText, messages)
      stopReason = finishReason || ''
      answer = fullResponse
      toolOutputs = toolResponses
      errorOccurred = hasError

      if (toolOutputs.length > 0) {
        toolOutputs.map(output => {
          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: groupId,
                role: 'tool',
                content: JSON.stringify(output.result),
                name: output.toolName,
                type: MESSAGE_TYPES.TOOL
              }
            ]
          })
        })
      }
    }

    return { answer, errorOccurred }
  }

  async function runWriterIfNeeded(answer: string, errorOccurred: boolean) {
    if (useSpecificAPI && answer.length === 0 && !errorOccurred) {
      const modifiedMessages = transformToolMessages(messages)
      const latestMessages = modifiedMessages.slice(maxMessages * -1)
      const { response, hasError } = await writer(uiStream, latestMessages)
      answer = response
      errorOccurred = hasError
      messages.push({
        role: 'assistant',
        content: answer
      })
    }
    return { answer, errorOccurred }
  }

  function getProcessedMessages(answer: string) {
    const { useGoogle: useGoogleProvider, useOllama: useOllamaProvider } = getProviderConfig()
    let processedMessages: CoreMessage[] = messages
    if (useGoogleProvider) {
      processedMessages = transformToolMessages(messages)
    }
    if (useOllamaProvider) {
      processedMessages = [{ role: 'assistant', content: answer }]
    }
    return processedMessages
  }

  async function finalizeSuccessState(answer: string, streamText: ReturnType<typeof createStreamableValue<string>>) {
    const processedMessages = getProcessedMessages(answer)

    streamText.done()
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: groupId,
          role: 'assistant',
          content: answer,
          type: MESSAGE_TYPES.ANSWER
        }
      ]
    })

    const relatedQueries = await querySuggestor(uiStream, processedMessages)
    uiStream.append(
      <Section title="Follow-up">
        <FollowupPanel />
      </Section>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: groupId,
          role: 'assistant',
          content: JSON.stringify(relatedQueries),
          type: MESSAGE_TYPES.RELATED
        },
        {
          id: groupId,
          role: 'assistant',
          content: 'followup',
          type: MESSAGE_TYPES.FOLLOWUP
        }
      ]
    })
  }

  function finalizeErrorState(answer: string, streamText: ReturnType<typeof createStreamableValue<string>>) {
    aiState.done(aiState.get())
    streamText.done()
    uiStream.append(
      <ErrorCard
        errorMessage={answer || 'An error occurred. Please try again.'}
      />
    )
  }

  async function processEvents() {
    uiStream.append(<Spinner />)

    let action = { object: { next: 'proceed' } }
    if (!skip) action = (await taskManager(messages)) ?? action

    if (action.object.next === 'inquire') {
      await handleInquiryBranch()
      return
    }

    isCollapsed.done(true)

    const streamText = createStreamableValue<string>()
    if (process.env.ANTHROPIC_API_KEY) {
      uiStream.update(
        <AnswerSection result={streamText.value} hasHeader={false} />
      )
    } else {
      uiStream.update(<div />)
    }

    let { answer, errorOccurred } = await runResearchLoop(streamText)
    ;({ answer, errorOccurred } = await runWriterIfNeeded(answer, errorOccurred))

    if (!errorOccurred) {
      await finalizeSuccessState(answer, streamText)
    } else {
      finalizeErrorState(answer, streamText)
    }

    isGenerating.done(false)
    uiStream.done()
  }

  processEvents()

  return {
    id: generateId(),
    isGenerating: isGenerating.value,
    component: uiStream.value,
    isCollapsed: isCollapsed.value
  }
}

export type AIState = {
  messages: AIMessage[]
  chatId: string
  isSharePage?: boolean
}

export type UIState = {
  id: string
  component: React.ReactNode
  isGenerating?: StreamableValue<boolean>
  isCollapsed?: StreamableValue<boolean>
}[]

const initialAIState: AIState = {
  chatId: generateId(),
  messages: []
}

const initialUIState: UIState = []

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    submit
  },
  initialUIState,
  initialAIState,
  onGetUIState: async () => {
    'use server'

    const aiState = getAIState()
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState as Chat)
      return uiState
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    // Check if there is any message of type 'answer' in the state messages
    if (!state.messages.some(e => e.type === MESSAGE_TYPES.ANSWER)) {
      return
    }

    const { chatId, messages } = state
    const createdAt = new Date()
    const userId = 'anonymous'
    const path = `/search/${chatId}`
    const title =
      messages.length > 0
        ? JSON.parse(messages[0].content)?.input?.substring(0, 100) ||
          'Untitled'
        : 'Untitled'
    // Add an 'end' message at the end to determine if the history needs to be reloaded
    const updatedMessages: AIMessage[] = [
      ...messages,
      {
        id: generateId(),
        role: 'assistant',
        content: MESSAGE_TYPES.END,
        type: MESSAGE_TYPES.END
      }
    ]

    const chat: Chat = {
      id: chatId,
      createdAt,
      userId,
      path,
      title,
      messages: updatedMessages
    }
    await saveChat(chat)
  }
})

function renderUserMessage(
  id: string,
  content: string,
  type: string,
  chatId: string,
  index: number,
  isSharePage?: boolean
) {
  if (type === MESSAGE_TYPES.INPUT || type === MESSAGE_TYPES.INPUT_RELATED) {
    const json = JSON.parse(content)
    const value = type === MESSAGE_TYPES.INPUT ? json.input : json.related_query
    return {
      id,
      component: (
        <UserMessage
          message={value}
          chatId={chatId}
          showShare={index === 0 && !isSharePage}
        />
      )
    }
  }
  if (type === MESSAGE_TYPES.INQUIRY) {
    return {
      id,
      component: <CopilotDisplay content={content} />
    }
  }
  return null
}

function renderAssistantMessage(id: string, content: string, type: string) {
  const streamable = createStreamableValue()
  streamable.done(content)

  if (type === MESSAGE_TYPES.ANSWER) {
    return {
      id,
      component: <AnswerSection result={streamable.value} />
    }
  }
  if (type === MESSAGE_TYPES.RELATED) {
    const relatedQueries = createStreamableValue()
    relatedQueries.done(JSON.parse(content))
    return {
      id,
      component: <SearchRelated relatedQueries={relatedQueries.value} />
    }
  }
  if (type === MESSAGE_TYPES.FOLLOWUP) {
    return {
      id,
      component: (
        <Section title="Follow-up" className="pb-8">
          <FollowupPanel />
        </Section>
      )
    }
  }
  return null
}

function renderToolMessage(id: string, content: string, name?: string) {
  try {
    const toolOutput = JSON.parse(content)
    const isCollapsed = createStreamableValue()
    isCollapsed.done(true)
    const searchResults = createStreamableValue()
    searchResults.done(JSON.stringify(toolOutput))

    switch (name) {
      case 'search':
        return {
          id,
          component: <SearchSection result={searchResults.value} />,
          isCollapsed: isCollapsed.value
        }
      case 'retrieve':
        return {
          id,
          component: <RetrieveSection data={toolOutput} />,
          isCollapsed: isCollapsed.value
        }
      case 'videoSearch':
        return {
          id,
          component: <VideoSearchSection result={searchResults.value} />,
          isCollapsed: isCollapsed.value
        }
      default:
        return { id, component: null }
    }
  } catch {
    return { id, component: null }
  }
}

export const getUIStateFromAIState = (aiState: Chat) => {
  const chatId = aiState.chatId
  const isSharePage = aiState.isSharePage
  return aiState.messages
    .map((message, index) => {
      const { role, content, id, type, name } = message

      if (
        !type ||
        type === MESSAGE_TYPES.END ||
        (isSharePage && type === MESSAGE_TYPES.RELATED) ||
        (isSharePage && type === MESSAGE_TYPES.FOLLOWUP)
      )
        return null

      switch (role) {
        case 'user':
          return renderUserMessage(id, content, type, chatId, index, isSharePage)
        case 'assistant':
          return renderAssistantMessage(id, content, type)
        case 'tool':
          return renderToolMessage(id, content, name)
        default:
          return { id, component: null }
      }
    })
    .filter(message => message !== null) as UIState
}
