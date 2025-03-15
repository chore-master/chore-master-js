'use client'

import ModuleLayout from '@/components/ModuleLayout'
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
      moduleName="整合"
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
