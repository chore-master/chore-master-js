'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Paper from '@mui/material/Paper'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'

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
    <>
      <Box p={3}>
        <Box sx={{ margin: '0 auto', maxWidth: 1200 }}>
          <CardHeader
            title="帳戶列表"
            action={
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            }
          />
          <CardContent>
            <Paper elevation={1}>
              <DataGrid rows={rows} columns={columns} autoHeight />
            </Paper>
          </CardContent>
        </Box>
      </Box>
      <Box p={3}>
        <Box sx={{ margin: '0 auto', maxWidth: 1200 }}>
          <CardHeader
            title="資產配置"
            action={
              <CardActions>
                <Button variant="contained">新增</Button>
              </CardActions>
            }
          />
          <CardContent>
            <Paper elevation={1}>
              <DataGrid rows={rows} columns={columns} autoHeight />
            </Paper>
          </CardContent>
        </Box>
      </Box>
    </>
  )
}
