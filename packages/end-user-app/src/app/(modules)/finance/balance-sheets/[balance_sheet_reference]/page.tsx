'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import type { Account, Asset, BalanceSheetDetail, Resource } from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MuiLink from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Decimal from 'decimal.js'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { pieChartOptionsTemplate } from './optionsTemplate'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()
  const router = useRouter()
  const { balance_sheet_reference }: { balance_sheet_reference: string } =
    useParams()

  // Feed resource
  const [feedResources, setFeedResources] = React.useState<Resource[]>([])
  const [isFetchingFeedResources, setIsFetchingFeedResources] =
    React.useState(false)
  const [selectedFeedResourceReference, setSelectedFeedResourceReference] =
    React.useState('')

  // Settleable asset
  const [settleableAssets, setSettleableAssets] = React.useState<Asset[]>([])
  const [isFetchingSettleableAssets, setIsFetchingSettleableAssets] =
    React.useState(false)
  const [
    selectedSettleableAssetReference,
    setSelectedSettleableAssetReference,
  ] = React.useState('')

  // Balance sheet
  const [balanceSheet, setBalanceSheet] =
    React.useState<BalanceSheetDetail | null>(null)
  const [isFetchingBalanceSheet, setIsFetchingBalanceSheet] =
    React.useState(false)

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)

  // Prices
  const [prices, setPrices] = React.useState<any>([])
  const [isFetchingPrices, setIsFetchingPrices] = React.useState(false)

  // Chart
  const [pieChartOptions, setPieChartOptions] =
    React.useState<Highcharts.Options>(pieChartOptionsTemplate)

  const fetchFeedResources = React.useCallback(async () => {
    setIsFetchingFeedResources(true)
    await choreMasterAPIAgent.get('/v1/integration/end_users/me/resources', {
      params: {
        discriminators: [
          'oanda_feed',
          'yahoo_finance_feed',
          // 'coingecko_feed'
        ],
      },
      onError: () => {
        enqueueNotification(`Unable to fetch feed resources now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setFeedResources(data)
      },
    })
    setIsFetchingFeedResources(false)
  }, [enqueueNotification])

  const fetchSettleableAssets = React.useCallback(async () => {
    setIsFetchingSettleableAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/assets', {
      params: {
        is_settleable: true,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch settleable assets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setSettleableAssets(data)
      },
    })
    setIsFetchingSettleableAssets(false)
  }, [enqueueNotification])

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
  }, [balance_sheet_reference, enqueueNotification])

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

  React.useEffect(() => {
    fetchFeedResources()
  }, [fetchFeedResources])

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  React.useEffect(() => {
    fetchBalanceSheet()
  }, [fetchBalanceSheet])

  React.useEffect(() => {
    const feedResource = feedResources.find(
      (resource) => resource.reference === selectedFeedResourceReference
    )
    if (!feedResource) {
      setSelectedFeedResourceReference(feedResources[0]?.reference || '')
    }
  }, [feedResources, selectedFeedResourceReference])

  React.useEffect(() => {
    const settleableAsset = settleableAssets.find(
      (asset) => asset.reference === selectedSettleableAssetReference
    )
    if (!settleableAsset) {
      setSelectedSettleableAssetReference(settleableAssets[0]?.reference || '')
    }
  }, [settleableAssets, selectedSettleableAssetReference])

  React.useEffect(() => {
    if (balanceSheet) {
      const balancedTime = timezone
        .getLocalString(balanceSheet.balanced_time)
        .slice(0, -5)
      fetchAccounts(
        new Date(timezone.getUTCTimestamp(balancedTime)).toISOString()
      )
    }
  }, [balanceSheet, fetchAccounts])

  React.useEffect(() => {
    setPieChartOptions(
      Object.assign({}, pieChartOptionsTemplate, {
        series: [
          {
            name: 'Percentage',
            colorByPoint: true,
            data: [
              {
                name: 'A',
                y: 100,
              },
              {
                name: 'B',
                sliced: true,
                selected: true,
                y: 50,
              },
              {
                name: 'C',
                y: 30,
              },
            ],
          },
        ],
      })
    )
  }, [])

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
            結餘
          </MuiLink>
          {balanceSheet && (
            <span>
              <Chip size="small" label={balanceSheet.reference} />
            </span>
          )}
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          sticky
          title={<DatetimeBlock isoText={balanceSheet?.balanced_time} />}
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchBalanceSheet}
                  disabled={isFetchingBalanceSheet}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />

        <ModuleFunctionHeader
          title={<Typography variant="h6">結構組成</Typography>}
        />
        <ModuleFunctionBody>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
            >
              <FormControl variant="standard">
                <InputLabel>結算資產</InputLabel>
                <Select
                  value={selectedSettleableAssetReference}
                  onChange={(event: SelectChangeEvent) => {
                    setSelectedSettleableAssetReference(event.target.value)
                  }}
                  autoWidth
                >
                  {settleableAssets.map((asset) => (
                    <MenuItem key={asset.reference} value={asset.reference}>
                      {asset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard">
                <InputLabel>報價來源</InputLabel>
                <Select
                  value={selectedFeedResourceReference}
                  onChange={(event: SelectChangeEvent) => {
                    setSelectedFeedResourceReference(event.target.value)
                  }}
                  autoWidth
                >
                  {feedResources.map((resource) => (
                    <MenuItem
                      key={resource.reference}
                      value={resource.reference}
                    >
                      {resource.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
          <HighChartsCore options={pieChartOptions} />
        </ModuleFunctionBody>

        <ModuleFunctionHeader
          title={<Typography variant="h6">明細</Typography>}
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
        <ModuleFunctionBody
          loading={
            isFetchingBalanceSheet ||
            isFetchingAccounts ||
            isFetchingSettleableAssets
          }
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell align="right">#</NoWrapTableCell>
                  <NoWrapTableCell>帳戶</NoWrapTableCell>
                  <NoWrapTableCell align="right">數量</NoWrapTableCell>
                  <NoWrapTableCell>結算資產</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingBalanceSheet}
                isEmpty={balanceSheet?.balance_entries.length === 0}
              >
                {balanceSheet?.balance_entries.map((balanceEntry, index) => {
                  const account = accounts.find(
                    (account) =>
                      account.reference === balanceEntry.account_reference
                  )
                  const settleableAsset = settleableAssets.find(
                    (asset) =>
                      asset.reference === account?.settlement_asset_reference
                  )
                  const decimals = settleableAsset?.decimals
                  const amount =
                    decimals === undefined
                      ? 'N/A'
                      : new Decimal(balanceEntry.amount)
                          .dividedBy(new Decimal(10 ** decimals))
                          .toString()
                  return (
                    <TableRow key={balanceEntry.reference} hover>
                      <NoWrapTableCell align="right">
                        {index + 1}
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <Chip
                          size="small"
                          label={account?.name}
                          color="info"
                          variant="outlined"
                        />
                      </NoWrapTableCell>
                      <NoWrapTableCell align="right">{amount}</NoWrapTableCell>
                      <NoWrapTableCell>
                        <Chip
                          size="small"
                          label={settleableAsset?.name}
                          color="info"
                          variant="outlined"
                        />
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <Chip size="small" label={balanceEntry.reference} />
                      </NoWrapTableCell>
                    </TableRow>
                  )
                })}
              </StatefulTableBody>
            </Table>
          </TableContainer>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
