'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'

type GoogleInputs = {
  drive_root_folder_id: string
}

type SinoTradeInputs = {
  accounts: {
    name: string
    api_key: string
    secret_key: string
  }[]
}

export default function Page() {
  const { sync: syncEndUser } = useEndUser()
  const googleIntegrationForm = useForm<GoogleInputs>()
  const sinoTradeIntegrationForm = useForm<SinoTradeInputs>()
  const sinoTradeIntegrationFormAccountFieldArray = useFieldArray({
    control: sinoTradeIntegrationForm.control,
    name: 'accounts',
  })

  React.useEffect(() => {
    fetchGoogleIntegration()
    fetchSinoTradeIntegration()
  }, [])

  const fetchGoogleIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/google', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        googleIntegrationForm.reset({
          drive_root_folder_id: data?.drive?.root_folder_id,
        })
      },
    })
  }

  const fetchSinoTradeIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/sino_trade', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        sinoTradeIntegrationForm.reset({
          accounts: Object.values(data?.account_map || {}),
        })
      },
    })
  }

  const onSubmitGoogleIntegrationForm: SubmitHandler<GoogleInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/google',
      data,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchGoogleIntegration()
          syncEndUser()
          alert('掛載完成。')
        },
      }
    )
  }

  const onSubmitSinoTradeIntegrationForm: SubmitHandler<
    SinoTradeInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/sino_trade',
      data,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchSinoTradeIntegration()
          alert('儲存成功。')
        },
      }
    )
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="Google 服務整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master 使用您的 Google Drive 及 Spreadsheet
              來儲存資料狀態，您必須完成此設定才能使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <FormControl>
                <Controller
                  name="drive_root_folder_id"
                  control={googleIntegrationForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="掛載至 Google Drive 資料夾 ID"
                      variant="standard"
                    />
                  )}
                  rules={{ required: '必填' }}
                />
              </FormControl>
              <LoadingButton
                variant="contained"
                onClick={googleIntegrationForm.handleSubmit(
                  onSubmitGoogleIntegrationForm
                )}
                loading={googleIntegrationForm.formState.isSubmitting}
              >
                掛載
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="永豐服務整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>用於匯入對帳單至 Chore Master。</Typography>
            <Stack spacing={3}>
              {sinoTradeIntegrationFormAccountFieldArray.fields.map(
                (field, index) => (
                  <Accordion key={field.id} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {sinoTradeIntegrationForm.watch(
                        `accounts.${index}.name`
                      ) || '未命名'}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.name`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="識別名稱"
                              variant="standard"
                            />
                          )}
                          rules={{ required: '必填' }}
                        />
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.api_key`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="API Key"
                              variant="standard"
                            />
                          )}
                          rules={{ required: '必填' }}
                        />
                        <Controller
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.secret_key`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="Secret Key"
                              variant="standard"
                            />
                          )}
                          rules={{ required: '必填' }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            sinoTradeIntegrationFormAccountFieldArray.remove(
                              index
                            )
                          }
                        >
                          刪除
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
              <Button
                variant="outlined"
                onClick={() =>
                  sinoTradeIntegrationFormAccountFieldArray.append({
                    name: '',
                    api_key: '',
                    secret_key: '',
                  })
                }
              >
                新增一筆
              </Button>
              <LoadingButton
                variant="contained"
                onClick={sinoTradeIntegrationForm.handleSubmit(
                  onSubmitSinoTradeIntegrationForm
                )}
                loading={sinoTradeIntegrationForm.formState.isSubmitting}
                disabled={
                  sinoTradeIntegrationFormAccountFieldArray.fields.length ===
                    0 || !sinoTradeIntegrationForm.formState.isValid
                }
              >
                儲存
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
