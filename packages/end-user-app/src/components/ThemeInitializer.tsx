'use client'

import { useColorScheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

// `setMode` should be called within context provider, so adding this additional component
export default function ThemeInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const { mode, setMode } = useColorScheme()
  const isMatchedDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  React.useEffect(() => {
    if (!mode) {
      setMode(isMatchedDarkMode ? 'dark' : 'light')
    }
  }, [mode, isMatchedDarkMode, setMode])

  return children
}
