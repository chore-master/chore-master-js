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
              href: '/iam/core/database',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          title: '服務整合',
          navigations: [
            {
              type: 'link',
              title: 'Google',
              href: '/iam/integrations/google',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '永豐',
              href: '/iam/integrations/sinotrade',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: 'OKX',
              href: '/iam/integrations/okxtrade',
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
