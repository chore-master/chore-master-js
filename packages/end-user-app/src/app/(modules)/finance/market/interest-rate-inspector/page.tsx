/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import RefreshIcon from '@mui/icons-material/Refresh'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import optionsTemplate from './optionsTemplate'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isLoadingInterestRateInspect, setIsLoadingInterestRateInspect] =
    React.useState(true)
  const [interestRateInspect, setInterestRateInspect] = React.useState<any>({
    policies: [],
  })
  const [options, setOptions] =
    React.useState<Highcharts.Options>(optionsTemplate)
  const [seriesType, setSeriesType] = React.useState<string>('area')

  const fetchInterestRateInspect = React.useCallback(async () => {
    setIsLoadingInterestRateInspect(true)
    await choreMasterAPIAgent.get('/v1/finance/market/interest-rate-inspect', {
      params: {
        cap_amount: 600000,
      },
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setInterestRateInspect(data)
      },
    })
    setIsLoadingInterestRateInspect(false)
  }, [])

  React.useEffect(() => {
    // if (!interestRateInspect) {
    //   return
    // }
    // console.log('wtf')
    const xSet = new Set<number>()
    interestRateInspect.policies.forEach((policy: any) => {
      policy.entries.forEach((entry: any) => {
        xSet.add(entry.min_amount)
        xSet.add(entry.max_amount)
      })
    })
    const xSeries = Array.from(xSet).sort((a: number, b: number) => a - b)
    const sortedPolicies = interestRateInspect.policies.sort(
      (a: any, b: any) => {
        return new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
      }
    )
    setOptions(
      Object.assign({}, optionsTemplate, {
        series: sortedPolicies.map((policy: any) => ({
          type: seriesType,
          stack: 'equity',
          name: `${policy.platform_name} (${policy.end_time.split('T')[0]})`,
          data: xSeries.map((x: number) => {
            const entry = policy.entries.find(
              (entry: any) => x >= entry.min_amount && x <= entry.max_amount
            )
            return [x, entry ? entry.rate * 100 : null]
          }),
        })),
      })
    )
  }, [interestRateInspect, seriesType])

  React.useEffect(() => {
    fetchInterestRateInspect()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="台幣存款利率"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton onClick={fetchInterestRateInspect}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isLoadingInterestRateInspect}>
          <Box sx={{ minWidth: 480 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                color="primary"
                value={seriesType}
                exclusive
                onChange={(
                  event: React.MouseEvent<HTMLElement>,
                  newSeriesType: string
                ) => {
                  setSeriesType(newSeriesType)
                }}
              >
                <Tooltip title="獨立顯示">
                  <ToggleButton value="line">
                    <ShowChartIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="合併顯示">
                  <ToggleButton value="area">
                    <StackedLineChartIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Box>
            <HighChartsCore options={options} />
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
