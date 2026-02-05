'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { PartialRelated } from '@/lib/schema/related'
import { Section } from './section'
import { Skeleton } from './ui/skeleton'
import { useMessageSubmit } from '@/lib/hooks/use-message-submit'
import { useAuth } from '@clerk/nextjs'

export interface SearchRelatedProps {
  relatedQueries: StreamableValue<PartialRelated>
}

export const SearchRelated: React.FC<SearchRelatedProps> = ({
  relatedQueries
}) => {
  const { isSignedIn } = useAuth()
  const { submit } = useMessageSubmit(isSignedIn)
  const [data, error, pending] = useStreamableValue(relatedQueries)
  const [related, setRelated] = useState<PartialRelated>()

  useEffect(() => {
    if (!data) return
    setRelated(data)
  }, [data])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLInputElement
    let query = ''
    if (submitter) {
      formData.append(submitter.name, submitter.value)
      query = submitter.value
    }

    await submit(query, formData)
  }

  return related ? (
    <Section title="Related" separator={true}>
      <form onSubmit={handleSubmit} className="flex flex-wrap">
        {Array.isArray(related.items) ? (
          related.items
            ?.filter(item => item?.query !== '')
            .map((item, index) => (
              <div className="flex items-start w-full" key={index}>
                <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-accent-foreground/50" />
                <Button
                  variant="link"
                  className="flex-1 justify-start px-0 py-1 h-fit font-semibold text-accent-foreground/50 whitespace-normal text-left"
                  type="submit"
                  name={'related_query'}
                  value={item?.query}
                >
                  {item?.query}
                </Button>
              </div>
            ))
        ) : (
          <div>Not an array</div>
        )}
      </form>
    </Section>
  ) : error ? null : (
    <Section title="Related" separator={true}>
      <Skeleton className="w-full h-6" />
    </Section>
  )
}

export default SearchRelated
