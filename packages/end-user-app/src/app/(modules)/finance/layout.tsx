'use client'

import ModuleLayout from '@/components/ModuleLayout'
import {
  SideNavigationCollapsible,
  SideNavigationLink,
} from '@/components/SideNavigationList'
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
          type: 'collapsible',
          isDefaultCollapsed: false,
          getSelected: (isCollapsed: boolean, pathname: string) => {
            return isCollapsed && pathname.startsWith('/finance/market')
          },
          title: '市場',
          navigations: [
            {
              type: 'link',
              title: '利率行情',
              href: '/finance/market/interest-rate-inspector',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '生態',
              href: '/finance/market/ecosystem',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '流量',
              href: '/finance/market/flow',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'collapsible',
          isDefaultCollapsed: false,
          getSelected: (
            isCollapsed: boolean,
            pathname: string,
            nav: SideNavigationCollapsible
          ) => {
            return (
              isCollapsed &&
              (nav.navigations as SideNavigationLink[]).some((n) =>
                pathname.startsWith(n.href)
              )
            )
          },
          title: '我的資金',
          navigations: [
            {
              type: 'link',
              title: '資產',
              href: '/finance/assets',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '帳戶',
              href: '/finance/accounts',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '結餘',
              href: '/finance/balance-sheets',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
        },
        // {
        //   type: 'header',
        //   title: '權益',
        //   navigations: [
        //     {
        //       type: 'link',
        //       title: '總覽',
        //       href: '/finance/net-value/overview',
        //       selectedWhenPartiallyMatched: true,
        //     },
        //     {
        //       type: 'link',
        //       title: '明細',
        //       href: '/finance/net-value/statement',
        //       selectedWhenPartiallyMatched: true,
        //     },
        //   ],
        // },
        // {
        //   type: 'divider',
        // },
        {
          type: 'collapsible',
          isDefaultCollapsed: true,
          title: '實驗功能',
          navigations: [
            {
              type: 'link',
              title: '投資組合',
              href: '/finance/portfolio',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'collapsible',
          isDefaultCollapsed: true,
          title: '其他',
          navigations: [
            {
              type: 'link',
              title: '執行階段',
              href: '/finance/trade/session',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: 'Risk Management',
              href: '/finance/trade/risk_management',
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
