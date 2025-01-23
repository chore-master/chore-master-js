'use client'

import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import { useColorScheme } from '@mui/material/styles'
import { ReactNode } from 'react'

export default function ModuleFunction({
  children,
  sx,
}: Readonly<{
  children?: ReactNode
  sx?: SxProps
}>) {
  return (
    <Box sx={{ p: 3, ...sx }}>
      <Container>{children}</Container>
    </Box>
  )
}

export const ModuleFunctionHeader = ({
  children,
  title,
  actions,
  sticky,
  sx,
}: Readonly<{
  children?: ReactNode
  title?: ReactNode
  actions?: ReactNode
  sticky?: boolean
  sx?: SxProps
}>) => {
  const { mode, setMode } = useColorScheme()
  const childrenNode = (
    <CardHeader
      title={title}
      action={actions ? <CardActions>{actions}</CardActions> : null}
      sx={{
        flexWrap: 'wrap',
        gap: 2,
        wordBreak: 'break-all',
        ...sx,
      }}
    >
      {children}
    </CardHeader>
  )
  if (sticky) {
    return (
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 999,
          background: mode === 'dark' ? 'black' : 'hsl(0, 0%, 99%)',
        }}
      >
        {childrenNode}
      </Paper>
    )
  }
  return childrenNode
}

export const ModuleFunctionBody = ({
  children,
  loading,
}: Readonly<{
  children?: ReactNode
  loading?: boolean
}>) => {
  return (
    <CardContent>
      <Paper elevation={1} sx={{ overflowX: 'auto' }}>
        {loading ? <LinearProgress color="inherit" /> : null}
        {children}
      </Paper>
    </CardContent>
  )
}
