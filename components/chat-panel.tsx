'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { AI, UIState } from '@/app/actions'
import { useUIState, useAIState } from 'ai/rsc'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyScreen } from './empty-screen'
import Textarea from 'react-textarea-autosize'
import { useTheme } from 'next-themes'
import { MESSAGE_TYPES } from '@/lib/constants'
import { useMessageSubmit } from '@/lib/hooks/use-message-submit'
import Image from 'next/image'

interface ChatPanelProps {
  messages: UIState
  query?: string
  isSignedIn?: boolean
}

export function ChatPanel({ messages, query, isSignedIn: propIsSignedIn }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [, setMessages] = useUIState<typeof AI>()
  const [aiMessage, setAIMessage] = useAIState<typeof AI>()
  const { submit, isGenerating, setIsGenerating } = useMessageSubmit(propIsSignedIn)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const { theme } = useTheme()
  const logoSrc = theme === 'dark'
    ? 'https://utfs.io/f/z2Za8Zqs0NofWQee3Xg8IkPwAlRNsHM03E56iZhmaY7BQ1DT'
    : '/brand/logo-long.svg'

  async function handleQuerySubmit(query: string, formData?: FormData) {
    setInput(query)

    const data = formData || new FormData()
    if (!formData) {
      data.append('input', query)
    }
    await submit(query, data, { addUserMessageBeforeSubmit: true })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await handleQuerySubmit(input, formData)
  }

  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      handleQuerySubmit(query)
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const lastMessage = aiMessage.messages.slice(-1)[0]
    if (lastMessage?.type === MESSAGE_TYPES.FOLLOWUP || lastMessage?.type === MESSAGE_TYPES.INQUIRY) {
      setIsGenerating(false)
    }
  }, [aiMessage, setIsGenerating])

  const handleClear = () => {
    setIsGenerating(false)
    setMessages([])
    setAIMessage({ messages: [], chatId: '' })
    setInput('')
    router.push('/')
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (messages.length > 0) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto pointer-events-none">
        <Button
          type="button"
          variant={'secondary'}
          className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto font-spacemono"
          onClick={() => handleClear()}
          disabled={isGenerating}
        >
          <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
            Nový
          </span>
          <Plus size={18} className="group-hover:rotate-90 transition-all" />
        </Button>
      </div>
    )
  }

  if (query && query.trim().length > 0) {
    return null
  }

  return (
    <div
      className={
        'fixed bottom-8 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center'
      }
    >
      <div className="relative w-full max-w-2xl mb-16">
        <Image
          src={logoSrc}
          alt="Logo Morphic"
          width={300}
          height={80}
          className="mx-auto opacity-65"
        />
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
        <div className="relative flex items-center w-full">
          <Textarea
            ref={inputRef}
            name="input"
            rows={1}
            maxRows={5}
            tabIndex={0}
            placeholder="Položte otázku..."
            spellCheck={false}
            value={input}
            className="resize-none w-full min-h-12 rounded-fill bg-background border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-raleway"
            onChange={e => {
              setInput(e.target.value)
              setShowEmptyScreen(e.target.value.length === 0)
            }}
            onKeyDown={e => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                if (input.trim().length === 0) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                const textarea = e.target as HTMLTextAreaElement
                textarea.form?.requestSubmit()
              }
            }}
            onHeightChange={height => {
              if (!inputRef.current) return
              const initialHeight = 70
              const initialBorder = 32
              const multiple = (height - initialHeight) / 20
              const newBorder = initialBorder - 4 * multiple
              inputRef.current.style.borderRadius =
                Math.max(8, newBorder) + 'px'
            }}
            onFocus={() => setShowEmptyScreen(true)}
            onBlur={() => setShowEmptyScreen(false)}
          />
          <Button
            type="submit"
            size={'icon'}
            variant={'ghost'}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={input.length === 0}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={message => {
            setInput(message)
          }}
          className={cn(showEmptyScreen ? 'visible' : 'invisible')}
        />
      </form>
    </div>
  )
}
