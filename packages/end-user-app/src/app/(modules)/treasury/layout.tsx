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
          href: '/treasury',
          selectedWhenExactlyMatched: true,
        },
        {
          title: '資產配置',
          href: '/treasury/asset',
          selectedWhenPartiallyMatched: true,
        },
        {
          title: '投資組合',
          href: '/treasury/portfolio',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
