'use client'

import { useActions, useUIState } from 'ai/rsc'
import { generateId } from 'ai'
import type { AI } from '@/app/actions'
import { useAppState } from '@/lib/utils/app-state'
import { UserMessage } from '@/components/user-message'
import { createElement } from 'react'
import { useQueryGuard } from '@/lib/hooks/use-query-guard'

export function useMessageSubmit(isSignedIn?: boolean) {
  const { submit } = useActions()
  const [, setMessages] = useUIState<typeof AI>()
  const { isGenerating, setIsGenerating } = useAppState()
  const { guardQuery } = useQueryGuard(isSignedIn)

  async function submitMessage(
    query: string,
    formData: FormData,
    options?: { addUserMessageBeforeSubmit?: boolean }
  ) {
    if (!guardQuery()) return
    const addBefore = options?.addUserMessageBeforeSubmit ?? false
    setIsGenerating(true)

    const userMessage = {
      id: generateId(),
      component: createElement(UserMessage, { message: query })
    }

    if (addBefore) {
      setMessages(currentMessages => [...currentMessages, userMessage])
    }

    const responseMessage = await submit(formData)

    if (addBefore) {
      setMessages(currentMessages => [...currentMessages, responseMessage])
    } else {
      setMessages(currentMessages => [
        ...currentMessages,
        userMessage,
        responseMessage
      ])
    }
  }

  return { submit: submitMessage, isGenerating, setIsGenerating }
}
