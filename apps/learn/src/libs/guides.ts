import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'

export interface FrontMatter {
  slug: string
  isDraft: boolean
  title: string
  excerpt: string
  date: string
}

export const CONTENT_ROOT_PATH = path.join(process.cwd(), 'content/guides')

export async function getAll() {
  const files = fs.readdirSync(CONTENT_ROOT_PATH)

  const directories = files.filter((file) => {
    const filePath = path.join(CONTENT_ROOT_PATH, file)
    return fs.statSync(filePath).isDirectory()
  })

  const entities = directories.map((dir) => {
    const filePath = path.join(CONTENT_ROOT_PATH, dir, 'index.mdx')
    const { data } = matter.read(filePath)
    return {
      ...data,
    } as FrontMatter
  })

  return entities
    .filter((entity) => !entity.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
