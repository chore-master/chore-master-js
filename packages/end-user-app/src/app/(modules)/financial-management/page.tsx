'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import LineChart from '@/components/charts/LineChart'
import StackedAreaChart from '@/components/charts/StackedAreaChart'
import { colors, useLegend } from '@/utils/chart'
import { useEntity } from '@/utils/entity'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
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
  // const [selectedAssetReference, setSelectedAssetReference] = React.useState()
  // const [accountReferenceToAccountMap, setAccountReferenceToAccountMap] =
  //   React.useState({})
  const [accountNames, setAccountNames] = React.useState<string[]>([])
  const [filteredAssetReference, setFilteredAssetReference] =
    React.useState<string>()
  const [filteredAccounts, setFilteredAccounts] = React.useState<any>([])
  const [filteredNetValues, setFilteredNetValues] = React.useState<any>([])
  const accountLegend = useLegend({ labels: accountNames, colors })

  React.useEffect(() => {
    // setAccountReferenceToAccountMap(account.getMapByReference())
    setAccountNames(account.list.map((a) => a.name))
    if (filteredAccounts.length === 0 && account.list.length > 0) {
      setFilteredAccounts([...account.list])
    }
  }, [account.list])

  React.useEffect(() => {
    if (filteredAssetReference && filteredAccounts.length > 0) {
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
              {/* <Autocomplete
                value={filteredAsset || {}}
                onChange={(event: any, newValue: any) =>
                  setFilteredAsset(newValue)
                }
                size="small"
                // disableCloseOnSelect
                options={asset.list}
                getOptionLabel={(option) => option.symbol}
                // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="結算資產分類"
                    variant="standard"
                  />
                )}
              /> */}
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
            <FormControl
            // sx={{ minWidth: 120, maxWidth: 640 }}
            >
              <Autocomplete
                value={filteredAccounts}
                // defaultValue={(account.list.length > 0 ?? account.list) as any}
                onChange={(event: any, newValue: any) =>
                  setFilteredAccounts(newValue)
                }
                isOptionEqualToValue={(option, value) =>
                  option.reference === value.reference
                }
                multiple
                // limitTags={8}
                size="small"
                disableCloseOnSelect
                options={account.list}
                getOptionLabel={(option) => option.name}
                // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                renderInput={(params) => (
                  <TextField {...params} label="帳戶" variant="standard" />
                )}
              />
            </FormControl>
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
