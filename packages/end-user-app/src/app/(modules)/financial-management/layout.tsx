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
          title: '帳戶',
          href: '/financial-management/account',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'header',
          title: '資產',
          navigations: [
            {
              type: 'link',
              title: '類別',
              href: '/financial-management/asset/category',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'header',
          title: '權益',
          navigations: [
            {
              type: 'link',
              title: '快照總覽',
              href: '/financial-management/net-value/overview',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '快照明細',
              href: '/financial-management/net-value/statement',
              selectedWhenPartiallyMatched: true,
            },
          ],
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
