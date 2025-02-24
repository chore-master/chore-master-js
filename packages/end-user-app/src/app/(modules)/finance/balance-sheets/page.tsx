'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import { INTERMEDIATE_ASSET_SYMBOL } from '@/constants'
import type {
  Account,
  Asset,
  BalanceEntry,
  BalanceSheetSeries,
  BalanceSheetSummary,
  Resource,
} from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { getSyntheticPrice } from '@/utils/price'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
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

  // Balance sheets series
  const [balanceSheetsSeries, setBalanceSheetsSeries] =
    React.useState<BalanceSheetSeries>({
      assets: [],
      accounts: [],
      balance_sheets: [],
      balance_entries: [],
    })
  const [balanceSheetsCount, setBalanceSheetsCount] = React.useState(0)
  const [balanceSheetsPage, setBalanceSheetsPage] = React.useState(0)
  const [balanceSheetsRowsPerPage, setBalanceSheetsRowsPerPage] =
    React.useState(5)
  const [isFetchingBalanceSheetsSeries, setIsFetchingBalanceSheetsSeries] =
    React.useState(false)

  // Prices
  const [prices, setPrices] = React.useState<any>([])
  const [isFetchingPrices, setIsFetchingPrices] = React.useState(false)

  // Chart options
  const [areaChartOptions, setAreaChartOptions] =
    React.useState<Highcharts.Options>(areaChartOptionsTemplate)

  const fetchFeedResources = React.useCallback(async () => {
    setIsFetchingFeedResources(true)
    await choreMasterAPIAgent.get('/v1/integration/end_users/me/resources', {
      params: {
        discriminators: ['oanda_feed', 'yahoo_finance_feed', 'coingecko_feed'],
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

  const fetchBalanceSheetsSeries = React.useCallback(async () => {
    setIsFetchingBalanceSheetsSeries(true)
    await choreMasterAPIAgent.get('/v1/finance/balance_sheets/series', {
      params: {
        offset: balanceSheetsPage * balanceSheetsRowsPerPage,
        limit: balanceSheetsRowsPerPage,
      },
      onError: () => {
        enqueueNotification(
          `Unable to fetch balance entry series now.`,
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data, metadata }: any) => {
        setBalanceSheetsSeries(data)
        setBalanceSheetsCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingBalanceSheetsSeries(false)
  }, [balanceSheetsPage, balanceSheetsRowsPerPage, enqueueNotification])

  const fetchPrices = React.useCallback(
    async (
      feedResourceReference: string,
      datetimes: string[],
      instrumentSymbols: string[]
    ) => {
      setIsFetchingPrices(true)
      await choreMasterAPIAgent.post(
        `/v1/integration/end_users/me/resources/${feedResourceReference}/feed/fetch_prices`,
        {
          target_datetimes: datetimes,
          target_interval: '1d',
          instrument_symbols: instrumentSymbols,
        },
        {
          onError: () => {
            enqueueNotification(`Unable to fetch prices now.`, 'error')
          },
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: async ({ data }: any) => {
            setPrices(data)
          },
        }
      )
      setIsFetchingPrices(false)
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
    fetchBalanceSheetsSeries()
  }, [fetchBalanceSheetsSeries])

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
    const balanceSheets: BalanceSheetSummary[] =
      balanceSheetsSeries?.balance_sheets || []
    if (
      selectedFeedResourceReference &&
      balanceSheets.length > 0 &&
      settleableAssets.length > 0
    ) {
      const datetimes = balanceSheets.map(
        (balanceSheet) => balanceSheet.balanced_time
      )
      const baseAssetIndex = settleableAssets.findIndex(
        (asset) => asset.symbol === INTERMEDIATE_ASSET_SYMBOL
      )
      if (baseAssetIndex === -1) {
        enqueueNotification(
          `Intermediate asset ${INTERMEDIATE_ASSET_SYMBOL} not found.`,
          'error'
        )
        return
      }
      const instrumentSymbols = settleableAssets
        .filter((asset) => asset.symbol !== INTERMEDIATE_ASSET_SYMBOL)
        .map(
          (quoteAsset) => `${INTERMEDIATE_ASSET_SYMBOL}_${quoteAsset.symbol}`
        )
      fetchPrices(selectedFeedResourceReference, datetimes, instrumentSymbols)
    }
  }, [selectedFeedResourceReference, balanceSheetsSeries, settleableAssets])

  React.useEffect(() => {
    if (prices.length > 0 && selectedSettleableAssetReference) {
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
      > = balanceSheets.reduce(
        (acc: any, balanceSheet: BalanceSheetSummary) => {
          acc[balanceSheet.reference] = balanceSheet
          return acc
        },
        {}
      )
      const accountReferenceToBalanceEntriesMap: Record<
        string,
        BalanceEntry[]
      > = balanceEntries.reduce((acc: any, balanceEntry: BalanceEntry) => {
        if (!acc[balanceEntry.account_reference]) {
          acc[balanceEntry.account_reference] = []
        }
        acc[balanceEntry.account_reference].push(balanceEntry)
        return acc
      }, {})

      const selectedSettleableAsset = settleableAssets.find(
        (asset) => asset.reference === selectedSettleableAssetReference
      )
      const selectedSettleableAssetSymbol = selectedSettleableAsset?.symbol
      const series: any = Object.entries(
        accountReferenceToBalanceEntriesMap
      ).map(([accountReference, balanceEntries]) => {
        const account = accountReferenceToAccountMap[accountReference]
        const accountSettlementAsset = settleableAssets.find(
          (asset) => asset.reference === account.settlement_asset_reference
        ) as Asset
        const accountSettlementAssetSymbol = accountSettlementAsset.symbol
        return {
          type: 'area',
          name: account.name,
          data: balanceEntries.map((balanceEntry) => {
            const balanceSheet =
              balanceSheetReferenceToBalanceSheetMap[
                balanceEntry.balance_sheet_reference as string
              ]
            const price = getSyntheticPrice(
              prices.filter(
                (price: any) =>
                  price.target_datetime === balanceSheet.balanced_time
              ),
              accountSettlementAssetSymbol as string,
              selectedSettleableAssetSymbol as string
            )
            return [
              new Date(`${balanceSheet.balanced_time}Z`).getTime() +
                timezone.offsetInMinutes * 60 * 1000,
              (balanceEntry.amount / 10 ** accountSettlementAsset.decimals) *
                price,
            ]
          }),
        }
      })
      const selectedAsset = settleableAssets.find(
        (asset) => asset.reference === selectedSettleableAssetReference
      )
      setAreaChartOptions(
        Object.assign({}, areaChartOptionsTemplate, {
          yAxis: {
            title: {
              text: selectedAsset?.symbol,
            },
          },
          series,
        })
      )
    }
  }, [
    balanceSheetsSeries,
    timezone.offsetInMinutes,
    selectedSettleableAssetReference,
    prices,
  ])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          sticky
          title="結餘"
          actions={[
            <TablePagination
              key="pagination"
              count={balanceSheetsCount}
              page={balanceSheetsPage}
              rowsPerPage={balanceSheetsRowsPerPage}
              setPage={setBalanceSheetsPage}
              setRowsPerPage={setBalanceSheetsRowsPerPage}
              rowsPerPageOptions={[5, 10]}
            />,
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

        <ModuleFunctionHeader
          title={<Typography variant="h6">資金曲線</Typography>}
        />
        <ModuleFunctionBody
          loading={
            isFetchingBalanceSheetsSeries ||
            isFetchingPrices ||
            isFetchingFeedResources
          }
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Stack direction="row" spacing={2}>
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
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
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
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
          <HighChartsCore options={areaChartOptions} />
        </ModuleFunctionBody>

        <ModuleFunctionHeader
          title={<Typography variant="h6">明細</Typography>}
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
        <ModuleFunctionBody loading={isFetchingBalanceSheetsSeries}>
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
                isLoading={isFetchingBalanceSheetsSeries}
                isEmpty={balanceSheetsSeries.balance_sheets.length === 0}
              >
                {balanceSheetsSeries.balance_sheets.map((balanceSheet) => (
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
