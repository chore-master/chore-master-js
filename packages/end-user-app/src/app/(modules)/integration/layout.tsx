import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      loginRequired
      moduleName="整合"
      navigations={[
        {
          type: 'link',
          title: 'Google',
          href: '/integration/google',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: '永豐',
          href: '/integration/sinotrade',
          selectedWhenPartiallyMatched: true,
        },
        {
          type: 'link',
          title: 'OKX',
          href: '/integration/okxtrade',
          selectedWhenPartiallyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
