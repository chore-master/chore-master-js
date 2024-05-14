'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

export default function Theme({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      theme={createTheme({
        components: {
          MuiListItemButton: {
            defaultProps: {
              disableTouchRipple: true,
            },
          },
        },

        palette: {
          //   mode: 'dark',
          //   primary: { main: 'rgb(102, 157, 246)' },
          //   background: { paper: 'rgb(5, 30, 52)' },
        },
      })}
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
