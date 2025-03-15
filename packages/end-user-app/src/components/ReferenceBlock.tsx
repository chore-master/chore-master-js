import Chip from '@mui/material/Chip'
import { SxProps } from '@mui/material/styles'

export default function ReferenceBlock({
  label,
  primaryKey = false,
  foreignValue = false,
  monospace = false,
  sx,
  disabled = false,
}: {
  label?: string
  primaryKey?: boolean
  foreignValue?: boolean
  monospace?: boolean
  sx?: SxProps
  disabled?: boolean
}) {
  const fontFamily = monospace ? 'monospace' : undefined
  const variant = primaryKey ? undefined : 'outlined'
  const color = foreignValue ? 'info' : undefined
  return (
    <Chip
      size="small"
      label={label}
      sx={{ fontFamily, ...sx }}
      variant={variant}
      color={color}
      disabled={disabled}
    />
  )
}
