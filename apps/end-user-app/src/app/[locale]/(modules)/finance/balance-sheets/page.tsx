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
import { useOffsetPagination } from '@/hooks/useOffsetPagination'
import type {
  Account,
  Asset,
  BalanceEntry,
  BalanceSheetSeries,
  BalanceSheetSummary,
  MarkPrice,
} from '@/types/finance'
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
import { Decimal } from 'decimal.js'
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
  const balanceSheetsPagination = useOffsetPagination({
    defaultRowsPerPage: 5,
    rowsPerPageOptions: [5, 10],
  })
  const [isFetchingBalanceSheetsSeries, setIsFetchingBalanceSheetsSeries] =
    React.useState(false)

  // Prices
  const [markPrices, setMarkPrices] = React.useState<MarkPrice[]>([])
  const [isFetchingMarkPrices, setIsFetchingMarkPrices] = React.useState(false)

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
          offset: balanceSheetsPagination.offset,
          limit: balanceSheetsPagination.rowsPerPage,
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
          balanceSheetsPagination.setCount(metadata.offset_pagination.count)
        },
      }
    )
    setIsFetchingBalanceSheetsSeries(false)
  }, [balanceSheetsPagination.offset, balanceSheetsPagination.rowsPerPage])

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
    fetchBalanceSheetsSeries()
  }, [fetchBalanceSheetsSeries])

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
    if (balanceSheets.length > 0 && settleableAssets.length > 0) {
      const datetimes = balanceSheets.map(
        (balanceSheet) => balanceSheet.balanced_time
      )
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
  }, [
    balanceSheetsSeries,
    settleableAssets,
    fetchMarkPrices,
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
    if (markPrices.length > 0 && selectedSettleableAssetReference) {
      const intermediateAssetReference =
        settleableAssets.find(
          (asset) => asset.symbol === INTERMEDIATE_ASSET_SYMBOL
        )?.reference || ''
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
              const accountSettlementAssetReference =
                accountSettlementAsset.reference
              const price = getSyntheticPrice(
                markPrices.filter(
                  (markPrice: MarkPrice) =>
                    markPrice.query_datetime === balanceSheet.balanced_time
                ),
                accountSettlementAssetReference,
                selectedSettleableAssetReference,
                intermediateAssetReference
              )

              return (
                acc +
                new Decimal(balanceEntry.amount)
                  .dividedBy(10 ** accountSettlementAsset.decimals)
                  .times(price || 0)
                  .toNumber()
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
                // color: '#ff6968',
                color: 'rgb(229, 115, 115)',
                fillColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0, 'rgba(229, 115, 115, 0)'],
                    [1, 'rgba(229, 115, 115, 0.3)'],
                    // [0, 'rgba(255, 105, 104, 0)'],
                    // [1, 'rgba(255, 105, 104, 0.3)'],
                  ],
                },
                threshold: Infinity,
              },
              {
                // color: '#94caae',
                color: 'rgb(76, 175, 80)',
                fillColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0, 'rgba(76, 175, 80, 0.3)'],
                    [1, 'rgba(76, 175, 80, 0)'],
                    // [0, 'rgba(34, 197, 94, 0.3)'],
                    // [1, 'rgba(34, 197, 94, 0)'],
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
            const accountSettlementAssetReference =
              accountSettlementAsset.reference
            const legend = legends.find(
              (legend: any) => legend.seriesId === account.reference
            )
            const datapoints = balanceEntries.map((balanceEntry) => {
              const balanceSheet =
                balanceSheetReferenceToBalanceSheetMap[
                  balanceEntry.balance_sheet_reference as string
                ]
              const price = getSyntheticPrice(
                markPrices.filter(
                  (markPrice: MarkPrice) =>
                    markPrice.query_datetime === balanceSheet.balanced_time
                ),
                accountSettlementAssetReference,
                selectedSettleableAssetReference,
                intermediateAssetReference
              )

              return [
                new Date(`${balanceSheet.balanced_time}Z`).getTime() +
                  timezone.offsetInMinutes * 60 * 1000,
                new Decimal(balanceEntry.amount)
                  .dividedBy(10 ** accountSettlementAsset.decimals)
                  .times(price || 0)
                  .toNumber(),
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
            const accountSettlementAssetReference =
              accountSettlementAsset.reference
            const legend = legends.find(
              (legend: any) => legend.seriesId === account.reference
            )
            const datapoints = balanceEntries.map((balanceEntry) => {
              const balanceSheet =
                balanceSheetReferenceToBalanceSheetMap[
                  balanceEntry.balance_sheet_reference as string
                ]
              const price = getSyntheticPrice(
                markPrices.filter(
                  (markPrice: MarkPrice) =>
                    markPrice.query_datetime === balanceSheet.balanced_time
                ),
                accountSettlementAssetReference,
                selectedSettleableAssetReference,
                intermediateAssetReference
              )

              return [
                new Date(`${balanceSheet.balanced_time}Z`).getTime() +
                  timezone.offsetInMinutes * 60 * 1000,
                new Decimal(balanceEntry.amount)
                  .dividedBy(10 ** accountSettlementAsset.decimals)
                  .times(price || 0)
                  .toNumber(),
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
        const quoteAsset = settleableAssets.find(
          (asset) => asset.reference === selectedSettleableAssetReference
        )
        series = Array.from(baseAssetReferenceSet).map((baseAssetReference) => {
          const baseAsset = settleableAssets.find(
            (asset) => asset.reference === baseAssetReference
          )
          const datapoints = balanceSheets.map((balanceSheet) => {
            const price = getSyntheticPrice(
              markPrices.filter(
                (markPrice: MarkPrice) =>
                  markPrice.query_datetime === balanceSheet.balanced_time
              ),
              baseAssetReference,
              quoteAsset?.reference || '',
              intermediateAssetReference
            )
            return [
              new Date(`${balanceSheet.balanced_time}Z`).getTime() +
                timezone.offsetInMinutes * 60 * 1000,
              price,
            ]
          })
          return {
            id: `exchange_rate_${baseAsset?.symbol}_${quoteAsset?.symbol}`,
            type: 'line',
            name: `${baseAsset?.symbol}/${quoteAsset?.symbol}`,
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
    markPrices,
    settleableAssets,
    legends,
  ])

  const isChartUnavailable =
    !areaChartOptions.series ||
    areaChartOptions.series?.every((series) => series.visible === false)

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

        <ModuleFunctionHeader subtitle="資金曲線" />
        <ModuleFunctionBody
          loading={
            isFetchingSettleableAssets ||
            isFetchingBalanceSheetsSeries ||
            isFetchingMarkPrices
          }
        >
          <Box sx={{ minWidth: 640 }}>
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
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
            {isChartUnavailable && (
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
            )}
            <HighChartsCore
              callback={setAreaChart}
              options={areaChartOptions}
              style={{
                display: isChartUnavailable ? 'none' : 'block',
              }}
            />
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
          subtitle="明細"
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
                          {balanceSheetsPagination.offset + index + 1}
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
                          <EditIcon fontSize="inherit" />
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
          <TablePagination offsetPagination={balanceSheetsPagination} />
        </Paper>
      </ModuleContainer>
    </React.Fragment>
  )
}
