'use client'

import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, { ModuleFunctionBody } from '@/components/ModuleFunction'
import { useEntities } from '@/utils/entity'
import { GridColDef, GridRowModesModel } from '@mui/x-data-grid'
import React from 'react'

export default function Page() {
  const [netValueRowModesModel, setNetValueRowModesModel] =
    React.useState<GridRowModesModel>({})

  const entities = useEntities({
    account: { endpoint: '/v1/financial_management/accounts' },
    asset: { endpoint: '/v1/financial_management/assets' },
    netValue: { endpoint: '/v1/financial_management/net_values' },
  })

  const accountReferenceToAccountMap = entities.account.list.reduce(
    (acc: any, entity: any) => {
      acc[entity['reference']] = entity
      return acc
    },
    {}
  )
  const assetReferenceToAssetMap = entities.asset.list.reduce(
    (acc: any, entity: any) => {
      acc[entity['reference']] = entity
      return acc
    },
    {}
  )
  const netValueRows =
    entities.netValue?.list.map((netValue) => {
      const account = accountReferenceToAccountMap?.[netValue.account_reference]
      const settlementAsset =
        assetReferenceToAssetMap?.[netValue.settlement_asset_reference]

      return {
        ...netValue,
        account_name: account?.name,
        settlement_asset_name: settlementAsset?.symbol,
      }
    }) || []

  React.useEffect(() => {
    if (!entities.account?.isFetchedAll) {
      entities.account?.fetchAll()
    }
  }, [entities.account?.isFetchedAll])

  React.useEffect(() => {
    if (!entities.asset?.isFetchedAll) {
      entities.asset?.fetchAll()
    }
  }, [entities.asset?.isFetchedAll])

  React.useEffect(() => {
    if (!entities.netValue?.isFetchedAll) {
      entities.netValue?.fetchAll()
    }
  }, [entities.netValue?.isFetchedAll])

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
            setRows={entities.netValue?.setList}
            loading={entities.netValue?.isFetchingAll}
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
