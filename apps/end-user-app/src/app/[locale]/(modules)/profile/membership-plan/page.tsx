'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'
import React from 'react'

const { CHORE_MASTER_LEARN_HOST } = getConfig()

const plans = [
  {
    name: '免費方案',
    slots: 100,
    monthlyPremium: 0,
  },
  {
    name: '彈性方案',
    slots: 5000,
    monthlyPremium: 99,
  },
  {
    name: '專業方案',
    slots: 15000,
    monthlyPremium: 199,
  },
]

export default function Page() {
  const { enqueueNotification } = useNotification()
  const t = useTranslations('modules.profile.pages.quota')
  const tGlobal = useTranslations('global')
  const currentPlan = plans[0]

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="會員方案" />
        <ModuleFunctionBody>
          <Grid container spacing={2} sx={{ m: 2 }}>
            {plans.map((plan) => (
              <Grid key={plan.name} gap={2} size={{ xs: 12, md: 4 }}>
                <Stack spacing={2}>
                  <Typography variant="body1" color="text.secondary">
                    {plan.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {plan.slots} 個 Slots 使用額度
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {plan.monthlyPremium} 元/月
                  </Typography>
                  {plan.name === currentPlan.name ? (
                    <Button variant="outlined" disabled>
                      目前方案
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary">
                      變更為此方案
                    </Button>
                  )}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
