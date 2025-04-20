import { SxProps } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function PlaceholderTypography({
  children,
  sx,
}: {
  children: React.ReactNode
  sx?: SxProps
}) {
  return (
    <Typography
      variant="body2"
      color="text.disabled"
      sx={{ userSelect: 'none', ...sx }}
    >
      {children}
    </Typography>
  )
}
