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
  const [isLoadingWeb3Ecosystem, setIsLoadingWeb3Ecosystem] =
    React.useState(true)
  const [options, setOptions] =
    React.useState<Highcharts.Options>(optionsTemplate)

  const fetchWeb3Ecosystem = React.useCallback(async () => {
    if (!isLoadingWeb3Ecosystem) {
      setIsLoadingWeb3Ecosystem(true)
    }
    await choreMasterAPIAgent.get('/v1/finance/market/ecosystem', {
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
        setOptions(
          Object.assign(optionsTemplate, {
            series: [
              {
                ...(optionsTemplate.series?.[0] || {}),
                nodes: data.nodes,
                data: data.links,
              },
            ],
          })
        )
      },
    })
    setIsLoadingWeb3Ecosystem(false)
  }, [])

  React.useEffect(() => {
    fetchWeb3Ecosystem()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="Web3 生態關係"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton onClick={fetchWeb3Ecosystem}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isLoadingWeb3Ecosystem}>
          <HighChartsCore options={options} />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
