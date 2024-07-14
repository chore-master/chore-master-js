'use client'

import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, { ModuleFunctionBody } from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { GridColDef, GridRowModesModel, GridRowsProp } from '@mui/x-data-grid'
import React from 'react'

export default function Page() {
  const [netValueRows, setNetValueRows] = React.useState<GridRowsProp>([])
  const [isLoadingNetValueRows, setIsLoadingNetValueRows] =
    React.useState(false)
  const [netValueRowModesModel, setNetValueRowModesModel] =
    React.useState<GridRowModesModel>({})

  React.useEffect(() => {
    fetchNetValueRows()
  }, [])

  const fetchNetValueRows = async () => {
    setIsLoadingNetValueRows(true)
    await choreMasterAPIAgent.get('/v1/financial_management/net_values', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setNetValueRows(data)
      },
    })
    setIsLoadingNetValueRows(false)
  }

  const accountColumns: GridColDef[] = [
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
            columns={accountColumns}
            rowModesModel={netValueRowModesModel}
            onRowModesModelChange={setNetValueRowModesModel}
            setRows={setNetValueRows}
            loading={isLoadingNetValueRows}
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
