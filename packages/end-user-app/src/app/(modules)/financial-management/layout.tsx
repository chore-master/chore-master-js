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
          title: '儀表板',
          href: '/financial-management',
          selectedWhenExactlyMatched: true,
        },
        {
          title: '帳戶',
          href: '/financial-management/account',
          selectedWhenPartiallyMatched: true,
        },
        {
          title: '資產',
          href: '/financial-management/asset',
          selectedWhenPartiallyMatched: true,
        },
        {
          title: '淨值',
          href: '/financial-management/net-value',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
