'use client'

import { EndUserProvider } from '@/utils/auth'
import { EntitiesProvider } from '@/utils/entity'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <EndUserProvider>
      <EntitiesProvider>{children}</EntitiesProvider>
    </EndUserProvider>
  )
}
