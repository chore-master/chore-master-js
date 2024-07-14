'use client'

import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, { ModuleFunctionBody } from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
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
  const [assetRows, setAssetRows] = React.useState<GridRowsProp>([])
  const [isLoadingAssetRows, setIsLoadingAssetRows] = React.useState(false)
  const [assetRowModesModel, setAssetRowModesModel] =
    React.useState<GridRowModesModel>({})

  React.useEffect(() => {
    fetchAssetRows()
  }, [])

  const fetchAssetRows = async () => {
    setIsLoadingAssetRows(true)
    await choreMasterAPIAgent.get('/v1/financial_management/assets', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setAssetRows(data)
      },
    })
    setIsLoadingAssetRows(false)
  }

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
    setIsLoadingAssetRows(true)
    await choreMasterAPIAgent.delete(
      `/v1/financial_management/assets/${reference}`,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          setAssetRows(assetRows.filter((row) => row.reference !== reference))
        },
      }
    )
    setIsLoadingAssetRows(false)
  }

  const handleCancelEditAssetClick = (reference: GridRowId) => () => {
    setAssetRowModesModel({
      ...assetRowModesModel,
      [reference]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = assetRows.find((row) => row.reference === reference)
    if (editedRow!.isNew) {
      setAssetRows(assetRows.filter((row) => row.reference !== reference))
    }
  }

  const handleUpsertAssetRow = async ({
    isNew,
    ...upsertedRow
  }: GridRowModel) => {
    setIsLoadingAssetRows(true)
    if (isNew) {
      await choreMasterAPIAgent.post(
        '/v1/financial_management/assets',
        upsertedRow,
        {
          onFail: ({ message }: any) => {
            alert(message)
          },
          onSuccess: () => {
            setAssetRows(
              assetRows.map((row) =>
                row.reference === upsertedRow.reference ? upsertedRow : row
              )
            )
          },
        }
      )
    } else {
      await choreMasterAPIAgent.patch(
        `/v1/financial_management/assets/${upsertedRow.reference}`,
        upsertedRow,
        {
          onFail: ({ message }: any) => {
            alert(message)
          },
          onSuccess: () => {
            setAssetRows(
              assetRows.map((row) =>
                row.reference === upsertedRow.reference ? upsertedRow : row
              )
            )
          },
        }
      )
    }
    setIsLoadingAssetRows(false)
    return upsertedRow
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
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveAssetClick(id)}
            />,
            <GridActionsCellItem
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
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditAssetClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
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
            rows={assetRows}
            columns={accountColumns}
            rowModesModel={assetRowModesModel}
            onRowModesModelChange={setAssetRowModesModel}
            getNewRow={getNewAssetRow}
            setRows={setAssetRows}
            processRowUpdate={handleUpsertAssetRow}
            loading={isLoadingAssetRows}
            getRowId={(row) => row.reference}
          />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
