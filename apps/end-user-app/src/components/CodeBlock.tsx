import { useColorScheme } from '@mui/material/styles'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function CodeBlock({
  language,
  code,
  customStyle = {},
  transparentBackground = true,
  showLineNumbers = false,
}: Readonly<{
  language?: string
  code?: string | null | undefined
  customStyle?: React.CSSProperties
  transparentBackground?: boolean
  showLineNumbers?: boolean
}>) {
  const { mode, setMode } = useColorScheme()
  const style = mode === 'dark' ? a11yDark : a11yLight
  let mergedCustomStyle = customStyle
  if (transparentBackground) {
    mergedCustomStyle = Object.assign(mergedCustomStyle, {
      margin: 0,
      padding: 0,
      background: 'transparent',
    })
  }
  mergedCustomStyle = Object.assign(mergedCustomStyle, customStyle)

  return (
    <SyntaxHighlighter
      language={language}
      style={style}
      customStyle={mergedCustomStyle}
      showLineNumbers={showLineNumbers}
    >
      {code as string}
    </SyntaxHighlighter>
  )
}
