import { createStreamableUI } from 'ai/rsc'
import { createStreamableValue } from 'ai/rsc'

interface StreamableToolContext {
  uiStream: ReturnType<typeof createStreamableUI>
  streamResults: ReturnType<typeof createStreamableValue<string>>
  errorMessage: string
}

export async function executeWithStreamErrorHandling<T>(
  context: StreamableToolContext,
  fn: () => Promise<T>
): Promise<{ result: T | undefined; hasError: boolean }> {
  try {
    const result = await fn()
    return { result, hasError: false }
  } catch (error) {
    console.error(context.errorMessage, error)
    context.uiStream.update(null)
    context.streamResults.done()
    return { result: undefined, hasError: true }
  }
}
