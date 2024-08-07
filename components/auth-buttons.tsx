'use client'

import React, { memo } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Button } from './ui/button'
import { useTranslations } from 'next-intl'

const AuthButtons: React.FC = memo(() => {
  const { user, isLoading, error } = useUser()
  const t = useTranslations('auth')

  if (isLoading) return null

  if (error) {
    console.error('Error loading user data:', error)
    return null
  }

  return (
    <>
      {user ? (
        <Button variant="outline" size="sm" asChild>
          <a href="/api/auth/logout" aria-label={t('logout')}>{t('logout')}</a>
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <a href="/api/auth/login" aria-label={t('login')}>{t('login')}</a>
        </Button>
      )}
    </>
  )
})

AuthButtons.displayName = 'AuthButtons'

export default AuthButtons