'use client'

import { useRouter } from 'next/navigation'

const COOKIE_NAME = 'freeQueryUsed'

function getFreeQueryUsed(): boolean {
  return document.cookie.includes(`${COOKIE_NAME}=true`)
}

function setFreeQueryUsed(): void {
  document.cookie = `${COOKIE_NAME}=true; path=/; max-age=86400; SameSite=Lax`
}

export function useQueryGuard(isSignedIn?: boolean) {
  const router = useRouter()

  function guardQuery(): boolean {
    if (isSignedIn) return true
    if (!getFreeQueryUsed()) {
      setFreeQueryUsed()
      return true
    }
    router.push('/sign-in')
    return false
  }

  return { guardQuery }
}
