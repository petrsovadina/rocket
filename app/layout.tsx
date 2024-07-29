import type { Metadata, Viewport } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { AppStateProvider } from '@/lib/utils/app-state'

const title = 'Morphic'
const description =
  'Plně open-source AI-powered vyhledávač s generativním uživatelským rozhraním.'

export const metadata: Metadata = {
  metadataBase: new URL('https://morphic.sh'),
  title,
  description,
  openGraph: {
    title,
    description
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@miiura'
  },
  icons: {
    icon: '/images/brand/raketa.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/brand/raketa.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&family=Raleway:wght@400&family=Open+Sans:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppStateProvider>
            <Header />
            {children}
            <Sidebar />
            <Footer />
            <Toaster />
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}