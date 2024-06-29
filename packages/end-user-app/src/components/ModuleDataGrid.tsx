import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import {
  DataGrid,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import React from 'react'

interface EditToolbarProps {
  getNewRow: () => GridRowModel
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props

  const onInsertRowClick = () => {
    const newRow = props.getNewRow()
    setRows((oldRows) => [newRow, ...oldRows])
    setRowModesModel((oldModel) => ({
      [newRow.reference]: { mode: GridRowModes.Edit },
      ...oldModel,
    }))
  }

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={onInsertRowClick}
      >
        新增一行
      </Button>
    </GridToolbarContainer>
  )
}

export const ModuleDataGrid = ({
  getNewRow,
  setRows,
  ...rest
}: Readonly<{
  getNewRow: EditToolbarProps['getNewRow']
  setRows: EditToolbarProps['setRows']
}> &
  React.ComponentPropsWithoutRef<typeof DataGrid>) => {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )

  return (
    <DataGrid
      autoHeight
      editMode="row"
      rowModesModel={rowModesModel}
      slots={{
        toolbar: EditToolbar as GridSlots['toolbar'],
      }}
      slotProps={{
        toolbar: { getNewRow, setRows, setRowModesModel },
      }}
      localeText={{
        noRowsLabel: '沒有資料',
        MuiTablePagination: {
          getItemAriaLabel: (type: string) => {
            if (type === 'first') {
              return '第一頁'
            }
            if (type === 'last') {
              return '最後一頁'
            }
            if (type === 'next') {
              return '下一頁'
            }
            return '上一頁'
          },
          labelRowsPerPage: '每頁數量：',
          labelDisplayedRows: ({ from, to, count }: any) =>
            `第 ${from} 筆至第 ${to} 筆／共 ${
              count !== -1 ? count : `超過 ${to}`
            } 筆`,
        },
      }}
      {...rest}
    />
  )
}
