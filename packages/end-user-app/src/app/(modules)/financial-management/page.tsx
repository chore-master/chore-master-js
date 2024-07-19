'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import LineChart from '@/components/charts/LineChart'
import StackedAreaChart from '@/components/charts/StackedAreaChart'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import React from 'react'

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  { id: 4, col1: 'XYZ', col2: 'is Amazing' },
  { id: 5, col1: 'ABCD', col2: 'is Amazing' },
]

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
  { field: 'col3', headerName: 'Column 3', width: 150 },
  { field: 'col4', headerName: 'Column 4', width: 150 },
  { field: 'col5', headerName: 'Column 5', width: 150 },
]

export default function Page() {
  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="線圖" />
        <ModuleFunctionBody>
          <LineChart
            data={[
              { x: 1, y: 10 },
              { x: 5, y: 7 },
              { x: 2, y: 3 },
            ]}
            layout={{ width: '100%' }}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="面積圖" />
        <ModuleFunctionBody>
          <StackedAreaChart
            data={[
              {
                domain: new Date('2024-07-19T00:00:00Z'),
                group: 'xyz',
                value: 123.45,
              },

              {
                domain: new Date('2024-07-21T00:00:00Z'),
                group: 'abc',
                value: 111,
              },
              {
                domain: new Date('2024-07-22T00:00:00Z'),
                group: 'abc',
                value: -10,
              },
              {
                domain: new Date('2024-07-20T00:00:00Z'),
                group: 'abc',
                value: -20,
              },
            ]}
            colors={['#ff8c00', '#6b486b', '#98abc5', '#cccccc', 'red']}
            layout={{ width: '100%' }}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader
          title="資產配置"
          actions={<Button variant="contained">新增</Button>}
        />
        <ModuleFunctionBody>
          <DataGrid rows={rows} columns={columns} autoHeight />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
