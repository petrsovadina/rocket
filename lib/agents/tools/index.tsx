import { createStreamableUI } from 'ai/rsc'
import { retrieveTool } from './retrieve'
import { searchTool } from './search'
import { videoSearchTool } from './video-search'

export interface ToolProps {
  uiStream: ReturnType<typeof createStreamableUI>
  fullResponse: string
}

export const getTools = ({ uiStream, fullResponse }: ToolProps) => {
  const toolProps = { uiStream, fullResponse }

  return {
    search: searchTool(toolProps),
    retrieve: retrieveTool(toolProps),
    ...(process.env.SERPER_API_KEY
      ? { videoSearch: videoSearchTool(toolProps) }
      : {})
  }
}
