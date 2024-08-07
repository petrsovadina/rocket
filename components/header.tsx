'use client'

import React, { lazy, Suspense } from 'react'
import { ModeToggle } from './mode-toggle'
import { IconLogo } from './ui/icons'
import { cn } from '@/lib/utils'
import HistoryContainer from './history-container'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from './ui/button'

const AuthButtons = lazy(() => import('./auth-buttons'))

const Header = (): JSX.Element => {
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const newLocale = pathname.startsWith('/en') ? 'cs' : 'en'
    router.push(pathname.replace(/^\/[^\/]+/, `/${newLocale}`))
  }

  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div>
        <a href="/">
          <IconLogo className={cn('w-5 h-5')} />
          <span className="sr-only">Morphic</span>
        </a>
      </div>
      <div className="flex gap-2 items-center">
        <Button onClick={toggleLanguage} variant="outline" size="sm">
          {pathname.startsWith('/en') ? 'CS' : 'EN'}
        </Button>
        <Suspense fallback={<div>{t('loading')}</div>}>
          <AuthButtons />
        </Suspense>
        <ModeToggle />
        <HistoryContainer location="header" />
      </div>
    </header>
  )
}

export default Header