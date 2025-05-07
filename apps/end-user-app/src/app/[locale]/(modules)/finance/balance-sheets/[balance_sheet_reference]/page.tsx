'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NumberBlock from '@/components/NumberBlock'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import { INTERMEDIATE_ASSET_SYMBOL } from '@/constants'
import type {
  Account,
  Asset,
  BalanceSheetDetail,
  MarkPrice,
} from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { getSyntheticPrice } from '@/utils/price'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
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

const chartTypes = [
  {
    label: '淨值組成',
    value: 'net_value_pie',
  },
  {
    label: '資產組成',
    value: 'asset_pie',
  },
  {
    label: '負債組成',
    value: 'liability_pie',
  },
]

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()
  const router = useRouter()
  const { balance_sheet_reference }: { balance_sheet_reference: string } =
    useParams()

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
  const [markPrices, setMarkPrices] = React.useState<MarkPrice[]>([])
  const [isFetchingMarkPrices, setIsFetchingMarkPrices] = React.useState(false)

  // Chart
  const [pieChartOptions, setPieChartOptions] =
    React.useState<Highcharts.Options>(pieChartOptionsTemplate)
  const [selectedChartType, setSelectedChartType] = React.useState(
    chartTypes[0].value
  )

  const fetchSettleableAssets = React.useCallback(async () => {
    setIsFetchingSettleableAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/users/me/assets', {
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
      `/v1/finance/users/me/balance_sheets/${balance_sheet_reference}`,
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
      await choreMasterAPIAgent.get('/v1/finance/users/me/accounts', {
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

  const fetchMarkPrices = React.useCallback(
    async (
      queryDatetimes: string[],
      queryPairs: {
        base_asset_reference: string
        quote_asset_reference: string
      }[]
    ) => {
      setIsFetchingMarkPrices(true)
      await choreMasterAPIAgent.post(
        `/v1/finance/users/me/query-mark-prices`,
        {
          query_datetimes: queryDatetimes,
          query_pairs: queryPairs,
          max_allowed_timedelta_ms: 1000 * 60 * 60 * 24 * 3,
        },
        {
          onError: () => {
            enqueueNotification(`Unable to fetch mark prices now.`, 'error')
          },
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: async ({ data }: any) => {
            setMarkPrices(data)
          },
        }
      )
      setIsFetchingMarkPrices(false)
    },
    [enqueueNotification]
  )

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  React.useEffect(() => {
    fetchBalanceSheet()
  }, [fetchBalanceSheet])

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
    if (balanceSheet && settleableAssets.length > 0) {
      const datetimes = [balanceSheet.balanced_time]
      const baseAsset = settleableAssets.find(
        (asset) => asset.symbol === INTERMEDIATE_ASSET_SYMBOL
      )
      if (!baseAsset) {
        enqueueNotification(
          `Intermediate asset ${INTERMEDIATE_ASSET_SYMBOL} not found.`,
          'error'
        )
        return
      }
      const queryPairs = settleableAssets
        .filter((asset) => asset.symbol !== INTERMEDIATE_ASSET_SYMBOL)
        .map((quoteAsset) => ({
          base_asset_reference: baseAsset.reference,
          quote_asset_reference: quoteAsset.reference,
        }))
      fetchMarkPrices(datetimes, queryPairs)
    }
  }, [balanceSheet, settleableAssets, fetchMarkPrices, enqueueNotification])

  React.useEffect(() => {
    if (
      selectedSettleableAssetReference &&
      balanceSheet &&
      markPrices.length > 0 &&
      accounts.length > 0 &&
      settleableAssets.length > 0
    ) {
      const intermediateAssetReference =
        settleableAssets.find(
          (asset) => asset.symbol === INTERMEDIATE_ASSET_SYMBOL
        )?.reference || ''
      const accountReferenceToAccountMap: Record<string, Account> =
        accounts.reduce((acc: any, account: Account) => {
          acc[account.reference] = account
          return acc
        }, {})
      const assetReferenceToSettleableAssetMap: Record<string, Asset> =
        settleableAssets.reduce((acc: any, asset: Asset) => {
          acc[asset.reference] = asset
          return acc
        }, {})
      const selectedSettleableAsset =
        assetReferenceToSettleableAssetMap[selectedSettleableAssetReference]

      const selectedSettleableAssetSymbol = selectedSettleableAsset?.symbol

      const accountSeries = balanceSheet.balance_entries.map((balanceEntry) => {
        const account =
          accountReferenceToAccountMap[balanceEntry.account_reference]
        const accountSettlementAsset =
          assetReferenceToSettleableAssetMap[account.settlement_asset_reference]
        const price = getSyntheticPrice(
          markPrices.filter(
            (markPrice: MarkPrice) =>
              markPrice.query_datetime === balanceSheet.balanced_time
          ),
          account.settlement_asset_reference,
          selectedSettleableAssetReference,
          intermediateAssetReference
        )
        const value = new Decimal(balanceEntry.amount)
          .dividedBy(10 ** accountSettlementAsset.decimals)
          .times(price)
          .toNumber()
        return {
          name: account.name,
          y: value,
        }
      })

      let series: Highcharts.SeriesOptionsType[] = []
      if (selectedChartType === 'net_value_pie') {
        series = [
          {
            id: `net_value_${selectedSettleableAssetSymbol}_pie`,
            type: 'pie',
            name: '淨值組成',
            data: [
              {
                name: '資產',
                y: accountSeries
                  .filter((point) => point.y > 0)
                  .reduce((acc, point) => acc + point.y, 0),
                custom: {
                  selectedSettleableAssetSymbol: selectedSettleableAssetSymbol,
                },
              },
              {
                name: '負債',
                y: -accountSeries
                  .filter((point) => point.y < 0)
                  .reduce((acc, point) => acc + point.y, 0),
                custom: {
                  selectedSettleableAssetSymbol: selectedSettleableAssetSymbol,
                },
              },
            ],
          },
        ]
      } else if (selectedChartType === 'asset_pie') {
        series = [
          {
            id: `asset_${selectedSettleableAssetSymbol}_pie`,
            type: 'pie',
            name: '資產組成',
            data: accountSeries
              .filter((point) => point.y > 0)
              .map((point) => ({
                ...point,
                custom: {
                  selectedSettleableAssetSymbol: selectedSettleableAssetSymbol,
                },
              }))
              .sort((a, b) => b.y - a.y),
          },
        ]
      } else if (selectedChartType === 'liability_pie') {
        series = [
          {
            id: `liability_${selectedSettleableAssetSymbol}_pie`,
            type: 'pie',
            name: '負債組成',
            data: accountSeries
              .filter((point) => point.y < 0)
              .map((point) => ({
                ...point,
                y: -point.y,
                custom: {
                  selectedSettleableAssetSymbol: selectedSettleableAssetSymbol,
                },
              }))
              .sort((a, b) => b.y - a.y),
          },
        ]
      }
      setPieChartOptions(
        Object.assign({}, pieChartOptionsTemplate, {
          series: series,
        })
      )
    }
  }, [
    balanceSheet,
    selectedSettleableAssetReference,
    selectedChartType,
    markPrices,
    accounts,
    settleableAssets,
  ])

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
            <ReferenceBlock
              label={balanceSheet.reference}
              primaryKey
              monospace
            />
          )}
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          stickyTop
          title={
            <Typography variant="h5" color="primary">
              <DatetimeBlock isoText={balanceSheet?.balanced_time} />
            </Typography>
          }
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

        <ModuleFunctionHeader subtitle="結構組成" />
        <ModuleFunctionBody
          loading={
            isFetchingSettleableAssets ||
            isFetchingBalanceSheet ||
            isFetchingMarkPrices
          }
        >
          <Box sx={{ minWidth: 480 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ p: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}
            >
              <FormControl variant="standard">
                <InputLabel>檢視維度</InputLabel>
                <Select
                  value={selectedChartType}
                  onChange={(event: SelectChangeEvent) => {
                    setSelectedChartType(event.target.value)
                  }}
                  autoWidth
                >
                  {chartTypes.map((chartType) => (
                    <MenuItem key={chartType.value} value={chartType.value}>
                      {chartType.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            </Stack>
            <HighChartsCore options={pieChartOptions} />
          </Box>
        </ModuleFunctionBody>

        <ModuleFunctionHeader
          subtitle="明細"
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
                  <NoWrapTableCell align="right">
                    <PlaceholderTypography>#</PlaceholderTypography>
                  </NoWrapTableCell>
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
                          .dividedBy(10 ** decimals)
                          .toFixed()
                  return (
                    <TableRow key={balanceEntry.reference} hover>
                      <NoWrapTableCell align="right">
                        <PlaceholderTypography>
                          {index + 1}
                        </PlaceholderTypography>
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <ReferenceBlock label={account?.name} foreignValue />
                      </NoWrapTableCell>
                      <NoWrapTableCell align="right">
                        {decimals == undefined ? (
                          amount
                        ) : (
                          <NumberBlock
                            value={amount}
                            fixedDecimals={decimals}
                            hasCommas
                          />
                        )}
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <ReferenceBlock
                          label={settleableAsset?.name}
                          foreignValue
                        />
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <ReferenceBlock
                          label={balanceEntry.reference}
                          primaryKey
                          monospace
                        />
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
