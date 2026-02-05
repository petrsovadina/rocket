import { tool } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { searchSchema } from '@/lib/schema/search'
import { SearchSection } from '@/components/search-section'
import { ToolProps } from '.'
import { API_URLS } from '@/lib/constants'
import { executeWithStreamErrorHandling } from './execute-with-error-handling'

export const searchTool = ({ uiStream, fullResponse }: ToolProps) => tool({
  description: 'Search the web for information',
  parameters: searchSchema,
  execute: async ({
    query,
    max_results,
    search_depth,
    include_domains,
    exclude_domains
  }) => {
    const streamResults = createStreamableValue<string>()
    uiStream.update(
      <SearchSection
        result={streamResults.value}
        includeDomains={include_domains}
      />
    )

    // Tavily API requires a minimum of 5 characters in the query
    const filledQuery =
      query.length < 5 ? query + ' '.repeat(5 - query.length) : query

    const { result: searchResult, hasError } = await executeWithStreamErrorHandling(
      {
        uiStream,
        streamResults,
        errorMessage: 'Search API error:'
      },
      () => tavilySearch(filledQuery, max_results, search_depth, include_domains, exclude_domains)
    )

    if (hasError) {
      fullResponse = `An error occurred while searching for "${query}.`
      return searchResult
    }

    streamResults.done(JSON.stringify(searchResult))
    return searchResult
  }
})

async function tavilySearch(
  query: string,
  maxResults: number = 10,
  searchDepth: 'basic' | 'advanced' = 'basic',
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<any> {
  const apiKey = process.env.TAVILY_API_KEY
  const response = await fetch(API_URLS.TAVILY_SEARCH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults < 5 ? 5 : maxResults,
      search_depth: searchDepth,
      include_images: true,
      include_answers: true,
      include_domains: includeDomains,
      exclude_domains: excludeDomains
    })
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  const data = await response.json()
  return data
}
