'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type CoreInputs = {
  relational_database_origin: string
  relational_database_schema_name?: string
}

export default function Page() {
  const { sync: syncEndUser } = useEndUser()

  const coreIntegrationForm = useForm<CoreInputs>()

  React.useEffect(() => {
    fetchCoreIntegration()
  }, [])

  const fetchCoreIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/core', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        coreIntegrationForm.reset({
          relational_database_origin: data.relational_database_origin || '',
          relational_database_schema_name:
            data.relational_database_schema_name || '',
        })
      },
    })
  }

  const onSubmitCoreIntegrationForm: SubmitHandler<CoreInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/core/relational_database',
      data,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
        },
      }
    )
  }

  const onUpgradeClick = async () => {
    await choreMasterAPIAgent.post(
      '/v1/account_center/integrations/core/relational_database/migrations/upgrade',
      null,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          syncEndUser()
          alert('更新完成。')
        },
      }
    )
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="資料庫" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master
              使用關聯式資料庫來儲存此帳戶產生的資料，您必須完成此設定才能使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={coreIntegrationForm.control}
                name="relational_database_origin"
                defaultValue=""
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="連線字串"
                    variant="standard"
                  />
                )}
              />
              <Controller
                control={coreIntegrationForm.control}
                name="relational_database_schema_name"
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="綱要" variant="standard" />
                )}
              />
              <LoadingButton
                variant="contained"
                onClick={coreIntegrationForm.handleSubmit(
                  onSubmitCoreIntegrationForm
                )}
                loading={coreIntegrationForm.formState.isSubmitting}
              >
                儲存
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
        <ModuleFunctionBody>
          <Box p={2}>
            <Stack spacing={3}>
              <LoadingButton variant="contained" onClick={onUpgradeClick}>
                更新
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
