export function getProviderConfig() {
  return {
    useOllama: !!(process.env.OLLAMA_MODEL && process.env.OLLAMA_BASE_URL),
    useGoogle: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    useAnthropic: !!process.env.ANTHROPIC_API_KEY,
    useGroq: !!process.env.GROQ_API_KEY,
    useSpecificAPI: process.env.USE_SPECIFIC_API_FOR_WRITER === 'true'
  }
}
