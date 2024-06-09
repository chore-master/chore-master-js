'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'

const columns: GridColDef[] = [{ field: 'name', headerName: '名字' }]

export default function Page() {
  const [rows, setRows] = React.useState([])

  React.useEffect(() => {
    const fetchRows = async () => {
      choreMasterAPIAgent.get('/v1/financial_management/accounts', {
        params: {},
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: async ({ data }: any) => {
          setRows(data)
        },
      })
    }
    fetchRows()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="帳戶列表"
          actions={<Button variant="contained">新增</Button>}
        />
        <ModuleFunctionBody>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.reference}
            autoHeight
          />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
