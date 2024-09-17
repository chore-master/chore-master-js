import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="交易"
      navigations={[
        {
          title: '儀表板',
          href: '/trade',
          selectedWhenExactlyMatched: true,
        },
        {
          title: '執行階段',
          href: '/trade/session',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
