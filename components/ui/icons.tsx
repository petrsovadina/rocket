'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative h-4 w-4', className)} {...props}>
      <Image
        src="/brand/favicon.svg"
        alt="Morphic Logo"
        layout="fill"
        objectFit="contain"
      />
    </div>
  )
}

export { IconLogo }