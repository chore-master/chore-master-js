import ModuleLayout from '@/components/ModuleLayout'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      moduleName="範例模組"
      navigations={[
        {
          title: '儀表板',
          href: '/sample-module',
          selectedWhenExactlyMatched: true,
        },
        {
          header: '子分類',
        },
        {
          title: '第一個功能',
          href: '/sample-module/function1',
          selectedWhenPartiallyMatched: true,
        },
        {
          title: '二號功能',
          href: '/sample-module/function2',
          selectedWhenPartiallyMatched: true,
        },
        {
          title: '名字很長長長長長長長長長長長長長長長長長長長長長長的功能三',
          href: '/sample-module/function3',
        },
        {
          header: '此段落功能都不存在',
        },
        {
          title: '功能四',
          href: '/sample-module/function4',
        },
        {
          title: 'Function 5',
          href: '/sample-module/function5',
        },
        {
          title: 'Function 6',
          href: '/sample-module/function6',
        },
        {
          title: 'Function 7',
          href: '/sample-module/function7',
        },
        {
          title: 'Function 8',
          href: '/sample-module/function8',
        },
        {
          title: 'Function 9',
          href: '/sample-module/function9',
        },
        {
          title: 'Function 10',
          href: '/sample-module/function10',
        },
        {
          title: 'Function 11',
          href: '/sample-module/function11',
        },
        {
          title: 'Function 12',
          href: '/sample-module/function12',
        },
        {
          title: 'Function 13',
          href: '/sample-module/function13',
        },
        {
          title: 'Function 14',
          href: '/sample-module/function14',
        },
        {
          title: 'Function 15',
          href: '/sample-module/function15',
        },
        {
          title: 'Function 16',
          href: '/sample-module/function16',
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
