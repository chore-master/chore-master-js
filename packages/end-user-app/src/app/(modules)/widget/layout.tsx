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
