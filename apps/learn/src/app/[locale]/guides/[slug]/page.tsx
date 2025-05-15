import { MDXRenderer } from '@/components/mdx/Renderer'
import guideRepository from '@/libs/guides'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageParams {
  locale: string
  slug: string
}

interface PageProps {
  params: Promise<PageParams>
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

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params
  const guide = await guideRepository.getBySlug(slug)

  if (!guide) {
    notFound()
  }

  return (
    <Container sx={{ my: 4 }}>
      <Stack spacing={2} sx={{ mb: 8 }}>
        <Typography variant="h3" color="text.secondary" align="center">
          {guide.frontMatter.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {guide.frontMatter.excerpt}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {new Date(guide.frontMatter.date).toLocaleString(locale, {
            hour12: false,
          })}
        </Typography>
      </Stack>
      <MDXRenderer serializedContent={guide.serializedContent} />
    </Container>
  )
}
