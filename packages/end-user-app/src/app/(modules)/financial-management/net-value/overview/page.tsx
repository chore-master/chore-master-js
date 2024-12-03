'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
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
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

interface Account {
  reference: string
  name: string
}

interface Asset {
  reference: string
  symbol: string
}

interface NetValue {
  reference: string
  account_reference: string
  settlement_asset_reference: string
  amount: string
  settled_time: string
  account: Account
  settlement_asset: Asset
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [chart, setChart] = React.useState<Highcharts.Chart | null>(null)
  const [forceUpdate, setForceUpdate] = React.useState(0)

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)

  // Net Values
  const [netValues, setNetValues] = React.useState<NetValue[]>([])
  const [isFetchingNetValues, setIsFetchingNetValues] = React.useState(false)

  const [selectedSettlementAssetSymbol, setSelectedSettlementAssetSymbol] =
    React.useState<string>('TWD')

  const exchangeRateMap: any = React.useMemo(
    () => ({
      TWD: {
        USD: {
          settlementAssetSymbol: 'TWD',
          baseAssetSymbol: 'USD',
          price: 32,
        },
      },
      USD: {
        TWD: {
          settlementAssetSymbol: 'USD',
          baseAssetSymbol: 'TWD',
          price: 1 / 31,
        },
      },
    }),
    []
  )

  const fetchNetValues = React.useCallback(async () => {
    setIsFetchingNetValues(true)
    await choreMasterAPIAgent.get('/v1/financial_management/net_values', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setNetValues(data)
      },
    })
    setIsFetchingNetValues(false)
  }, [enqueueNotification])

  const fetchAssets = React.useCallback(async () => {
    setIsFetchingAssets(true)
    await choreMasterAPIAgent.get('/v1/financial_management/assets', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setAssets(data)
      },
    })
    setIsFetchingAssets(false)
  }, [enqueueNotification])

  const refresh = React.useCallback(() => {
    fetchNetValues()
    fetchAssets()
  }, [fetchNetValues, fetchAssets])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="權益快照總覽"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={refresh}
                  disabled={isFetchingNetValues || isFetchingAssets}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
            <FormControl
              key="settlementAsset"
              variant="standard"
              sx={{ minWidth: 120 }}
            >
              <InputLabel>名義價值資產代號</InputLabel>
              <Select
                value={selectedSettlementAssetSymbol}
                onChange={(event: SelectChangeEvent) => {
                  setSelectedSettlementAssetSymbol(event.target.value)
                }}
                autoWidth
              >
                {assets.map((a) => (
                  <MenuItem key={a.reference} value={a.symbol}>
                    {a.symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingNetValues || isFetchingAssets}>
          <HighChartsCore
            callback={(chart) => setChart(chart)}
            options={{
              chart: {
                type: 'area',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                title: {
                  text: '',
                },
                allowDecimals: false,
                labels: {
                  format: '{value:,.0f}',
                },
                stackLabels: {
                  enabled: true,
                  format: '{total:,.2f}',
                },
              },
              plotOptions: {
                area: {
                  stacking: 'normal',
                  marker: {
                    enabled: false,
                    symbol: 'circle',
                  },
                },
                series: {
                  connectNulls: true,
                },
              },
              tooltip: {
                shared: true,
                valueDecimals: 2,
                useHTML: true, // Enable HTML in tooltip
                headerFormat:
                  '<div style="display:flex; justify-content:space-between; margin-bottom:5px;">' +
                  '<span>{point.key}</span>' +
                  '</div>',
                pointFormat:
                  '<div style="display:flex; justify-content:space-between; width:100%;">' +
                  '<span style="margin-right:10px;">' +
                  '<span style="color:{series.color}">\u25CF</span> {series.name}' +
                  '</span>' +
                  '<span style="text-align:right;">{point.y:,.2f}</span>' +
                  '</div>',
              },
              series: Object.entries(
                netValues.reduce(
                  (acc: Record<string, NetValue[]>, netValue) => {
                    acc[netValue.account.name] =
                      acc[netValue.account.name] || []
                    acc[netValue.account.name].push(netValue)
                    return acc
                  },
                  {}
                )
              ).map(([accountName, netValues]) => {
                const datapoints = netValues.map((netValue) => {
                  let price = 1
                  if (
                    netValue.settlement_asset.symbol !==
                    selectedSettlementAssetSymbol
                  ) {
                    price =
                      exchangeRateMap[selectedSettlementAssetSymbol][
                        netValue.settlement_asset.symbol
                      ].price
                  }
                  return [
                    new Date(netValue.settled_time).getTime(),
                    parseFloat(netValue.amount) * price,
                  ]
                })
                return {
                  type: 'area',
                  name: accountName,
                  data: datapoints,
                }
              }),
              // series: [
              //   {
              //     type: 'area',
              //     name: 'A',
              //     data: [
              //       [Date.UTC(2024, 10, 1), 5],
              //       [Date.UTC(2024, 10, 2), 3],
              //       [Date.UTC(2024, 10, 4), 4],
              //       [Date.UTC(2024, 10, 5), 7],
              //     ],
              //   },
              //   {
              //     name: 'B',
              //     type: 'area',
              //     data: [
              //       [Date.UTC(2024, 10, 1), 2],
              //       [Date.UTC(2024, 10, 2), -30], // Negative value
              //       [Date.UTC(2024, 10, 3), 3],
              //       [Date.UTC(2024, 10, 5), 2],
              //     ],
              //   },
              //   {
              //     name: 'C',
              //     type: 'area',
              //     data: [
              //       [Date.UTC(2024, 10, 1), 1],
              //       [Date.UTC(2024, 10, 2), -4],
              //       [Date.UTC(2024, 10, 3), 2],
              //       [Date.UTC(2024, 10, 4), 5],
              //       [Date.UTC(2024, 10, 5), 3],
              //     ],
              //   },
              // ],
            }}
          />
          <Stack
            direction="row"
            p={2}
            sx={{
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="text"
              onClick={() => {
                chart?.series.forEach((s: any) => {
                  s.show()
                })
                setForceUpdate(forceUpdate + 1)
              }}
            >
              選取全部
            </Button>
            <Button
              variant="text"
              onClick={() => {
                chart?.series.forEach((s: any) => {
                  s.hide()
                })
                setForceUpdate(forceUpdate + 1)
              }}
            >
              反選全部
            </Button>
            {chart?.series.map((s: any) => (
              <Box key={s.name} sx={{ p: 0.5 }}>
                <Chip
                  label={s.name}
                  size="small"
                  onClick={() => {
                    if (s.visible) {
                      s.hide()
                    } else {
                      s.show()
                    }
                    setForceUpdate(forceUpdate + 1)
                  }}
                  variant={s.visible ? undefined : 'outlined'}
                  avatar={
                    s.visible ? (
                      <svg>
                        <circle r="9" cx="9" cy="9" fill={s.color} />
                      </svg>
                    ) : undefined
                  }
                />
              </Box>
            ))}
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction>

      {/* <ModuleFunction>
        <ModuleFunctionHeader title="範例折線圖" />
        <ModuleFunctionBody>
          <LineChart
            layout={{ width: '100%' }}
            data={[
              { x: 1, y: 10 },
              { x: 5, y: 7 },
              { x: 2, y: 3 },
            ]}
          />
        </ModuleFunctionBody>
      </ModuleFunction> */}
    </React.Fragment>
  )
}
