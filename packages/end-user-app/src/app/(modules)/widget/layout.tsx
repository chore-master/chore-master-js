import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="外掛"
      navigations={[
        {
          title: '儀表板',
          href: '/plugin',
          selectedWhenExactlyMatched: true,
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
