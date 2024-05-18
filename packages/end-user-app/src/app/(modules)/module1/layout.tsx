import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="Module 1"
      navigations={[
        {
          title: 'Dashboard',
          href: '/module1',
        },
        {
          title: 'Function 1',
          href: '/module1/function1',
        },
        {
          title: 'Function 2',
          href: '/module1/function2',
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
