import Chip from '@mui/material/Chip'
import { SxProps } from '@mui/material/styles'
import Link from 'next/link'

export default function ReferenceBlock({
  label,
  primaryKey = false,
  foreignValue = false,
  monospace = false,
  sx,
  disabled = false,
  href,
}: {
  label?: string
  primaryKey?: boolean
  foreignValue?: boolean
  monospace?: boolean
  sx?: SxProps
  disabled?: boolean
  href?: string
}) {
  const fontFamily = monospace ? 'monospace' : undefined
  const variant = primaryKey ? undefined : 'outlined'
  const color = foreignValue ? 'info' : undefined
  const children = (
    <Chip
      size="small"
      label={label}
      sx={{ fontFamily, ...sx }}
      variant={variant}
      color={color}
      disabled={disabled}
    />
  )
  return href ? <Link href={href}>{children}</Link> : children
}
