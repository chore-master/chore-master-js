import Typography from '@mui/material/Typography'
import React from 'react'

export default function PlaceholderTypography({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Typography
      variant="body2"
      color="text.disabled"
      sx={{ userSelect: 'none' }}
    >
      {children}
    </Typography>
  )
}
