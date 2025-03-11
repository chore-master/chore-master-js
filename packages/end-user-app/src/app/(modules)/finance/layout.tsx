'use client'

import ModuleLayout from '@/components/ModuleLayout'
import {
  SideNavigationCollapsible,
  SideNavigationLink,
} from '@/components/SideNavigationList'
import { useAuth } from '@/utils/auth'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = useAuth()
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
          isVisible: auth.userIsSomeRole(['ADMIN']),
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
          type: 'collapsible',
          isDefaultCollapsed: false,
          title: '我的投資',
          isVisible: auth.userIsSomeRole(['ADMIN']),
          getSelected: (isCollapsed: boolean, pathname: string) => {
            return (
              isCollapsed &&
              (pathname.startsWith('/finance/instruments') ||
                pathname.startsWith('/finance/portfolio'))
            )
          },
          navigations: [
            {
              type: 'link',
              title: '交易品種',
              href: '/finance/instruments',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '投資組合',
              href: '/finance/portfolios',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
          isVisible: auth.userIsSomeRole(['ADMIN']),
        },
        {
          type: 'collapsible',
          isDefaultCollapsed: true,
          title: '其他',
          isVisible: auth.userIsSomeRole(['ADMIN']),
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
