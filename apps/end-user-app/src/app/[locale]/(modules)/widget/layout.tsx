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
      loginRequired={false}
      moduleName={t('widget.name')}
      navigations={[
        {
          type: 'link',
          title: 'T-Account Pyramid',
          href: '/widget/t-account-pyramid',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: 'Transaction Inspector',
          href: '/widget/transaction-inspector',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: 'Transaction Visualizer',
          href: '/widget/tx-viz',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: 'Sankey Demo',
          href: '/widget/sankey-demo',
          selectedWhenExactlyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
