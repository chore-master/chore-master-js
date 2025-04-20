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
      moduleName={t('admin.name')}
      navigations={[
        {
          type: 'header',
          title: t('admin.navigations.database'),
          navigations: [
            {
              type: 'link',
              title: t('admin.navigations.tables'),
              href: '/admin/database/tables',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: t('admin.navigations.migrations'),
              href: '/admin/database/migrations',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'header',
          title: t('admin.navigations.user'),
          navigations: [
            {
              type: 'link',
              title: t('admin.navigations.users'),
              href: '/admin/users',
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
