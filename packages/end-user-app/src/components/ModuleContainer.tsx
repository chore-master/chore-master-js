import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

export default function ModuleContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={0} sx={{ padding: 2 }}>
        {children}
      </Paper>
    </Box>
  )
}
