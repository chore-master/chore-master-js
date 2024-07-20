import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'

export default function ModuleFunction({
  children,
}: Readonly<{
  children?: React.ReactNode
}>) {
  return (
    <Box sx={{ p: 3 }}>
      <Container>{children}</Container>
    </Box>
  )
}

export const ModuleFunctionHeader = ({
  children,
  title,
  actions,
}: Readonly<{
  children?: React.ReactNode
  title?: React.ReactNode
  actions?: React.ReactNode
}>) => {
  return (
    <CardHeader
      title={title}
      action={actions ? <CardActions>{actions}</CardActions> : null}
    >
      {children}
    </CardHeader>
  )
}

export const ModuleFunctionBody = ({
  children,
  loading,
}: Readonly<{
  children?: React.ReactNode
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
