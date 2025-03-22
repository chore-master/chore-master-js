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
          title: '資料庫',
          navigations: [
            {
              type: 'link',
              title: '資料表',
              href: '/admin/database/tables',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '遷徙管理',
              href: '/admin/database/migrations',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'header',
          title: '使用者',
          navigations: [
            {
              type: 'link',
              title: '使用者',
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
