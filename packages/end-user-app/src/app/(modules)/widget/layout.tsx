import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="小工具"
      navigations={[
        {
          type: 'link',
          title: 'Web3 Ecosystem',
          href: '/widget/web3-ecosystem',
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
