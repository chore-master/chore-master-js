import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="基礎設施"
      navigations={[
        {
          type: 'link',
          title: '儀表板',
          href: '/infra',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: '節點',
          href: '/infra/nodes',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: '資料卷',
          href: '/infra/volumes',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
