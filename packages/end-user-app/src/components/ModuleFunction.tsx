'use client'

import { useSticky } from '@/hooks/useSticky'
import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import { useColorScheme, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
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
    <Box
      sx={{
        p: {
          xs: 0,
          sm: 3,
        },
        ...sx,
      }}
    >
      <Container sx={{ px: { xs: 0, sm: 3 } }}>{children}</Container>
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
  stickyTop,
  stickyBottom,
  sx,
  children,
}: Readonly<{
  stickyTop?: boolean
  stickyBottom?: boolean
  sx?: SxProps
  children?: ReactNode
}>) => {
  const theme = useTheme()
  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'))
  const top = isUpSm ? 64 : 56
  const bottom = 0
  let rootMargin = 0
  if (stickyTop) {
    rootMargin = -top
  } else if (stickyBottom) {
    rootMargin = -bottom
  }
  const { sentinel, isSticky } = useSticky({ rootMargin })
  const { mode } = useColorScheme()
  const commonStickySx = {
    position: 'sticky',
    zIndex: 999,
    background: mode === 'dark' ? 'black' : 'hsl(0, 0%, 99%)',
  }
  if (stickyTop) {
    return (
      <React.Fragment>
        {sentinel}
        <Box
          sx={Object.assign(
            {},
            commonStickySx,
            {
              top,
              boxShadow: isSticky
                ? '0 4px 4px -4px rgba(0, 0, 0, 0.2)'
                : 'none',
            },
            sx
          )}
        >
          {children}
        </Box>
      </React.Fragment>
    )
  } else if (stickyBottom) {
    return (
      <React.Fragment>
        <Box
          sx={Object.assign(
            {},
            commonStickySx,
            {
              bottom,
              boxShadow: isSticky
                ? '0 -4px 4px -4px rgba(0, 0, 0, 0.2)'
                : 'none',
            },
            sx
          )}
        >
          {children}
        </Box>
        {sentinel}
      </React.Fragment>
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
