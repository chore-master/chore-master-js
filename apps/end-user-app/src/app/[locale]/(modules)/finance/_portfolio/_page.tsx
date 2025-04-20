'use client'

import { ModuleDataGrid } from '@/components/_ModuleDataGrid'
import ForeignEntity from '@/components/ForeignEntity'
import ForeignEntityEditor from '@/components/ForeignEntityEditor'
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SaveIcon from '@mui/icons-material/Save'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
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
  const [billAnchorEl, setBillAnchorEl] = React.useState<null | HTMLElement>(
    null
  )
  const account = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/accounts',
    defaultList: [],
  })
  const asset = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/assets',
    defaultList: [],
  })
  const bill = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/bills',
    defaultList: [],
  })
  const [billRowModesModel, setBillRowModesModel] =
    React.useState<GridRowModesModel>({})
  const [accountReferenceToAccountMap, setAccountReferenceToAccountMap] =
    React.useState({})
  const [assetReferenceToAssetMap, setAssetReferenceToAssetMap] =
    React.useState({})

  const handleOpenBillMenu = (event: React.MouseEvent<HTMLElement>) => {
    setBillAnchorEl(event.currentTarget)
  }

  const handleCloseBillMenu = () => {
    setBillAnchorEl(null)
  }

  React.useEffect(() => {
    setAccountReferenceToAccountMap(account.getMapByReference())
  }, [account.list])
  React.useEffect(() => {
    setAssetReferenceToAssetMap(asset.getMapByReference())
  }, [asset.list])

  const getNewBillRow = () => {
    return {
      isNew: true,
      reference: uuidv4(),
      account_reference: account.list[0]?.reference,
      business_type: 'trade',
      accounting_type: 'buy',
      amount_change: 0,
      asset_reference: asset.list[0]?.reference,
      order_reference: null,
      billed_time: new Date().toISOString(),
    }
  }

  const handleEditBillClick = (reference: GridRowId) => () => {
    setBillRowModesModel({
      ...billRowModesModel,
      [reference]: { mode: GridRowModes.Edit },
    })
  }

  const handleSaveBillClick = (reference: GridRowId) => () => {
    setBillRowModesModel({
      ...billRowModesModel,
      [reference]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteBillClick = (reference: GridRowId) => async () => {
    await bill.deleteByReference(reference)
  }

  const handleCancelEditBillClick = (reference: GridRowId) => () => {
    setBillRowModesModel({
      ...billRowModesModel,
      [reference]: { mode: GridRowModes.View, ignoreModifications: true },
    })
    const editedRow = bill.list.find((row) => row.reference === reference)
    if (editedRow!.isNew) {
      bill.setList(bill.list.filter((row) => row.reference !== reference))
    }
  }

  const handleUpsertNetValueRow = async (
    { isNew, ...upsertedRow }: GridRowModel,
    _oldRow: GridRowModel
  ) => {
    return await bill.upsertByReference({
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
        const isInEditMode = billRowModesModel[id]?.mode === GridRowModes.Edit
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveBillClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelEditBillClick(id)}
              color="inherit"
            />,
          ]
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditBillClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteBillClick(id)}
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
          title="帳單列表"
          actions={[
            <Box key="more">
              <IconButton onClick={handleOpenBillMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={billAnchorEl}
                open={Boolean(billAnchorEl)}
                onClose={handleCloseBillMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link
                  href={`${CHORE_MASTER_API_HOST}/v1/account_center/integrations/google/spreadsheets/financial_management/spreadsheet_url?sheet_title=bill`}
                  passHref
                  legacyBehavior
                >
                  <MenuItem
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseBillMenu}
                  >
                    <ListItemIcon>
                      <OpenInNewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>在試算表顯示</ListItemText>
                  </MenuItem>
                </Link>
              </Menu>
            </Box>,
          ]}
        />
        <ModuleFunctionBody>
          <ModuleDataGrid
            rows={bill.list}
            columns={netValueColumns}
            rowModesModel={billRowModesModel}
            onRowModesModelChange={setBillRowModesModel}
            getNewRow={getNewBillRow}
            setRows={bill.setList}
            processRowUpdate={handleUpsertNetValueRow}
            loading={bill.isLoading || account.isLoading || asset.isLoading}
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
