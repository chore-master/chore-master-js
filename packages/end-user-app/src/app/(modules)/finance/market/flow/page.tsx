'use client'

import HighChartsCore from '@/components/charts/HighChartsCore'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { getOptions } from './options'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isLoadingMarketFlow, setIsLoadingMarketATokenTransactions] =
    React.useState(true)
  const [options, setOptions] = React.useState<Highcharts.Options>(
    getOptions([])
  )

  const fetchMarketATokenTransactions = React.useCallback(async () => {
    setIsLoadingMarketATokenTransactions(true)
    await choreMasterAPIAgent.get('/v1/finance/market/a_token_transactions', {
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
        setOptions(getOptions(data.series))
      },
    })
    setIsLoadingMarketATokenTransactions(false)
  }, [enqueueNotification])

  React.useEffect(() => {
    fetchMarketATokenTransactions()
  }, [fetchMarketATokenTransactions])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="AAVE 借款流向"
          actions={[
            <Tooltip key="copy" title="複製">
              <span>
                <IconButton
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(JSON.stringify(options))
                      .catch((e: unknown) => {
                        enqueueNotification('複製失敗', 'error')
                      })
                  }
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>,
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton onClick={fetchMarketATokenTransactions}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isLoadingMarketFlow}>
          <HighChartsCore options={options} />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
