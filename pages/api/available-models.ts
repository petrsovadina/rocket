import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const availableModels: Record<string, string> = {}

  if (process.env.OPENAI_API_KEY) {
    availableModels['openai'] = 'OpenAI GPT'
  }

  if (process.env.ANTHROPIC_API_KEY) {
    availableModels['anthropic'] = 'Anthropic Claude'
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    availableModels['google'] = 'Google Gemini'
  }

  if (process.env.MISTRAL_API_KEY) {
    availableModels['mistral'] = 'Mistral Large'
  }

  if (process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL) {
    availableModels['ollama'] = 'Ollama'
  }

  res.status(200).json(availableModels)
}