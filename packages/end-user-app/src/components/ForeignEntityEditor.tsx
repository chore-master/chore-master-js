import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid'
import React from 'react'

export default function ForeignEntityEditor({
  params,
  localFieldToForeignEntityMap,
  localFieldName,
  foreignFieldName,
}: {
  params: GridRenderEditCellParams
  localFieldToForeignEntityMap: any
  localFieldName: string
  foreignFieldName: string
}) {
  const { id, value, field, hasFocus } = params
  const apiRef = useGridApiContext()
  const ref = React.useRef<HTMLInputElement>(null)
  const localFieldValue = params.row?.[localFieldName]

  React.useLayoutEffect(() => {
    if (hasFocus) {
      ref.current?.focus()
    }
  }, [hasFocus])

  const handleValueChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value
    apiRef.current.setEditCellValue({
      id,
      field: localFieldName,
      value: newValue,
    })
  }

  return (
    <FormControl size="small">
      <Select
        defaultValue={localFieldValue}
        value={value}
        onChange={handleValueChange}
        displayEmpty
        autoWidth
      >
        {Object.entries(localFieldToForeignEntityMap).map(
          ([key, value]: any) => (
            <MenuItem key={key} value={key}>
              {value[foreignFieldName]}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  )
}
