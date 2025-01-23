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
      moduleName="金融"
      navigations={[
        {
          type: 'header',
          title: '市場',
          navigations: [
            {
              type: 'link',
              title: '生態',
              href: '/finance/market/ecosystem',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'link',
          title: '帳戶',
          href: '/finance/account',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          title: '資產',
          navigations: [
            {
              type: 'link',
              title: '類別',
              href: '/finance/asset/category',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          title: '權益',
          navigations: [
            {
              type: 'link',
              title: '總覽',
              href: '/finance/net-value/overview',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '明細',
              href: '/finance/net-value/statement',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'link',
          title: '投資組合',
          href: '/finance/portfolio',
          selectedWhenPartiallyMatched: true,
        },

        {
          type: 'divider',
        },
        {
          type: 'header',
          title: '交易',
          navigations: [
            {
              type: 'link',
              title: '執行階段',
              href: '/trade/session',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: 'Risk Management',
              href: '/trade/risk_management',
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
