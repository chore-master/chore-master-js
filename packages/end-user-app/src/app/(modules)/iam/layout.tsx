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
          header: '基礎設施',
        },
        {
          title: '資料庫',
          href: '/iam/core/database',
          selectedWhenPartiallyMatched: true,
        },
        {
          header: '服務整合',
        },
        {
          title: 'Google',
          href: '/iam/integrations/google',
          selectedWhenPartiallyMatched: true,
        },
        {
          title: '永豐',
          href: '/iam/integrations/sinotrade',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
