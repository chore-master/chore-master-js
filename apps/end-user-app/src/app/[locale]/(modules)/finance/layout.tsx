'use client'

import ModuleLayout from '@/components/ModuleLayout'
import {
  SideNavigationCollapsible,
  SideNavigationLink,
} from '@/components/SideNavigationList'
import { useAuth } from '@/utils/auth'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = useAuth()
  const t = useTranslations('modules')
  return (
    <ModuleLayout
      loginRequired
      moduleName={t('finance.name')}
      navigations={[
        {
          type: 'collapsible',
          isDefaultCollapsed: false,
          getSelected: (isCollapsed: boolean, pathname: string) => {
            return isCollapsed && pathname.startsWith('/finance/market')
          },
          title: t('finance.navigations.market'),
          isVisible: auth.currentUserHasSomeOfRoles(['FREEMIUM']),
          navigations: [
            {
              type: 'link',
              title: t('finance.navigations.prices'),
              href: '/finance/market/prices',
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
          title: t('finance.navigations.myWealth'),
          isVisible: auth.currentUserHasSomeOfRoles(['FREEMIUM']),
          navigations: [
            {
              type: 'link',
              title: t('finance.navigations.assets'),
              href: '/finance/assets',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: t('finance.navigations.accounts'),
              href: '/finance/accounts',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: t('finance.navigations.balance'),
              href: '/finance/balance-sheets',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'collapsible',
          isDefaultCollapsed: false,
          title: t('finance.navigations.myInvestment'),
          isVisible: auth.currentUserHasSomeOfRoles(['FREEMIUM']),
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
              title: t('finance.navigations.portfolios'),
              href: '/finance/portfolios',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
          isVisible: auth.currentUserHasSomeOfRoles(['ADMIN']),
        },
        {
          type: 'collapsible',
          isDefaultCollapsed: true,
          title: t('finance.navigations.others'),
          isVisible: auth.currentUserHasSomeOfRoles(['ADMIN']),
          navigations: [
            {
              type: 'link',
              title: t('finance.navigations.interestRateQuotation'),
              href: '/finance/market/interest-rate-inspector',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: t('finance.navigations.ecosystem'),
              href: '/finance/market/ecosystem',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: t('finance.navigations.flow'),
              href: '/finance/market/flow',
              selectedWhenPartiallyMatched: true,
            },
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
