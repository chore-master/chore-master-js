'use client'

import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, { ModuleFunctionBody } from '@/components/ModuleFunction'
import { useEntity } from '@/utils/entity'
import { GridColDef, GridRowModesModel, GridRowsProp } from '@mui/x-data-grid'
import React from 'react'

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
        return []
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
            setRows={netValue.setList}
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
