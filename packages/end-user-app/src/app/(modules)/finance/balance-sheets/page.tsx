'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleContainer,
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import { colors20, INTERMEDIATE_ASSET_SYMBOL } from '@/constants'
import type {
  Account,
  Asset,
  BalanceEntry,
  BalanceSheetSeries,
  BalanceSheetSummary,
} from '@/types/finance'
import type { Operator } from '@/types/integration'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { getSyntheticPrice } from '@/utils/price'
import AddIcon from '@mui/icons-material/Add'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
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

const chartTypes = [
  {
    label: '淨值',
    value: 'net_value_areaspline',
  },
  {
    label: '淨值組成',
    value: 'net_value_area',
  },
  {
    label: '資產負債組成',
    value: 'assets_and_liabilities_area',
  },
  {
    label: '參考匯率',
    value: 'exchange_rate',
  },
]

export default function Page() {
  const { enqueueNotification } = useNotification()
  const router = useRouter()
  const timezone = useTimezone()

  // Feed operator
  const [feedOperators, setFeedOperators] = React.useState<Operator[]>([])
  const [isFetchingFeedOperators, setIsFetchingFeedOperators] =
    React.useState(false)
  const [selectedFeedOperatorReference, setSelectedFeedOperatorReference] =
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

  // Chart
  const [areaChartOptions, setAreaChartOptions] =
    React.useState<Highcharts.Options>(areaChartOptionsTemplate)
  const [areaChart, setAreaChart] = React.useState<Highcharts.Chart>()
  const [legends, setLegends] = React.useState<
    {
      seriesId: string
      label: string
      color: string
      isVisible: boolean
    }[]
  >([])
  const [selectedChartType, setSelectedChartType] = React.useState(
    chartTypes[0].value
  )

  const fetchFeedOperators = React.useCallback(async () => {
    setIsFetchingFeedOperators(true)
    await choreMasterAPIAgent.get('/v1/integration/users/me/operators', {
      params: {
        discriminators: ['oanda_feed', 'yahoo_finance_feed'],
      },
      onError: () => {
        enqueueNotification(`Unable to fetch feed operators now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setFeedOperators(data)
      },
    })
    setIsFetchingFeedOperators(false)
  }, [enqueueNotification])

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

  const fetchBalanceSheetsSeries = React.useCallback(async () => {
    setIsFetchingBalanceSheetsSeries(true)
    await choreMasterAPIAgent.get(
      '/v1/finance/users/me/balance_sheets/series',
      {
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
      }
    )
    setIsFetchingBalanceSheetsSeries(false)
  }, [balanceSheetsPage, balanceSheetsRowsPerPage, enqueueNotification])

  const fetchPrices = React.useCallback(
    async (
      feedOperatorReference: string,
      datetimes: string[],
      instrumentSymbols: string[]
    ) => {
      setIsFetchingPrices(true)
      await choreMasterAPIAgent.post(
        `/v1/integration/users/me/operators/${feedOperatorReference}/feed/fetch_prices`,
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
    fetchFeedOperators()
  }, [fetchFeedOperators])

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  React.useEffect(() => {
    fetchBalanceSheetsSeries()
  }, [fetchBalanceSheetsSeries])

  React.useEffect(() => {
    const feedOperator = feedOperators.find(
      (operator) => operator.reference === selectedFeedOperatorReference
    )
    if (!feedOperator) {
      setSelectedFeedOperatorReference(feedOperators[0]?.reference || '')
    }
  }, [feedOperators, selectedFeedOperatorReference])

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
      selectedFeedOperatorReference &&
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
      fetchPrices(selectedFeedOperatorReference, datetimes, instrumentSymbols)
    }
  }, [
    selectedFeedOperatorReference,
    balanceSheetsSeries,
    settleableAssets,
    fetchPrices,
    enqueueNotification,
  ])

  React.useEffect(() => {
    if (balanceSheetsSeries.accounts.length > 0) {
      setLegends(
        balanceSheetsSeries.accounts.map((account, index) => ({
          seriesId: account.reference,
          label: account.name,
          color: colors20[index % colors20.length],
          isVisible: true,
        }))
      )
    }
  }, [balanceSheetsSeries])

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

      let series: Highcharts.SeriesOptionsType[] = []
      // each series must specify id to prevent bugs during switching `selectedChartType`s
      if (selectedChartType === 'net_value_areaspline') {
        const datapoints = balanceSheets.map((balanceSheet) => {
          const equity = balanceEntries
            .filter(
              (balanceEntry) =>
                balanceEntry.balance_sheet_reference === balanceSheet.reference
            )
            .reduce((acc, balanceEntry) => {
              const accountReference = balanceEntry.account_reference
              const account = accountReferenceToAccountMap[accountReference]
              const legend = legends.find(
                (legend) => legend.seriesId === account.reference
              )
              if (!legend?.isVisible) {
                return acc
              }
              const accountSettlementAsset = settleableAssets.find(
                (asset) =>
                  asset.reference === account.settlement_asset_reference
              ) as Asset
              const accountSettlementAssetSymbol = accountSettlementAsset.symbol
              const price = getSyntheticPrice(
                prices.filter(
                  (price: any) =>
                    price.target_datetime === balanceSheet.balanced_time
                ),
                accountSettlementAssetSymbol as string,
                selectedSettleableAssetSymbol as string
              )

              return (
                acc +
                (balanceEntry.amount / 10 ** accountSettlementAsset.decimals) *
                  price
              )
            }, 0)
          return [
            new Date(`${balanceSheet.balanced_time}Z`).getTime() +
              timezone.offsetInMinutes * 60 * 1000,
            equity,
          ]
        })
        series = [
          {
            id: 'net_value_areaspline',
            type: 'areaspline',
            name: '淨值',
            zones: [
              {
                value: 0,
                color: '#ff6968',
                fillColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0, 'rgba(255, 105, 104, 0)'],
                    [1, 'rgba(255, 105, 104, 0.3)'],
                  ],
                },
                threshold: Infinity,
              },
              {
                color: '#94caae',
                fillColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0, 'rgba(34, 197, 94, 0.3)'],
                    [1, 'rgba(34, 197, 94, 0)'],
                  ],
                },
              },
            ],
            data: datapoints.sort((a: any, b: any) => a[0] - b[0]),
          },
        ] as Highcharts.SeriesOptionsType[]
      } else if (selectedChartType === 'net_value_area') {
        series = Object.entries(accountReferenceToBalanceEntriesMap).map(
          ([accountReference, balanceEntries]) => {
            const account = accountReferenceToAccountMap[accountReference]
            const accountSettlementAsset = settleableAssets.find(
              (asset) => asset.reference === account.settlement_asset_reference
            ) as Asset
            const accountSettlementAssetSymbol = accountSettlementAsset.symbol
            const legend = legends.find(
              (legend: any) => legend.seriesId === account.reference
            )
            const datapoints = balanceEntries.map((balanceEntry) => {
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
            })
            return {
              id: `account_equity_${account.reference}_area`,
              type: 'area',
              stack: 'account_equity',
              name: account.name,
              visible: legend?.isVisible,
              color: legend?.color,
              data: datapoints.sort((a: any, b: any) => a[0] - b[0]),
            }
          }
        )
      } else if (selectedChartType === 'assets_and_liabilities_area') {
        series = Object.entries(accountReferenceToBalanceEntriesMap)
          .map(([accountReference, balanceEntries]) => {
            const account = accountReferenceToAccountMap[accountReference]
            const accountSettlementAsset = settleableAssets.find(
              (asset) => asset.reference === account.settlement_asset_reference
            ) as Asset
            const accountSettlementAssetSymbol = accountSettlementAsset.symbol
            const legend = legends.find(
              (legend: any) => legend.seriesId === account.reference
            )
            const datapoints = balanceEntries.map((balanceEntry) => {
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
            })
            return [
              {
                id: `account_asset_${account.reference}_area`,
                type: 'area',
                stack: 'account_asset',
                name: account.name,
                visible: legend?.isVisible,
                color: legend?.color,
                data: datapoints
                  .filter((d) => d[1] >= 0)
                  .sort((a: any, b: any) => a[0] - b[0]),
              },
              {
                id: `account_debt_${account.reference}_area`,
                type: 'area',
                stack: 'account_debt',
                name: account.name,
                visible: legend?.isVisible,
                color: legend?.color,
                data: datapoints
                  .filter((d) => d[1] < 0)
                  .sort((a: any, b: any) => a[0] - b[0]),
              },
            ]
          })
          .flat() as Highcharts.SeriesOptionsType[]
      } else if (selectedChartType === 'exchange_rate') {
        const baseAssetReferenceSet = balanceSheetsSeries.accounts.reduce<
          Set<string>
        >((acc, account) => {
          // if (
          //   account.settlement_asset_reference ==
          //   selectedSettleableAssetReference
          // ) {
          //   return acc
          // }
          acc.add(account.settlement_asset_reference)
          return acc
        }, new Set())
        const quoteAssetSymbol = settleableAssets.find(
          (asset) => asset.reference === selectedSettleableAssetReference
        )?.symbol as string
        series = Array.from(baseAssetReferenceSet).map((baseAssetReference) => {
          const baseAssetSymbol = settleableAssets.find(
            (asset) => asset.reference === baseAssetReference
          )?.symbol as string
          const datapoints = balanceSheets.map((balanceSheet) => {
            const price = getSyntheticPrice(
              prices.filter(
                (price: any) =>
                  price.target_datetime === balanceSheet.balanced_time
              ),
              baseAssetSymbol,
              quoteAssetSymbol
            )
            return [
              new Date(`${balanceSheet.balanced_time}Z`).getTime() +
                timezone.offsetInMinutes * 60 * 1000,
              price,
            ]
          })
          return {
            id: `exchange_rate_${baseAssetSymbol}_${quoteAssetSymbol}`,
            type: 'line',
            name: `${baseAssetSymbol}/${quoteAssetSymbol}`,
            data: datapoints.sort((a: any, b: any) => a[0] - b[0]),
          }
        }) as Highcharts.SeriesOptionsType[]
      }

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
    timezone.offsetInMinutes,
    balanceSheetsSeries,
    selectedChartType,
    selectedSettleableAssetReference,
    prices,
    settleableAssets,
    legends,
  ])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          stickyTop
          title="結餘"
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

        <ModuleFunctionHeader
          title={<Typography variant="h6">資金曲線</Typography>}
        />
        <ModuleFunctionBody
          loading={
            isFetchingFeedOperators ||
            isFetchingSettleableAssets ||
            isFetchingBalanceSheetsSeries ||
            isFetchingPrices
          }
        >
          <Box sx={{ minWidth: 640 }}>
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
              <FormControl variant="standard">
                <InputLabel>報價來源</InputLabel>
                <Select
                  value={selectedFeedOperatorReference}
                  onChange={(event: SelectChangeEvent) => {
                    setSelectedFeedOperatorReference(event.target.value)
                  }}
                  autoWidth
                >
                  {feedOperators.map((operator) => (
                    <MenuItem
                      key={operator.reference}
                      value={operator.reference}
                    >
                      {operator.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            {!areaChartOptions.series ||
            areaChartOptions.series?.every(
              (series) => series.visible === false
            ) ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                }}
              >
                <PlaceholderTypography>
                  目前沒有資料可以繪製
                </PlaceholderTypography>
              </Box>
            ) : (
              <HighChartsCore
                callback={setAreaChart}
                options={areaChartOptions}
              />
            )}
            {selectedChartType !== 'exchange_rate' && (
              <Stack sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  sx={{
                    px: 1,
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    label="全選"
                    sx={{ m: 0 }}
                    control={
                      <Checkbox
                        size="small"
                        color="default"
                        disabled={legends.length === 0}
                        checked={legends.every((legend) => legend.isVisible)}
                        indeterminate={
                          legends.some((legend) => legend.isVisible) &&
                          !legends.every((legend) => legend.isVisible)
                        }
                        onChange={(event) => {
                          setLegends(
                            legends.map((legend) => ({
                              ...legend,
                              isVisible: event.target.checked,
                            }))
                          )
                        }}
                      />
                    }
                  />
                </Stack>
                <Stack
                  direction="row"
                  sx={{
                    p: 1,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  {legends.map((legend: any, index: number) => (
                    <Box key={legend.seriesId} sx={{ p: 0.5 }}>
                      <Chip
                        label={legend.label}
                        size="small"
                        onMouseEnter={() => {
                          if (
                            selectedChartType.endsWith('area') &&
                            legend.isVisible &&
                            areaChart
                          ) {
                            areaChart.series.forEach((series) => {
                              if (
                                series.options.id?.includes(legend.seriesId)
                              ) {
                                series.setState('hover', true)
                              } else {
                                series.setState('inactive')
                              }
                            })
                          }
                        }}
                        onMouseLeave={() => {
                          if (
                            selectedChartType.endsWith('area') &&
                            legend.isVisible &&
                            areaChart
                          ) {
                            areaChart.series.forEach((series) => {
                              series.setState('normal')
                            })
                          }
                        }}
                        onClick={() => {
                          setLegends([
                            ...legends.slice(0, index),
                            {
                              ...legend,
                              isVisible: !legend.isVisible,
                            },
                            ...legends.slice(index + 1),
                          ])
                        }}
                        variant={legend.isVisible ? undefined : 'outlined'}
                        icon={
                          selectedChartType.endsWith('area') ? (
                            legend.isVisible ? (
                              <CircleIcon style={{ color: legend.color }} />
                            ) : (
                              <RadioButtonUncheckedIcon
                                style={{ color: legend.color }}
                              />
                            )
                          ) : undefined
                        }
                      />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            )}
          </Box>
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
                  <NoWrapTableCell align="right">
                    <PlaceholderTypography>#</PlaceholderTypography>
                  </NoWrapTableCell>
                  <NoWrapTableCell>結算時間</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingBalanceSheetsSeries}
                isEmpty={balanceSheetsSeries.balance_sheets.length === 0}
              >
                {balanceSheetsSeries.balance_sheets.map(
                  (balanceSheet, index) => (
                    <TableRow key={balanceSheet.reference} hover>
                      <NoWrapTableCell align="right">
                        <PlaceholderTypography>
                          {balanceSheetsPage * balanceSheetsRowsPerPage +
                            index +
                            1}
                        </PlaceholderTypography>
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <DatetimeBlock isoText={balanceSheet.balanced_time} />
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <ReferenceBlock
                          label={balanceSheet.reference}
                          primaryKey
                          monospace
                          href={`/finance/balance-sheets/${balanceSheet.reference}`}
                        />
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
                  )
                )}
              </StatefulTableBody>
            </Table>
          </TableContainer>
        </ModuleFunctionBody>
      </ModuleFunction>
      <ModuleContainer stickyBottom>
        <Divider />
        <Paper elevation={0}>
          <TablePagination
            count={balanceSheetsCount}
            page={balanceSheetsPage}
            rowsPerPage={balanceSheetsRowsPerPage}
            setPage={setBalanceSheetsPage}
            setRowsPerPage={setBalanceSheetsRowsPerPage}
            rowsPerPageOptions={[5, 10]}
          />
        </Paper>
      </ModuleContainer>
    </React.Fragment>
  )
}
