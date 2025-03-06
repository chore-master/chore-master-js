import { GridRenderCellParams } from '@mui/x-data-grid'

export default function ForeignEntity({
  params,
  localFieldToForeignEntityMap,
  localFieldName,
  foreignFieldName,
}: {
  params: GridRenderCellParams
  localFieldToForeignEntityMap: any
  localFieldName: string
  foreignFieldName: string
}) {
  const localFieldValue = params.row?.[localFieldName]
  const foreignEntity = localFieldToForeignEntityMap?.[localFieldValue]
  return foreignEntity?.[foreignFieldName]
}
