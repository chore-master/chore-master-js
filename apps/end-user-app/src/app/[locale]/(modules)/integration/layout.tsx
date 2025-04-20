'use client'

import ModuleLayout from '@/components/ModuleLayout'
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
      moduleName={t('integration.name')}
      navigations={[
        {
          type: 'link',
          title: '運算器',
          isVisible: auth.currentUserHasSomeOfRoles(['FREEMIUM']),
          href: '/integration/operators',
          selectedWhenPartiallyMatched: true,
        },
        // {
        //   type: 'link',
        //   title: 'Google',
        //   href: '/integration/google',
        //   selectedWhenPartiallyMatched: true,
        // },
        // {
        //   type: 'link',
        //   title: '永豐',
        //   href: '/integration/sinotrade',
        //   selectedWhenPartiallyMatched: true,
        // },
        // {
        //   type: 'link',
        //   title: 'OKX',
        //   href: '/integration/okxtrade',
        //   selectedWhenPartiallyMatched: true,
        // },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
