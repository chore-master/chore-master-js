'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import { Quota } from '@/types/trace'
import choreMasterAPIAgent from '@/utils/apiAgent'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'
import React from 'react'

const { CHORE_MASTER_LEARN_HOST } = getConfig()

export default function Page() {
  const { enqueueNotification } = useNotification()
  const t = useTranslations('modules.profile.pages.quota')
  const tGlobal = useTranslations('global')

  // Quotas
  const [quotas, setQuotas] = React.useState<Quota[]>([])
  const [isFetchingQuotas, setIsFetchingQuotas] = React.useState(false)

  const fetchQuotas = React.useCallback(async () => {
    setIsFetchingQuotas(true)
    await choreMasterAPIAgent.get('/v1/trace/users/me/quotas', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch quotas now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: { data: Quota[] }) => {
        setQuotas(data)
      },
    })
    setIsFetchingQuotas(false)
  }, [])

  React.useEffect(() => {
    fetchQuotas()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title={t('titles.quota')}
          actions={[
            <Tooltip key="refresh" title={tGlobal('refresh')}>
              <span>
                <IconButton onClick={fetchQuotas} disabled={isFetchingQuotas}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingQuotas}>
          <Stack spacing={2} sx={{ p: 2, flexGrow: 1 }}>
            {quotas.length === 0 ? (
              <PlaceholderTypography>
                {t('typographies.noQuota')}
              </PlaceholderTypography>
            ) : (
              quotas.map((quota) => (
                <Stack key={quota.reference} spacing={1}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="h6">
                      {t('subtitles.storage')}
                    </Typography>
                    <IconButton
                      href={`${CHORE_MASTER_LEARN_HOST}/guides/slot-policies`}
                      target="_blank"
                      size="small"
                    >
                      <HelpOutlinedIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                  <Typography variant="body1">
                    {`${t('typographies.used')} ${quota.used} / ${t(
                      'typographies.limit'
                    )} ${quota.limit}`}
                  </Typography>
                  <Typography variant="body1">
                    {`${t('typographies.utilizationRate')} ${(
                      (quota.used / quota.limit) *
                      100
                    ).toFixed(2)}%`}
                  </Typography>
                  <LinearProgress
                    value={(quota.used / quota.limit) * 100}
                    variant="determinate"
                    sx={{
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                </Stack>
              ))
            )}
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
