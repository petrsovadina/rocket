'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

function IconLogo({ className, ...props }: React.ComponentProps<'div'>) {
  const { theme } = useTheme()
  const logoSrc = theme === 'dark' 
    ? 'https://utfs.io/f/z2Za8Zqs0NofAGnUw4pUgL0MncePqOyK1wT2fFWsjl5pBSb9'  // Nové tmavé logo
    : '/brand/favicon.svg'    // Původní světlé logo

  return (
    <div className={cn('relative h-4 w-4', className)} {...props}>
      <Image
        src={logoSrc}
        alt="Morphic Logo"
        layout="fill"
        objectFit="contain"
      />
    </div>
  )
}

export { IconLogo }
