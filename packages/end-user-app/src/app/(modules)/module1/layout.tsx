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
        {
          title: 'Function 33 33 33 3 3 3333 33 3',
          href: '/module1/function3',
        },
        {
          title: 'Function 4',
          href: '/module1/function4',
        },
        {
          title: 'Function 5',
          href: '/module1/function5',
        },
        {
          title: 'Function 6',
          href: '/module1/function6',
        },
        {
          title: 'Function 7',
          href: '/module1/function7',
        },
        {
          title: 'Function 8',
          href: '/module1/function8',
        },
        {
          title: 'Function 9',
          href: '/module1/function9',
        },
        {
          title: 'Function 10',
          href: '/module1/function10',
        },
        {
          title: 'Function 11',
          href: '/module1/function11',
        },
        {
          title: 'Function 12',
          href: '/module1/function12',
        },
        {
          title: 'Function 13',
          href: '/module1/function13',
        },
        {
          title: 'Function 14',
          href: '/module1/function14',
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
