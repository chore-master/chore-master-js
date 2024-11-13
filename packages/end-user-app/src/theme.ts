'use client'

// import { zhTW as coreZhTW } from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'
// import { zhTW } from '@mui/x-data-grid/locales'

const theme = createTheme(
  {
    colorSchemes: {
      dark: true,
    },
    components: {
      MuiListItemButton: {
        defaultProps: {
          disableTouchRipple: true,
        },
      },
      // MuiAppBar: {
      //   styleOverrides: {
      //     root: {
      //       backgroundColor: 'white',
      //       color: 'black',
      //     },
      //   },
      // },
    },

    palette: {
      //   mode: 'dark',
      //   primary: { main: 'rgb(102, 157, 246)' },
      //   background: { paper: 'rgb(5, 30, 52)' },
    },
  }
  // zhTW, // x-data-grid translations
  // coreZhTW // core translations
)

export default theme
