import Chip from '@mui/material/Chip'

export default function ReferenceBlock({
  label,
  primaryKey = false,
  foreignValue = false,
  monospace = false,
}: {
  label?: string
  primaryKey?: boolean
  foreignValue?: boolean
  monospace?: boolean
}) {
  const fontFamily = monospace ? 'monospace' : undefined
  const variant = primaryKey ? undefined : 'outlined'
  const color = foreignValue ? 'info' : undefined
  return (
    <Chip
      size="small"
      label={label}
      sx={{ fontFamily }}
      variant={variant}
      color={color}
    />
  )
}
