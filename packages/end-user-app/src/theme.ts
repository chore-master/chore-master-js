'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          color: 'black',
        },
      },
    },
  },

  palette: {
    //   mode: 'dark',
    //   primary: { main: 'rgb(102, 157, 246)' },
    //   background: { paper: 'rgb(5, 30, 52)' },
  },
})

export default theme
