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
  GridRenderEditCellParams,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

function CustomEditComponent(props: GridRenderEditCellParams) {
  return <input type="text" />
}

export default function Page() {
  const account = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/accounts',
    defaultList: [],
  })
  const asset = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/assets',
    defaultList: [],
  })
  const netValue = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/net_values',
    defaultList: [],
  })
  const [netValueRows, setNetValueRows] = React.useState<GridRowsProp>([])
  const [netValueRowModesModel, setNetValueRowModesModel] =
    React.useState<GridRowModesModel>({})

  React.useEffect(() => {
    const accountReferenceToAccountMap = account.getMapByReference()
    const assetReferenceToAssetMap = asset.getMapByReference()
    setNetValueRows(
      netValue.list.map((netValue) => {
        const account =
          accountReferenceToAccountMap?.[netValue.account_reference]
        const settlementAsset =
          assetReferenceToAssetMap?.[netValue.settlement_asset_reference]
        return {
          ...netValue,
          account_name: account?.name,
          settlement_asset_name: settlementAsset?.symbol,
        }
      })
    )
  }, [account.list, asset.list, netValue.list])

  const getNewNetValueRow = () => {
    return {
      isNew: true,
      reference: uuidv4(),
      account_reference: account.list[0]?.reference,
      settlement_asset_reference: asset.list[0]?.reference,
    }
  }

  const handleEditNetValueClick = (reference: GridRowId) => () => {
    setNetValueRowModesModel({
      ...netValueRowModesModel,
      [reference]: { mode: GridRowModes.Edit },
    })
  }

  const handleSaveNetValueClick = (reference: GridRowId) => () => {
    setNetValueRowModesModel({
      ...netValueRowModesModel,
      [reference]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteNetValueClick = (reference: GridRowId) => async () => {
    await netValue.deleteByReference(reference)
  }

  const handleCancelEditNetValueClick = (reference: GridRowId) => () => {
    setNetValueRowModesModel({
      ...netValueRowModesModel,
      [reference]: { mode: GridRowModes.View, ignoreModifications: true },
    })
    const editedRow = netValue.list.find((row) => row.reference === reference)
    if (editedRow!.isNew) {
      netValue.setList(
        netValue.list.filter((row) => row.reference !== reference)
      )
    }
  }

  const handleUpsertNetValueRow = async ({
    isNew,
    ...upsertedRow
  }: GridRowModel) => {
    return await netValue.upsertByReference({
      isNew,
      upsertedEntity: upsertedRow,
    })
  }

  const netValueColumns: GridColDef[] = [
    {
      field: 'reference',
      headerName: '識別碼',
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'account_reference',
      headerName: '帳戶識別碼',
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'account_name',
      type: 'string',
      headerName: '帳戶名稱',
      renderEditCell: (params: GridRenderEditCellParams) => (
        <CustomEditComponent {...params} />
      ),
    },
    {
      field: 'amount',
      type: 'string',
      headerName: '數量',
    },
    {
      field: 'settlement_asset_reference',
      headerName: '結算資產識別碼',
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'settlement_asset_name',
      type: 'string',
      headerName: '結算資產識別符號',
    },
    {
      field: 'settled_time',
      type: 'string',
      headerName: '結算時間',
      editable: true,
      flex: 1,
    },
    {
      field: '互動',
      type: 'actions',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode =
          netValueRowModesModel[id]?.mode === GridRowModes.Edit
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveNetValueClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelEditNetValueClick(id)}
              color="inherit"
            />,
          ]
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditNetValueClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteNetValueClick(id)}
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
            rows={netValueRows}
            columns={netValueColumns}
            rowModesModel={netValueRowModesModel}
            onRowModesModelChange={setNetValueRowModesModel}
            getNewRow={getNewNetValueRow}
            setRows={setNetValueRows}
            processRowUpdate={handleUpsertNetValueRow}
            loading={netValue.isLoading}
            getRowId={(row) => row.reference}
            columnVisibilityModel={{
              account_reference: false,
              settlement_asset_reference: false,
            }}
          />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
