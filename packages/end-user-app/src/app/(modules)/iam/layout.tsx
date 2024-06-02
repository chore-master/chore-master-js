import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="帳戶中心"
      navigations={[
        {
          title: '儀表板',
          href: '/iam',
          selectedWhenExactlyMatched: true,
        },
        {
          title: '整合',
          href: '/iam/integration',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
