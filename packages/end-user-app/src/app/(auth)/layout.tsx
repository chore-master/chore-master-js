'use client'

import { AuthProvider } from '@/utils/auth'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthProvider>{children}</AuthProvider>
}
