'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import LineChart from '@/components/charts/LineChart'
import StackedAreaChart from '@/components/charts/StackedAreaChart'
import { colors, useLegend } from '@/utils/chart'
import { useEntity } from '@/utils/entity'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { GridRowsProp } from '@mui/x-data-grid'
import React from 'react'

export default function Page() {
  const account = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/accounts',
    defaultList: [],
  })
  const asset = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/assets',
    defaultList: [],
  })
  const netValue = useEntity<GridRowsProp>({
    endpoint: '/v1/financial_management/net_values',
    defaultList: [],
  })
  const [filteredAssetReference, setFilteredAssetReference] =
    React.useState<string>()
  const [filterableAccounts, setFilterableAccounts] = React.useState<any>([])
  const [filteredAccounts, setFilteredAccounts] = React.useState<any>([])
  const [filteredNetValues, setFilteredNetValues] = React.useState<any>([])
  const accountLegend = useLegend({
    labels: account.list.map((a) => a.reference),
    colors,
  })

  React.useEffect(() => {
    if (
      filteredAssetReference &&
      account.list.length > 0 &&
      netValue.list.length > 0
    ) {
      const filterableAccountReferenceSet = new Set(
        netValue.list
          .filter(
            (d) => d.settlement_asset_reference === filteredAssetReference
          )
          .map((d) => d.account_reference)
      )
      setFilterableAccounts(
        account.list.filter((a) =>
          filterableAccountReferenceSet.has(a.reference)
        )
      )
    }
  }, [account.list, filteredAssetReference, netValue.list])

  React.useEffect(() => {
    setFilteredAccounts(filterableAccounts)
  }, [filterableAccounts])

  React.useEffect(() => {
    if (filteredAssetReference) {
      const filteredAccountReferenceSet = new Set(
        filteredAccounts.map((a: any) => a.reference)
      )
      setFilteredNetValues(
        netValue.list.filter(
          (d) =>
            d.settlement_asset_reference === filteredAssetReference &&
            filteredAccountReferenceSet.has(d.account_reference)
        )
      )
    }
  }, [filteredAssetReference, filteredAccounts, netValue.list])

  React.useEffect(() => {
    if (!filteredAssetReference && asset.list.length > 0) {
      setFilteredAssetReference(asset.list[0].reference)
    }
  }, [asset.list])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="淨值組成"
          actions={
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
          }
        />
        <ModuleFunctionBody>
          <StackedAreaChart
            layout={{ width: '100%', marginLeft: 100 }}
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
          <Stack component="form" spacing={3} p={2} autoComplete="off">
            <Stack
              direction="row"
              // spacing={1}
              sx={{
                // display: 'flex',
                // justifyContent: 'center',
                flexWrap: 'wrap',
                // listStyle: 'none',
                // p: 0.5,
                // m: 0.5,
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
            {/* <FormControl
            // sx={{ minWidth: 120, maxWidth: 640 }}
            >
              <Autocomplete
                value={filteredAccounts}
                onChange={(event: any, newValue: any) =>
                  setFilteredAccounts(newValue)
                }
                isOptionEqualToValue={(option, value) =>
                  option.reference === value.reference
                }
                multiple
                size="small"
                disableCloseOnSelect
                options={account.list}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="帳戶" variant="standard" />
                )}
              />
            </FormControl> */}
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
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
      </ModuleFunction>
    </React.Fragment>
  )
}
