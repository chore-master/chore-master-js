import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote-client/serialize'
import fs from 'node:fs'
import path from 'node:path'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

export interface FrontMatter {
  slug: string
  isDraft: boolean
  title: string
  excerpt: string
  date: string
}

export const CONTENT_ROOT_PATH = path.join(process.cwd(), 'content/guides')

export async function getMetadata() {
  const files = fs.readdirSync(CONTENT_ROOT_PATH)

  const directories = files.filter((file) => {
    const filePath = path.join(CONTENT_ROOT_PATH, file)
    return fs.statSync(filePath).isDirectory()
  })

  const metadata = directories.map((dir) => {
    const filePath = path.join(CONTENT_ROOT_PATH, dir, 'index.mdx')
    const { data } = matter.read(filePath)
    return {
      dirPath: dir,
      filePath: filePath,
      frontMatter: data as FrontMatter,
    }
  })

  return metadata
}

export async function getBySlug(slug: string) {
  const metadata = await getMetadata()
  const metadatum = metadata.find(
    (metadatum) => metadatum.frontMatter.slug === slug
  )
  if (!metadatum) {
    return null
  }

  const { data, content } = matter.read(metadatum.filePath)
  const serializedContent = await serialize({
    source: content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypePrettyCode, { theme: 'github-dark' }],
        ],
        format: 'mdx',
      },
    },
  })
  return { frontMatter: data, serializedContent }
}

const guideRepository = {
  getMetadata,
  getBySlug,
}

export default guideRepository
