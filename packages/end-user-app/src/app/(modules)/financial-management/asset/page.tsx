'use client'

import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, { ModuleFunctionBody } from '@/components/ModuleFunction'
import { useEntity } from '@/utils/entity'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function Page() {
  const asset = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/assets',
    defaultList: [],
  })
  const [assetRowModesModel, setAssetRowModesModel] =
    React.useState<GridRowModesModel>({})

  const getNewAssetRow = () => {
    return {
      isNew: true,
      reference: uuidv4(),
      symbol: '',
    }
  }

  const handleEditAssetClick = (reference: GridRowId) => () => {
    setAssetRowModesModel({
      ...assetRowModesModel,
      [reference]: { mode: GridRowModes.Edit },
    })
  }

  const handleSaveAssetClick = (reference: GridRowId) => () => {
    setAssetRowModesModel({
      ...assetRowModesModel,
      [reference]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteAssetClick = (reference: GridRowId) => async () => {
    await asset.deleteByReference(reference)
  }

  const handleCancelEditAssetClick = (reference: GridRowId) => () => {
    setAssetRowModesModel({
      ...assetRowModesModel,
      [reference]: { mode: GridRowModes.View, ignoreModifications: true },
    })
    const editedRow = asset.list.find((row) => row.reference === reference)
    if (editedRow!.isNew) {
      asset.setList(asset.list.filter((row) => row.reference !== reference))
    }
  }

  const handleUpsertAssetRow = async ({
    isNew,
    ...upsertedRow
  }: GridRowModel) => {
    return await asset.upsertByReference({ isNew, upsertedEntity: upsertedRow })
  }

  const accountColumns: GridColDef[] = [
    {
      field: 'reference',
      headerName: '識別碼',
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'symbol',
      type: 'string',
      headerName: '識別符號',
      editable: true,
      flex: 1,
    },
    {
      field: '互動',
      type: 'actions',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = assetRowModesModel[id]?.mode === GridRowModes.Edit
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveAssetClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelEditAssetClick(id)}
              color="inherit"
            />,
          ]
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditAssetClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteAssetClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionBody>
          <ModuleDataGrid
            rows={asset.list}
            columns={accountColumns}
            rowModesModel={assetRowModesModel}
            onRowModesModelChange={setAssetRowModesModel}
            getNewRow={getNewAssetRow}
            setRows={asset.setList}
            processRowUpdate={handleUpsertAssetRow}
            loading={asset.isLoading}
            getRowId={(row) => row.reference}
          />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
