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
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import optionsTemplate from './optionsTemplate'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isLoadingInterestRateInspect, setIsLoadingInterestRateInspect] =
    React.useState(true)
  const [options, setOptions] =
    React.useState<Highcharts.Options>(optionsTemplate)

  const fetchInterestRateInspect = React.useCallback(async () => {
    setIsLoadingInterestRateInspect(true)
    await choreMasterAPIAgent.get('/v1/finance/market/interest-rate-inspect', {
      params: {},
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
        const xSet = new Set<number>()
        data.policies.forEach((policy: any) => {
          policy.entries.forEach((entry: any) => {
            xSet.add(entry.min_amount)
            xSet.add(entry.max_amount)
          })
        })
        const xSeries = Array.from(xSet).sort((a: number, b: number) => a - b)
        const sortedPolicies = data.policies.sort((a: any, b: any) => {
          return new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
        })

        setOptions(
          Object.assign(optionsTemplate, {
            series: sortedPolicies.map((policy: any) => ({
              type: 'area',
              stack: 'equity',
              name: `${policy.platform_name} (${
                policy.end_time.split('T')[0]
              })`,
              data: xSeries.map((x: number) => {
                const entry = policy.entries.find(
                  (entry: any) => x >= entry.min_amount && x <= entry.max_amount
                )
                return [x, entry ? entry.rate * 100 : null]
              }),
            })),
          })
        )
      },
    })
    setIsLoadingInterestRateInspect(false)
  }, [])

  React.useEffect(() => {
    fetchInterestRateInspect()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="利率檢視器"
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
          <HighChartsCore options={options} />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
