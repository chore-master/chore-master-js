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
              { date: 1, A: 10, B: 20, D: 10 },
              { date: 1, E: 5 },
              { date: 2, A: 15, B: 15, C: 20, E: -5 },
              { date: 3, B: 10, C: -10, E: -30 },
              { date: 4, A: 15, C: 10, D: 5 },
              { date: 5, D: 15 },
            ]}
            keys={['A', 'B', 'C', 'D', 'E']}
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
