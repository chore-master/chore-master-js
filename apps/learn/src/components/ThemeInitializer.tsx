'use client'

import { useColorScheme } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

// `setMode` should be called within context provider, so adding this additional component
export default function ThemeInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const { mode, setMode } = useColorScheme()

  React.useEffect(() => {
    setMode('light')
  }, [])

  // const isMatchedDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // https://mui.com/material-ui/customization/dark-mode/#toggling-color-mode
  if (!mode) {
    return null
  }
  return children
}
