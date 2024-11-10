'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import HighChartsCore from '@/components/charts/HighChartsCore'
// import StackedAreaChart from '@/components/charts/StackedAreaChart'
import choreMasterAPIAgent from '@/utils/apiAgent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
// import { colors, useLegend } from '@/utils/chart'
// import { useEntity } from '@/utils/entity'
// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
// import Chip from '@mui/material/Chip'
// import CircularProgress from '@mui/material/CircularProgress'
// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
// import Stack from '@mui/material/Stack'
// import { GridRowsProp } from '@mui/x-data-grid'
import React from 'react'

type Asset = {
  reference: string
  symbol: string
}

type Account = {
  reference: string
  name: string
}

type NetValue = {
  reference: string
  account_reference: string
  settlement_asset_reference: string
  settled_time: string
  amount: string
}

export default function Page() {
  // const account = useEntity<GridRowsProp>({
  //   endpoint: '/v1/financial_management/accounts',
  //   defaultList: [],
  // })
  // const asset = useEntity<GridRowsProp>({
  //   endpoint: '/v1/financial_management/assets',
  //   defaultList: [],
  // })
  // const netValue = useEntity<GridRowsProp>({
  //   endpoint: '/v1/financial_management/net_values',
  //   defaultList: [],
  // })
  // const [filteredAssetReference, setFilteredAssetReference] =
  //   React.useState<string>()
  // const [filterableAccounts, setFilterableAccounts] = React.useState<any>([])
  // const [filteredAccounts, setFilteredAccounts] = React.useState<any>([])
  // const [filteredNetValues, setFilteredNetValues] = React.useState<any>([])
  // const accountLegend = useLegend({
  //   labels: account.list.map((a) => a.reference),
  //   colors,
  // })

  // React.useEffect(() => {
  //   if (
  //     filteredAssetReference &&
  //     account.list.length > 0 &&
  //     netValue.list.length > 0
  //   ) {
  //     const filterableAccountReferenceSet = new Set(
  //       netValue.list
  //         .filter(
  //           (d) => d.settlement_asset_reference === filteredAssetReference
  //         )
  //         .map((d) => d.account_reference)
  //     )
  //     setFilterableAccounts(
  //       account.list.filter((a) =>
  //         filterableAccountReferenceSet.has(a.reference)
  //       )
  //     )
  //   }
  // }, [account.list, filteredAssetReference, netValue.list])

  // React.useEffect(() => {
  //   setFilteredAccounts(filterableAccounts)
  // }, [filterableAccounts])

  // React.useEffect(() => {
  //   if (filteredAssetReference) {
  //     const filteredAccountReferenceSet = new Set(
  //       filteredAccounts.map((a: any) => a.reference)
  //     )
  //     setFilteredNetValues(
  //       netValue.list.filter(
  //         (d) =>
  //           d.settlement_asset_reference === filteredAssetReference &&
  //           filteredAccountReferenceSet.has(d.account_reference)
  //       )
  //     )
  //   }
  // }, [filteredAssetReference, filteredAccounts, netValue.list])

  // React.useEffect(() => {
  //   if (!filteredAssetReference && asset.list.length > 0) {
  //     setFilteredAssetReference(asset.list[0].reference)
  //   }
  // }, [asset.list])

  // Accounts
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = React.useState(false)

  // Assets
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isLoadingAssets, setIsLoadingAssets] = React.useState(false)

  // Net Values
  const [netValues, setNetValues] = React.useState<NetValue[]>([])
  const [isLoadingNetValues, setIsLoadingNetValues] = React.useState(false)

  const [selectedSettlementAssetSymbol, setSelectedSettlementAssetSymbol] =
    React.useState<string>('TWD')

  const assetReferenceToAssetMap = React.useMemo(() => {
    return assets.reduce<Record<string, Asset>>((acc, asset) => {
      acc[asset.reference] = asset
      return acc
    }, {})
  }, [assets])

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

  const fetchAccounts = React.useCallback(async () => {
    setIsLoadingAccounts(true)
    await choreMasterAPIAgent.get('/v1/financial_management/accounts', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setAccounts(data)
      },
    })
    setIsLoadingAccounts(false)
  }, [])

  const fetchAssets = React.useCallback(async () => {
    setIsLoadingAssets(true)
    await choreMasterAPIAgent.get('/v1/financial_management/assets', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setAssets(data)
      },
    })
    setIsLoadingAssets(false)
  }, [])

  const fetchNetValues = React.useCallback(async () => {
    setIsLoadingNetValues(true)
    await choreMasterAPIAgent.get('/v1/financial_management/net_values', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setNetValues(data)
      },
    })
    setIsLoadingNetValues(false)
  }, [])

  React.useEffect(() => {
    fetchNetValues()
    fetchAccounts()
    fetchAssets()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="淨值組成"
          actions={[
            <FormControl
              key="settlementAsset"
              variant="standard"
              sx={{ minWidth: 120 }}
            >
              <InputLabel>結算資產</InputLabel>
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
        <ModuleFunctionBody
          loading={isLoadingNetValues || isLoadingAccounts || isLoadingAssets}
        >
          <HighChartsCore
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
              },
              plotOptions: {
                area: {
                  stacking: 'normal',
                  marker: {
                    enabled: false,
                  },
                },
                series: {
                  connectNulls: true,
                },
              },
              tooltip: {
                shared: true,
                valueDecimals: 2,
              },
              legend: {
                enabled: true,
              },
              series:
                assets.length === 0
                  ? []
                  : accounts.map((account) => {
                      const accountNetValues = netValues.filter(
                        (netValue) =>
                          netValue.account_reference === account.reference
                      )
                      const datapoints = accountNetValues.map(
                        (accountNetValue) => {
                          const settlementAsset =
                            assetReferenceToAssetMap[
                              accountNetValue.settlement_asset_reference
                            ]
                          let price = 1
                          if (
                            settlementAsset.symbol !==
                            selectedSettlementAssetSymbol
                          ) {
                            price =
                              exchangeRateMap[selectedSettlementAssetSymbol][
                                settlementAsset.symbol
                              ].price
                          }
                          return [
                            new Date(accountNetValue.settled_time).getTime(),
                            parseFloat(accountNetValue.amount) * price,
                          ]
                        }
                      )
                      return {
                        type: 'area',
                        name: account.name,
                        data: datapoints,
                      }
                    }),
              // series: [
              //   {
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
              //     data: [
              //       [Date.UTC(2024, 10, 1), 2],
              //       [Date.UTC(2024, 10, 2), -30], // Negative value
              //       [Date.UTC(2024, 10, 3), 3],
              //       [Date.UTC(2024, 10, 5), 2],
              //     ],
              //   },
              //   {
              //     name: 'C',
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
        </ModuleFunctionBody>
      </ModuleFunction>
      {/* <ModuleFunction>
        <ModuleFunctionHeader
          title="淨值組成"
          actions={
            asset.isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel>結算資產分類</InputLabel>

                <Select
                  value={filteredAssetReference || ''}
                  onChange={(event: SelectChangeEvent) => {
                    setFilteredAssetReference(event.target.value)
                  }}
                  autoWidth
                >
                  {asset.list.map((a) => (
                    <MenuItem key={a.reference} value={a.reference}>
                      {a.symbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }
        />
        <ModuleFunctionBody
          loading={netValue.isLoading || asset.isLoading || account.isLoading}
        >
          <StackedAreaChart
            layout={{
              width: '100%',
              marginTop: 48,
              marginLeft: 96,
              marginRight: 96,
              minWidth: 320,
            }}
            datapoints={filteredNetValues}
            accessDate={(d: any) => new Date(d.settled_time)}
            accessValue={(d: any) => parseFloat(d.amount)}
            accessGroup={(d: any) => d.account_reference}
            // mapGroupToLegendText={(group: string) =>
            //   (accountReferenceToAccountMap as any)?.[group]?.name
            // }
            // colors={colors}
            colorScale={accountLegend.colorScale}
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
              onClick={() => setFilteredAccounts(filterableAccounts)}
            >
              選取全部
            </Button>
            <Button variant="text" onClick={() => setFilteredAccounts([])}>
              反選全部
            </Button>
            {filterableAccounts.map((a: any) => (
              <Box key={a.reference} sx={{ p: 0.5 }}>
                <Chip
                  label={a.name}
                  size="small"
                  onClick={() => {
                    const isActive = filteredAccounts.find(
                      (fa: any) => fa.reference === a.reference
                    )
                      ? true
                      : false
                    if (isActive) {
                      setFilteredAccounts((as: any) =>
                        as.filter((fa: any) => fa.reference !== a.reference)
                      )
                    } else {
                      setFilteredAccounts((as: any) => [...as, a])
                    }
                  }}
                  variant={
                    filteredAccounts.find(
                      (fa: any) => fa.reference === a.reference
                    )
                      ? undefined
                      : 'outlined'
                  }
                  avatar={
                    <svg>
                      <circle
                        r="9"
                        cx="9"
                        cy="9"
                        fill={accountLegend.colorScale(a.reference)}
                      />
                    </svg>
                  }
                />
              </Box>
            ))}
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction> */}

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
