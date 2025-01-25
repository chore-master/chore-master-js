import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { PrimeReactProvider } from 'primereact/api'
import theme from '../theme'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <PrimeReactProvider>{children}</PrimeReactProvider>
    </MUIThemeProvider>
  )
}
