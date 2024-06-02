'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  root_folder_id: string
  profile_folder_id: string
}

export default function Page() {
  const { sync: syncEndUser } = useEndUser()
  const [] = React.useState(false)
  const googleIntegrationForm = useForm<Inputs>()

  React.useEffect(() => {
    fetchGoogleIntegration()
  }, [])

  const fetchGoogleIntegration = () => {
    choreMasterAPIAgent.get('/v1/integrations/google', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        googleIntegrationForm.reset(data)
      },
    })
  }

  const onSubmitGoogleIntegrationForm: SubmitHandler<Inputs> = (data) => {
    choreMasterAPIAgent.patch('/v1/integrations/google', data, {
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: () => {
        fetchGoogleIntegration()
        syncEndUser()
      },
    })
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="Google 整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master 使用您的 Google Drive 及 Spreadsheet
              來儲存資料狀態，您必須完成此設定才能開始使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <FormControl>
                <Controller
                  name="root_folder_id"
                  control={googleIntegrationForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Google Drive 根目錄資料夾 ID"
                      variant="standard"
                    />
                  )}
                  rules={{ required: 'First name is required' }}
                />
              </FormControl>
              <FormControl>
                <Controller
                  name="profile_folder_id"
                  control={googleIntegrationForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="Google Drive 身份資料夾 ID"
                      variant="standard"
                    />
                  )}
                  rules={{ required: 'First name is required' }}
                />
              </FormControl>
              <Button
                variant="contained"
                onClick={googleIntegrationForm.handleSubmit(
                  onSubmitGoogleIntegrationForm
                )}
              >
                儲存
              </Button>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
