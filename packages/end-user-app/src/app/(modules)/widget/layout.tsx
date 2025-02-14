import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      loginRequired={false}
      moduleName="小工具"
      navigations={[
        {
          type: 'link',
          title: 'Sankey Demo',
          href: '/widget/sankey-demo',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'link',
          title: 'Transaction Visualizer',
          href: '/widget/tx-viz',
          selectedWhenExactlyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
