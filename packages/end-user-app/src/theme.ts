'use client'

// import { zhTW as coreZhTW } from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'
// import { zhTW } from '@mui/x-data-grid/locales'

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#5D8AA8', // Soft blue
          light: '#7FA8C9',
          dark: '#3A6B8C',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#E57373', // Soft coral/pink
          light: '#FFB2B2',
          dark: '#AF4448',
          contrastText: '#FFFFFF',
        },
        background: {
          // default: '#f8f5e6', // Warm light background
          default: '#fffdf5', // Warm light background
          paper: '#fffdf5', // Warm white paper
        },
      },
    },
    dark: true,
  },
  components: {
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

export default theme
