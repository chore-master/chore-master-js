'use client'

import ForeignEntity from '@/components/ForeignEntity'
import ForeignEntityEditor from '@/components/ForeignEntityEditor'
import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import getConfig from '@/utils/config'
import { useEntity } from '@/utils/entity'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SaveIcon from '@mui/icons-material/Save'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import Link from 'next/link'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

const { CHORE_MASTER_API_HOST } = getConfig()

export default function Page() {
  const [netValueAnchorEl, setNetValueAnchorEl] =
    React.useState<null | HTMLElement>(null)
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
  const [netValueRowModesModel, setNetValueRowModesModel] =
    React.useState<GridRowModesModel>({})
  const [accountReferenceToAccountMap, setAccountReferenceToAccountMap] =
    React.useState({})
  const [assetReferenceToAssetMap, setAssetReferenceToAssetMap] =
    React.useState({})

  const handleOpenNetValueMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNetValueAnchorEl(event.currentTarget)
  }

  const handleCloseNetValueMenu = () => {
    setNetValueAnchorEl(null)
  }

  React.useEffect(() => {
    setAccountReferenceToAccountMap(account.getMapByReference())
  }, [account.list])
  React.useEffect(() => {
    setAssetReferenceToAssetMap(asset.getMapByReference())
  }, [asset.list])

  const getNewNetValueRow = () => {
    return {
      isNew: true,
      reference: uuidv4(),
      account_reference: account.list[0]?.reference,
      settlement_asset_reference: asset.list[0]?.reference,
      settled_time: new Date().toISOString(),
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

  const handleUpsertNetValueRow = async (
    { isNew, ...upsertedRow }: GridRowModel,
    _oldRow: GridRowModel
  ) => {
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
      type: 'string',
      headerName: '帳戶識別碼',
      editable: true,
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'account_name',
      type: 'string',
      headerName: '帳戶名稱',
      editable: true,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <ForeignEntity
          params={params}
          localFieldToForeignEntityMap={accountReferenceToAccountMap}
          localFieldName="account_reference"
          foreignFieldName="name"
        />
      ),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <ForeignEntityEditor
          params={params}
          localFieldToForeignEntityMap={accountReferenceToAccountMap}
          localFieldName="account_reference"
          foreignFieldName="name"
        />
      ),
    },
    {
      field: 'amount',
      type: 'number',
      headerName: '數量',
      editable: true,
    },
    {
      field: 'settlement_asset_reference',
      type: 'string',
      headerName: '結算資產識別碼',
      editable: true,
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'settlement_asset_symbol',
      type: 'string',
      headerName: '結算資產識別符號',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <ForeignEntity
          params={params}
          localFieldToForeignEntityMap={assetReferenceToAssetMap}
          localFieldName="settlement_asset_reference"
          foreignFieldName="symbol"
        />
      ),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <ForeignEntityEditor
          params={params}
          localFieldToForeignEntityMap={assetReferenceToAssetMap}
          localFieldName="settlement_asset_reference"
          foreignFieldName="symbol"
        />
      ),
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
        <ModuleFunctionHeader
          title="淨值列表"
          actions={[
            <Box>
              <IconButton onClick={handleOpenNetValueMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={netValueAnchorEl}
                open={Boolean(netValueAnchorEl)}
                onClose={handleCloseNetValueMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link
                  href={`${CHORE_MASTER_API_HOST}/v1/account_center/integrations/google/spreadsheets/financial_management/spreadsheet_url?sheet_title=net_value`}
                  passHref
                  legacyBehavior
                >
                  <MenuItem
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseNetValueMenu}
                  >
                    開啟資料來源試算表
                  </MenuItem>
                </Link>
              </Menu>
            </Box>,
          ]}
        />
        <ModuleFunctionBody>
          <ModuleDataGrid
            rows={netValue.list}
            columns={netValueColumns}
            rowModesModel={netValueRowModesModel}
            onRowModesModelChange={setNetValueRowModesModel}
            getNewRow={getNewNetValueRow}
            setRows={netValue.setList}
            processRowUpdate={handleUpsertNetValueRow}
            loading={netValue.isLoading || account.isLoading || asset.isLoading}
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
