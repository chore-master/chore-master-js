import { MDXRenderer } from '@/components/mdx/Renderer'
import guideRepository from '@/libs/guides'
import Container from '@mui/material/Container'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const guide = await guideRepository.getBySlug((await params).slug)

  if (!guide) {
    return {
      title: '找不到內容',
      description: '請求的內容不存在或已被移除。',
    }
  }

  return {
    title: guide.frontMatter.title,
    description: guide.frontMatter.description,
    openGraph: {
      title: guide.frontMatter.title,
      description: guide.frontMatter.description,
      type: 'article',
      publishedTime: guide.frontMatter.date,
      tags: guide.frontMatter.tags,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const guide = await guideRepository.getBySlug((await params).slug)

  if (!guide) {
    notFound()
  }

  return (
    <Container sx={{ my: 4 }}>
      <MDXRenderer serializedContent={guide.serializedContent} />
    </Container>
  )
}
