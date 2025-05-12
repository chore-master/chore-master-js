import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 {...props} />,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
}
