'use client'

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
  const [assetAnchorEl, setAssetAnchorEl] = React.useState<null | HTMLElement>(
    null
  )
  const asset = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/assets',
    defaultList: [],
  })
  const [assetRowModesModel, setAssetRowModesModel] =
    React.useState<GridRowModesModel>({})

  const handleOpenAssetMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAssetAnchorEl(event.currentTarget)
  }

  const handleCloseAssetMenu = () => {
    setAssetAnchorEl(null)
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
        <ModuleFunctionHeader
          title="資產列表"
          actions={[
            <Box key="more">
              <IconButton onClick={handleOpenAssetMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={assetAnchorEl}
                open={Boolean(assetAnchorEl)}
                onClose={handleCloseAssetMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link
                  href={`${CHORE_MASTER_API_HOST}/v1/account_center/integrations/google/spreadsheets/financial_management/spreadsheet_url?sheet_title=asset`}
                  passHref
                  legacyBehavior
                >
                  <MenuItem
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseAssetMenu}
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
