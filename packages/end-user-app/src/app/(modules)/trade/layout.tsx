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
          type: 'link',
          title: '儀表板',
          href: '/trade',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: '執行階段',
          href: '/trade/session',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: 'Risk Management',
          href: '/trade/risk_management',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
