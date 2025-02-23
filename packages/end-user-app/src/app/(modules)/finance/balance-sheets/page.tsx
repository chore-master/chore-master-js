'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import type { Account, BalanceEntry, BalanceSheetSummary } from '@/types'
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
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import React from 'react'
import { areaChartOptionsTemplate } from './optionsTemplate'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const router = useRouter()
  const timezone = useTimezone()

  // Balance sheets series
  const [balanceSheetsSeries, setBalanceSheetsSeries] = React.useState<any>({})
  const [isFetchingBalanceSheetsSeries, setIsFetchingBalanceSheetsSeries] =
    React.useState(false)

  // Chart options
  const [areaChartOptions, setAreaChartOptions] =
    React.useState<Highcharts.Options>(areaChartOptionsTemplate)

  // BalanceSheet
  const [balanceSheets, setBalanceSheets] = React.useState<
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
        setBalanceSheets(data)
      },
    })
    setIsFetchingBalanceSheets(false)
  }, [enqueueNotification])

  const fetchBalanceSheetsSeries = React.useCallback(async () => {
    setIsFetchingBalanceSheetsSeries(true)
    await choreMasterAPIAgent.get('/v1/finance/balance_sheets/series', {
      params: {},
      onError: () => {
        enqueueNotification(
          `Unable to fetch balance entry series now.`,
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setBalanceSheetsSeries(data)
      },
    })
    setIsFetchingBalanceSheetsSeries(false)
  }, [enqueueNotification])

  React.useEffect(() => {
    fetchBalanceSheets()
  }, [fetchBalanceSheets])

  React.useEffect(() => {
    fetchBalanceSheetsSeries()
  }, [fetchBalanceSheetsSeries])

  React.useEffect(() => {
    const accounts = balanceSheetsSeries.accounts || []
    const balanceSheets = balanceSheetsSeries.balance_sheets || []
    const balanceEntries = balanceSheetsSeries.balance_entries || []

    const accountReferenceToAccountMap: Record<string, Account> =
      accounts.reduce((acc: any, account: Account) => {
        acc[account.reference] = account
        return acc
      }, {})
    const balanceSheetReferenceToBalanceSheetMap: Record<
      string,
      BalanceSheetSummary
    > = balanceSheets.reduce((acc: any, balanceSheet: BalanceSheetSummary) => {
      acc[balanceSheet.reference] = balanceSheet
      return acc
    }, {})
    const accountReferenceToBalanceEntriesMap: Record<string, BalanceEntry[]> =
      balanceEntries.reduce((acc: any, balanceEntry: BalanceEntry) => {
        if (!acc[balanceEntry.account_reference]) {
          acc[balanceEntry.account_reference] = []
        }
        acc[balanceEntry.account_reference].push(balanceEntry)
        return acc
      }, {})

    const series: any = Object.entries(accountReferenceToBalanceEntriesMap).map(
      ([accountReference, balanceEntries]) => {
        const account = accountReferenceToAccountMap[accountReference]
        return {
          type: 'area',
          name: account.name,
          data: balanceEntries.map((balanceEntry) => {
            const balanceSheet =
              balanceSheetReferenceToBalanceSheetMap[
                balanceEntry.balance_sheet_reference as string
              ]
            return [
              new Date(`${balanceSheet.balanced_time}Z`).getTime() +
                timezone.offsetInMinutes * 60 * 1000,
              parseFloat(balanceEntry.amount),
            ]
          }),
        }
      }
    )
    setAreaChartOptions(
      Object.assign({}, areaChartOptionsTemplate, {
        series,
      })
    )
  }, [balanceSheetsSeries, timezone.offsetInMinutes])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="資產負債表"
          actions={[
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

        <ModuleFunctionHeader
          title={<Typography variant="h6">資金曲線</Typography>}
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchBalanceSheetsSeries}
                  disabled={isFetchingBalanceSheetsSeries}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingBalanceSheetsSeries}>
          <HighChartsCore options={areaChartOptions} />
        </ModuleFunctionBody>

        <ModuleFunctionHeader
          title={<Typography variant="h6">明細</Typography>}
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
                          `/finance/balance-sheets/${balanceSheet.reference}`
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
                            `/finance/balance-sheets/${balanceSheet.reference}/edit`
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
