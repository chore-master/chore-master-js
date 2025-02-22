'use client'

import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import { financeBalanceEntryTypes } from '@/constants'
import type { Account, Asset, BalanceSheetDetail } from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MuiLink from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()
  const router = useRouter()
  const { balance_sheet_reference }: { balance_sheet_reference: string } =
    useParams()

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)

  // BalanceSheet
  const [balanceSheet, setBalanceSheet] =
    React.useState<BalanceSheetDetail | null>(null)
  const [isFetchingBalanceSheet, setIsFetchingBalanceSheet] =
    React.useState(false)

  const fetchAssets = React.useCallback(async () => {
    setIsFetchingAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/assets', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch assets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setAssets(data)
      },
    })
    setIsFetchingAssets(false)
  }, [enqueueNotification])

  const fetchAccounts = React.useCallback(
    async (activeAsOfTime: string) => {
      setIsFetchingAccounts(true)
      await choreMasterAPIAgent.get('/v1/finance/accounts', {
        params: {
          active_as_of_time: activeAsOfTime,
        },
        onError: () => {
          enqueueNotification(`Unable to fetch accounts now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: { data: Account[] }) => {
          setAccounts(data)
        },
      })
      setIsFetchingAccounts(false)
    },
    [enqueueNotification]
  )

  const fetchBalanceSheet = React.useCallback(async () => {
    setIsFetchingBalanceSheet(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/balance_sheets/${balance_sheet_reference}`,
      {
        params: {},
        onError: () => {
          enqueueNotification(`Unable to fetch balance sheet now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: { data: BalanceSheetDetail }) => {
          setBalanceSheet(data)
        },
      }
    )
    setIsFetchingBalanceSheet(false)
  }, [balance_sheet_reference])

  React.useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  React.useEffect(() => {
    fetchBalanceSheet()
  }, [])

  React.useEffect(() => {
    if (balanceSheet) {
      const balancedTime = timezone
        .getLocalString(balanceSheet.balanced_time)
        .slice(0, -5)
      fetchAccounts(
        new Date(timezone.getUTCTimestamp(balancedTime)).toISOString()
      )
    }
  }, [balanceSheet])

  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/finance/balance-sheets"
          >
            資產負債表
          </MuiLink>
          {balanceSheet && (
            <span>
              <Chip
                size="small"
                sx={{ ml: 1 }}
                label={balanceSheet.reference}
              />
            </span>
          )}
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          title={<DatetimeBlock isoText={balanceSheet?.balanced_time} />}
          actions={[
            <Tooltip key="edit" title="編輯">
              <IconButton
                onClick={() => {
                  router.push(
                    `/finance/balance-sheets/${balance_sheet_reference}/edit`
                  )
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingAccounts}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell>帳戶</NoWrapTableCell>
                  <NoWrapTableCell>類型</NoWrapTableCell>
                  <NoWrapTableCell>數量</NoWrapTableCell>
                  <NoWrapTableCell>結算資產</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingBalanceSheet}
                isEmpty={balanceSheet?.balance_entries.length === 0}
              >
                {balanceSheet?.balance_entries.map((balanceEntry) => (
                  <TableRow key={balanceEntry.reference} hover>
                    <NoWrapTableCell>
                      <Chip
                        size="small"
                        label={
                          accounts.find(
                            (account) =>
                              account.reference ===
                              balanceEntry.account_reference
                          )?.name
                        }
                        color="info"
                        variant="outlined"
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {
                        financeBalanceEntryTypes.find(
                          (balanceEntryType) =>
                            balanceEntryType.value === balanceEntry.entry_type
                        )?.label
                      }
                    </NoWrapTableCell>
                    <NoWrapTableCell>{balanceEntry.amount}</NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip
                        size="small"
                        label={
                          assets.find(
                            (asset) =>
                              asset.reference === balanceEntry.asset_reference
                          )?.name
                        }
                        color="info"
                        variant="outlined"
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip size="small" label={balanceEntry.reference} />
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
