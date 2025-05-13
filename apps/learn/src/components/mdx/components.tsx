import CodeBlock from '@/components/CodeBlock'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    // @ts-ignore
    <Typography
      variant="h4"
      component="h1"
      color="primary"
      gutterBottom
      sx={{ mt: 4 }}
      {...props}
    />
  ),
  h2: (props) => (
    // @ts-ignore
    <Typography
      variant="h5"
      component="h2"
      color="primary"
      gutterBottom
      sx={{ mt: 4 }}
      {...props}
    />
  ),
  h3: (props) => (
    // @ts-ignore
    <Typography
      variant="h6"
      component="h3"
      color="primary"
      gutterBottom
      sx={{ mt: 4 }}
      {...props}
    />
  ),
  code: (props) => {
    const language = props.className?.split('-')[1]
    if (!language) {
      return <code {...props} />
    }
    return <CodeBlock language={language} code={props.children as string} />
  },
  img: (props) => {
    return (
      // @ts-ignore
      <CardMedia
        component="img"
        image={props.src}
        // onLoad={() => console.log('this is loading')}
        // onError={() => console.log('this is error')}
        alt={props.alt}
        sx={{
          maxWidth: {
            xs: '100%',
            sm: '512px',
          },
          objectFit: 'cover',
        }}
      />
    )
  },
  hr: (props) => <Divider sx={{ my: 2 }} />,
  // @ts-ignore
  thead: (props) => <TableHead {...props} />,
  // @ts-ignore
  tbody: (props) => <TableBody {...props} />,
  // @ts-ignore
  tr: (props) => <TableRow {...props} />,
  // @ts-ignore
  td: (props) => <TableCell {...props} />,
}
