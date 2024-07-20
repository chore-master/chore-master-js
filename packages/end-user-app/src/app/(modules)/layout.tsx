'use client'

import { EndUserProvider } from '@/utils/auth'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <EndUserProvider>{children}</EndUserProvider>
}
