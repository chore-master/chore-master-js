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
          type: 'link',
          title: '儀表板',
          href: '/sample-module',
          selectedWhenExactlyMatched: true,
        },
        {
          type: 'header',
          title: '子分類',
          navigations: [
            {
              type: 'link',
              title: '第一個功能',
              href: '/sample-module/function1',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '二號功能',
              href: '/sample-module/function2',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'link',
          title: '名字很長長長長長長長長長長長長長長長長長長長長長長的功能三',
          href: '/sample-module/function3',
        },
        {
          type: 'header',
          title: '此段落功能都不存在',
        },
        {
          type: 'link',
          title: '功能四',
          href: '/sample-module/function4',
        },
        {
          type: 'link',
          title: 'Function 5',
          href: '/sample-module/function5',
        },
        {
          type: 'link',
          title: 'Function 6',
          href: '/sample-module/function6',
        },
        {
          type: 'link',
          title: 'Function 7',
          href: '/sample-module/function7',
        },
        {
          type: 'link',
          title: 'Function 8',
          href: '/sample-module/function8',
        },
        {
          type: 'link',
          title: 'Function 9',
          href: '/sample-module/function9',
        },
        {
          type: 'link',
          title: 'Function 10',
          href: '/sample-module/function10',
        },
        {
          type: 'link',
          title: 'Function 11',
          href: '/sample-module/function11',
        },
        {
          type: 'link',
          title: 'Function 12',
          href: '/sample-module/function12',
        },
        {
          type: 'link',
          title: 'Function 13',
          href: '/sample-module/function13',
        },
        {
          type: 'link',
          title: 'Function 14',
          href: '/sample-module/function14',
        },
        {
          type: 'link',
          title: 'Function 15',
          href: '/sample-module/function15',
        },
        {
          type: 'link',
          title: 'Function 16',
          href: '/sample-module/function16',
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
