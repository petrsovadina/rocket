import { tool } from 'ai'
import { retrieveSchema } from '@/lib/schema/retrieve'
import { ToolProps } from '.'
import { SearchSkeleton } from '@/components/search-skeleton'
import { API_URLS, MODEL_CONFIG } from '@/lib/constants'
import { SearchResults as SearchResultsType } from '@/lib/types'
import RetrieveSection from '@/components/retrieve-section'

export const retrieveTool = ({ uiStream, fullResponse }: ToolProps) => tool({
  description: 'Retrieve content from the web',
  parameters: retrieveSchema,
  execute: async ({ url }) => {
    let hasError = false
    // Append the search section
    uiStream.append(<SearchSkeleton />)

    let results: SearchResultsType | undefined
    try {
      const response = await fetch(`${API_URLS.JINA_READER}${url}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-With-Generated-Alt': 'true'
        }
      })
      const json = await response.json()
      if (!json.data || json.data.length === 0) {
        hasError = true
      } else {
        // Limit the content to 5000 characters
        if (json.data.content.length > MODEL_CONFIG.CONTENT_LIMIT) {
          json.data.content = json.data.content.slice(0, MODEL_CONFIG.CONTENT_LIMIT)
        }
        results = {
          results: [
            {
              title: json.data.title,
              content: json.data.content,
              url: json.data.url
            }
          ],
          query: '',
          images: []
        }
      }
    } catch (error) {
      hasError = true
      console.error('Retrieve API error:', error)
    }

    if (hasError || !results) {
      fullResponse = `An error occurred while retrieving "${url}".`
      uiStream.update(null)
      return results
    }

    uiStream.update(<RetrieveSection data={results} />)

    return results
  }
})
