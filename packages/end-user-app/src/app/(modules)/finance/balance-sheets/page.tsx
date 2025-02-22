'use client'

import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import type { BalanceSheetSummary } from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const router = useRouter()

  // BalanceSheet
  const [balanceSheets, setbalanceSheets] = React.useState<
    BalanceSheetSummary[]
  >([])
  const [isFetchingBalanceSheets, setIsFetchingBalanceSheets] =
    React.useState(false)

  const fetchBalanceSheets = React.useCallback(async () => {
    setIsFetchingBalanceSheets(true)
    await choreMasterAPIAgent.get('/v1/finance/balance_sheets', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch balance sheets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setbalanceSheets(data)
      },
    })
    setIsFetchingBalanceSheets(false)
  }, [enqueueNotification])

  React.useEffect(() => {
    fetchBalanceSheets()
  }, [fetchBalanceSheets])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="資產負債表"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchBalanceSheets}
                  disabled={isFetchingBalanceSheets}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
            <Button
              key="create"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                router.push(`/finance/balance-sheets/new`)
              }}
            >
              新增
            </Button>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingBalanceSheets}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell>結算時間</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingBalanceSheets}
                isEmpty={balanceSheets.length === 0}
              >
                {balanceSheets.map((balanceSheet) => (
                  <TableRow
                    key={balanceSheet.reference}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (balanceSheet.reference) {
                        router.push(
                          `/finance/balance-sheets/${balanceSheet.reference}/edit`
                        )
                      }
                    }}
                  >
                    <NoWrapTableCell>
                      <DatetimeBlock isoText={balanceSheet.balanced_time} />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip size="small" label={balanceSheet.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(
                            `/finance/balance-sheets/${balanceSheet.reference}`
                          )
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </NoWrapTableCell>
                  </TableRow>
                ))}
              </StatefulTableBody>
            </Table>
          </TableContainer>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
