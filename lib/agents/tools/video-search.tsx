import { tool } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { searchSchema } from '@/lib/schema/search'
import { ToolProps } from '.'
import { VideoSearchSection } from '@/components/video-search-section'
import { API_URLS } from '@/lib/constants'
import { executeWithStreamErrorHandling } from './execute-with-error-handling'

export const videoSearchTool = ({ uiStream, fullResponse }: ToolProps) => tool({
  description: 'Search for videos from YouTube',
  parameters: searchSchema,
  execute: async ({ query }) => {
    const streamResults = createStreamableValue<string>()
    uiStream.append(<VideoSearchSection result={streamResults.value} />)

    const { result: searchResult, hasError } = await executeWithStreamErrorHandling(
      {
        uiStream,
        streamResults,
        errorMessage: 'Video Search API error:'
      },
      async () => {
        const response = await fetch(API_URLS.SERPER_VIDEO, {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.SERPER_API_KEY || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ q: query })
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      }
    )

    if (hasError) {
      fullResponse = `An error occurred while searching for videos with "${query}.`
      return searchResult
    }

    streamResults.done(JSON.stringify(searchResult))
    return searchResult
  }
})
