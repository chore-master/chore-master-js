'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import LineChart from '@/components/charts/LineChart'
import StackedAreaChart from '@/components/charts/StackedAreaChart'
import { useEntity } from '@/utils/entity'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
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
  const [selectedAssetReference, setSelectedAssetReference] = React.useState()
  const [accountReferenceToAccountMap, setAccountReferenceToAccountMap] =
    React.useState({})
  React.useEffect(() => {
    setAccountReferenceToAccountMap(account.getMapByReference())
  }, [account.list])

  React.useEffect(() => {
    if (!selectedAssetReference) {
      setSelectedAssetReference(asset.list[0]?.reference)
    }
  }, [asset.list])

  const handleSelectedAssetChange = (event: SelectChangeEvent) => {
    setSelectedAssetReference(event.target.value as any)
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="線圖" />
        <ModuleFunctionBody>
          <LineChart
            data={[
              { x: 1, y: 10 },
              { x: 5, y: 7 },
              { x: 2, y: 3 },
            ]}
            layout={{ width: '100%' }}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader
          title="淨值組成"
          actions={
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>結算資產</InputLabel>
              <Select
                value={selectedAssetReference || ''}
                onChange={handleSelectedAssetChange}
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
            data={netValue.list.filter(
              (d) => d.settlement_asset_reference === selectedAssetReference
            )}
            accessDate={(d: any) => new Date(d.settled_time)}
            accessValue={(d: any) => parseFloat(d.amount)}
            accessGroup={(d: any) => d.account_reference}
            mapGroupToLegendText={(group: string) =>
              (accountReferenceToAccountMap as any)?.[group]?.name
            }
          />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
