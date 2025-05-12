import { Link } from '@/i18n/navigation'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import Chip from '@mui/material/Chip'
import { SxProps } from '@mui/material/styles'
import { ReactElement } from 'react'

export default function ReferenceBlock({
  label,
  primaryKey = false,
  foreignValue = false,
  monospace = false,
  sx,
  disabled = false,
  href,
  icon,
}: {
  label?: string
  primaryKey?: boolean
  foreignValue?: boolean
  monospace?: boolean
  sx?: SxProps
  disabled?: boolean
  href?: string
  icon?: ReactElement
}) {
  const fontFamily = monospace ? 'monospace' : undefined
  const variant = primaryKey ? undefined : 'outlined'
  const color = foreignValue ? 'info' : undefined
  const mergedIcon = icon ? icon : href ? <RemoveRedEyeIcon /> : undefined
  const children = (
    <Chip
      size="small"
      label={label}
      sx={{ fontFamily, ...sx }}
      variant={variant}
      color={color}
      disabled={disabled}
      icon={mergedIcon}
    />
  )
  return href ? <Link href={href}>{children}</Link> : children
}
