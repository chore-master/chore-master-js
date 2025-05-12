'use client'

import ModuleLayout from '@/components/ModuleLayout'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const t = useTranslations('modules')
  return (
    <ModuleLayout
      loginRequired
      moduleName={t('profile.name')}
      navigations={[
        {
          type: 'link',
          title: t('profile.navigations.quota'),
          href: '/profile/quota',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
