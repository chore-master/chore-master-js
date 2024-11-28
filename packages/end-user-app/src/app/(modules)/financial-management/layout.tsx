import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="財務管理"
      navigations={[
        {
          type: 'link',
          title: '儀表板',
          href: '/financial-management/dashboard',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: '帳戶',
          href: '/financial-management/account',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: '資產',
          href: '/financial-management/asset',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: '淨值',
          href: '/financial-management/net-value',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: '投資組合',
          href: '/financial-management/portfolio',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
