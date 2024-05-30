import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="Module 2"
      navigations={[
        {
          title: 'Dashboard',
          href: '/module2',
        },
        {
          title: 'Function 1',
          href: '/module2/function1',
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
