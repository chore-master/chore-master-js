import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
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
  sx,
}: Readonly<{
  children?: ReactNode
  title?: ReactNode
  actions?: ReactNode
  sx?: SxProps
}>) => (
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
