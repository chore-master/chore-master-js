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
import { Splitter, SplitterPanel } from 'primereact/splitter'
import React, { ReactNode } from 'react'
import './splitter.css'

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

export const ModuleSplitter = ({
  layout,
  style,
  children,
  ...props
}: Readonly<{
  layout: 'vertical' | 'horizontal'
  style?: React.CSSProperties
  children?: ReactNode
}>) => {
  const filteredChildren = React.Children.toArray(children).filter(Boolean)
  const childrenCount = filteredChildren.length

  if (childrenCount <= 1) {
    return children
  } else {
    return (
      <Splitter layout={layout} style={style} {...props}>
        {children}
      </Splitter>
    )
  }
}

export const ModuleSplitterPanel = ({
  transparent,
  size,
  style,
  children,
  ...props
}: Readonly<{
  transparent?: boolean
  size: number
  style?: React.CSSProperties
  children?: ReactNode
}>) => {
  if (transparent) {
    return children
  } else {
    return (
      <SplitterPanel size={size} style={style} {...props}>
        <Box sx={{ height: '100%' }}>{children}</Box>
      </SplitterPanel>
    )
  }
}

export const ModuleContainer = ({
  sticky,
  sx,
  children,
}: Readonly<{ sticky?: boolean; sx?: SxProps; children?: ReactNode }>) => {
  const { mode, setMode } = useColorScheme()
  if (sticky) {
    return (
      <Box
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 999,
          background: mode === 'dark' ? 'black' : 'hsl(0, 0%, 99%)',
          ...sx,
        }}
      >
        {children}
      </Box>
    )
  } else {
    return <Box sx={sx}>{children}</Box>
  }
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
