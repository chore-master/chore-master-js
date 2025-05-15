'use client'

import { mdxComponents } from '@/components/mdx/components'
import { MDXClient } from 'next-mdx-remote-client'
import { useState } from 'react'

interface MDXRendererProps {
  serializedContent: any
}

export function MDXRenderer({ serializedContent }: MDXRendererProps) {
  const [renderError, setRenderError] = useState<Error | null>(null)

  if (renderError) {
    return (
      <div>
        <h3>內容渲染錯誤</h3>
        <p>很抱歉，顯示此內容時發生問題。請稍後再試，或聯絡管理員。</p>
      </div>
    )
  }

  try {
    return (
      <MDXClient
        compiledSource={serializedContent.compiledSource}
        components={mdxComponents}
        scope={serializedContent.scope}
        frontmatter={serializedContent.frontmatter}
      />
    )
  } catch (error) {
    if (error instanceof Error) {
      setRenderError(error)
    } else {
      setRenderError(new Error('未知錯誤'))
    }

    return (
      <div>
        <h3>內容渲染錯誤</h3>
        <p>很抱歉，顯示此內容時發生問題。請稍後再試，或聯絡管理員。</p>
      </div>
    )
  }
}
