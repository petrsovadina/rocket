export const MESSAGE_TYPES = {
  ANSWER: 'answer',
  RELATED: 'related',
  FOLLOWUP: 'followup',
  INQUIRY: 'inquiry',
  TOOL: 'tool',
  INPUT: 'input',
  INPUT_RELATED: 'input_related',
  END: 'end',
  SKIP: 'skip'
} as const

export const MODEL_CONFIG = {
  MAX_TOKENS: 2500,
  CONTENT_LIMIT: 5000,
  MAX_MESSAGES_SPECIFIC_API: 5,
  MAX_MESSAGES_OLLAMA: 1,
  MAX_MESSAGES_DEFAULT: 10
} as const

export const API_URLS = {
  JINA_READER: 'https://r.jina.ai/',
  TAVILY_SEARCH: 'https://api.tavily.com/search',
  SERPER_VIDEO: 'https://google.serper.dev/videos',
  GROQ_BASE: 'https://api.groq.com/openai/v1'
} as const

export const MODEL_DEFAULTS = {
  GROQ: 'llama-3.3-70b-versatile',
  OPENAI: 'gpt-4o',
  GOOGLE: 'models/gemini-1.5-pro-latest',
  ANTHROPIC: 'claude-3-5-sonnet-20240620'
} as const
