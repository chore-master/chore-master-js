'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/navigation'

const entities = [
  {
    reference: '0001',
    attribute1: '值1',
    attribute2: '值2',
  },
  {
    reference: '0002',
    attribute1: '值1',
    attribute2: '值2',
  },
]

export default function Page() {
  const router = useRouter()

  return (
    <ModuleFunction>
      <ModuleFunctionHeader
        title="某實體"
        actions={[
          <Tooltip key="refresh" title="立即重整">
            <span>
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>,
          <Button key="create" variant="contained" startIcon={<AddIcon />}>
            新增
          </Button>,
        ]}
      />

      <ModuleFunctionBody>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                <NoWrapTableCell>屬性1</NoWrapTableCell>
                <NoWrapTableCell>屬性2</NoWrapTableCell>
                <NoWrapTableCell align="right">操作</NoWrapTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entities.map((entity) => (
                <TableRow
                  key={entity.reference}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    router.push(`/example/entities/${entity.reference}`)
                  }}
                >
                  <NoWrapTableCell>
                    <Chip size="small" label={entity.reference} />
                  </NoWrapTableCell>
                  <NoWrapTableCell>{entity.attribute1}</NoWrapTableCell>
                  <NoWrapTableCell>{entity.attribute2}</NoWrapTableCell>
                  <NoWrapTableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </NoWrapTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
