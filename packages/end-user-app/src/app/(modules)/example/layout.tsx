import ModuleLayout from '@/components/ModuleLayout'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import { grey } from '@mui/material/colors'
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ModuleLayout
      loginRequired={false}
      moduleName="範例模組"
      navigations={[
        {
          type: 'collapsible',
          isDefaultCollapsed: false,
          title: '常用情境',
          navigations: [
            {
              type: 'link',
              title: '瀏覽實體',
              href: '/example/entities',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '頁籤',
              href: '/example/tab',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '分割面板',
              href: '/example/splitter',
              selectedWhenPartiallyMatched: true,
              endNode: (
                <SplitscreenIcon fontSize="small" sx={{ color: grey[500] }} />
              ),
            },
            {
              type: 'header',
              title: '載入狀態',
              navigations: [
                {
                  type: 'link',
                  title: '頁面層級',
                  href: '/example/loading/page_level',
                  selectedWhenPartiallyMatched: true,
                },
                {
                  type: 'link',
                  title: '內容層級',
                  href: '/example/loading/content_level',
                  selectedWhenPartiallyMatched: true,
                },
              ],
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          title: '特殊情境',
          navigations: [
            {
              type: 'link',
              title:
                '名字很長長長長長長長長長長長長長長長長長長長長長長的功能（文字應自動折疊）',
              href: '/example/long_title',
              selectedWhenPartiallyMatched: true,
            },
            {
              type: 'link',
              title: '404',
              href: '/example/404',
              selectedWhenPartiallyMatched: true,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          title: '花式選單',
        },
        {
          type: 'link',
          title: '頂層選項 1',
          href: '#',
          navigations: [
            {
              type: 'link',
              title: '子選項 1.1',
              href: '#',
            },
            {
              type: 'link',
              title: '子選項 1.2',
              href: '#',
              navigations: [
                {
                  type: 'link',
                  title: '子選項 1.2.1',
                  href: '#',
                },
              ],
            },
            {
              type: 'link',
              title: '子選項 1.3',
              href: '#',
            },
            {
              type: 'header',
              title: '子標題',
            },
            {
              type: 'link',
              title: '子選項 1.4',
              href: '#',
            },
            {
              type: 'link',
              title: '子選項 1.5',
              href: '#',
            },
          ],
        },
        {
          type: 'link',
          title: '頂層選項 2',
          href: '#',
          navigations: [
            {
              type: 'link',
              title: '子選項 2.1',
              href: '#',
              navigations: [
                {
                  type: 'link',
                  title: '子選項 2.1.1',
                  href: '#',
                  navigations: [
                    {
                      type: 'link',
                      title: '子選項 2.1.1.1',
                      href: '#',
                      navigations: [
                        {
                          type: 'link',
                          title: '子選項 2.1.1.1.1',
                          href: '#',
                          navigations: [
                            {
                              type: 'link',
                              title: '子選項 2.1.1.1.1.1',
                              href: '#',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'link',
              title: '子選項 2.2',
              href: '#',
            },
            {
              type: 'link',
              title: '子選項 2.3',
              href: '#',
            },
            {
              type: 'link',
              title: '子選項 2.4',
              href: '#',
            },
            {
              type: 'link',
              title: '子選項 2.5',
              href: '#',
            },
          ],
        },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
