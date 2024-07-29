'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ChatPanel } from './chat-panel'
import { ChatMessages } from './chat-messages'
import { useUIState } from 'ai/rsc'
import { ModelSelector } from './ModelSelector'
import { ModelType } from '../lib/utils'

type ChatProps = {
  id?: string
  query?: string
}

export function Chat({ id, query }: ChatProps) {
  const path = usePathname()
  const [messages] = useUIState()
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null)

  useEffect(() => {
    if (!path.includes('search') && messages.length === 1) {
      window.history.replaceState({}, '', `/search/${id}`)
    }
  }, [id, path, messages, query])

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model)
    fetch('/api/set-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    }).catch(error => console.error('Error setting model:', error))
  }

  return (
    <div className={`px-8 sm:px-12 max-w-3xl mx-auto flex flex-col ${!selectedModel ? 'h-screen justify-center items-center' : 'pt-12 md:pt-14 pb-14 md:pb-24 space-y-3 md:space-y-4'}`}>
      {!selectedModel && (
        <div className="flex flex-col items-center">
          <Image
            src="/images/brand/sovadina.dev.svg"
            alt="Sovadina.dev Logo"
            width={300}
            height={300}
            className="opacity-65 mb-16"
          />
          <ModelSelector onModelChange={handleModelChange} />
        </div>
      )}
      {selectedModel && (
        <>
          <ChatMessages messages={messages} />
          <ChatPanel messages={messages} query={query} modelType={selectedModel} />
        </>
      )}
    </div>
  )
}