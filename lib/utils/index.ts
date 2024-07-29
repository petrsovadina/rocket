import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createOllama } from 'ollama-ai-provider'
import { createOpenAI } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { anthropic } from '@ai-sdk/anthropic'
import { CoreMessage } from 'ai'
import { MistralClient } from '@mistralai/mistralai'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ModelType = 'mistral' | 'ollama' | 'google' | 'anthropic' | 'openai'

export function getModel(modelType: ModelType, useSubModel = false) {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ? process.env.OLLAMA_BASE_URL + '/api' : undefined
  const ollamaModel = process.env.OLLAMA_MODEL
  const ollamaSubModel = process.env.OLLAMA_SUB_MODEL
  const openaiApiBase = process.env.OPENAI_API_BASE
  const openaiApiKey = process.env.OPENAI_API_KEY
  let openaiApiModel = process.env.OPENAI_API_MODEL || 'gpt-4o'
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  const mistralApiKey = process.env.MISTRAL_API_KEY

  switch (modelType) {
    case 'mistral':
      if (!mistralApiKey) {
        console.warn('Missing MISTRAL_API_KEY environment variable')
        return null
      }
      const mistral = new MistralClient(mistralApiKey)
      return async (messages: CoreMessage[]) => {
        const response = await mistral.chat({
          model: 'mistral-large-latest',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content as string,
          })),
          max_tokens: 128000,
        })
        return {
          role: 'assistant',
          content: response.choices[0].message.content,
        }
      }

    case 'ollama':
      if (!(ollamaBaseUrl && ollamaModel)) {
        console.warn('Missing Ollama configuration environment variables')
        return null
      }
      const ollama = createOllama({ baseURL: ollamaBaseUrl })
      return useSubModel && ollamaSubModel ? ollama(ollamaSubModel) : ollama(ollamaModel)

    case 'google':
      if (!googleApiKey) {
        console.warn('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable')
        return null
      }
      return google('models/gemini-1.5-pro-latest')

    case 'anthropic':
      if (!anthropicApiKey) {
        console.warn('Missing ANTHROPIC_API_KEY environment variable')
        return null
      }
      return anthropic('claude-3-5-sonnet-20240620')

    case 'openai':
    default:
      if (!openaiApiKey) {
        console.warn('Missing OPENAI_API_KEY environment variable')
        return null
      }
      const openai = createOpenAI({
        baseURL: openaiApiBase,
        apiKey: openaiApiKey,
        organization: ''
      })
      return openai.chat(openaiApiModel)
  }
}

export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages.map(message =>
    message.role === 'tool'
      ? {
          ...message,
          role: 'assistant',
          content: JSON.stringify(message.content),
          type: 'tool'
        }
      : message
  ) as CoreMessage[]
}

export const availableModels: { [key in ModelType]: string } = {
  mistral: 'Mistral Large',
  ollama: 'Ollama',
  google: 'Google Gemini',
  anthropic: 'Anthropic Claude',
  openai: 'OpenAI GPT'
}