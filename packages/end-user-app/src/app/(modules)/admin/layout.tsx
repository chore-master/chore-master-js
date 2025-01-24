import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      loginRequired
      moduleName="管理控制台"
      navigations={[
        {
          type: 'header',
          title: '基礎設施',
          navigations: [
            {
              type: 'link',
              title: '資料庫',
              href: '/admin/core/database',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
