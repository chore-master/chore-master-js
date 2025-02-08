import ThemeProvider from '@/components/ThemeProvider'
import { TimezoneProvider } from '@/components/timezone'
import { NotificationProvider } from '@/utils/notification'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chore Master',
  description: 'Chore Master',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <NotificationProvider>
              <TimezoneProvider>{children}</TimezoneProvider>
            </NotificationProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
