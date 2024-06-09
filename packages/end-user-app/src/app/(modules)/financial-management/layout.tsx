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
          title: '資產存摺',
          href: '/financial-management/passbook',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
