'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoadingButton from '@mui/lab/LoadingButton'
import { Button } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
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

type OKXTradeInputs = {
  accounts: {
    env: string
    name: string
    password: string
    passphrase: string
    api_key: string
  }[]
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const okxTradeIntegrationForm = useForm<OKXTradeInputs>()
  const okxTradeIntegrationFormAccountFieldArray = useFieldArray({
    control: okxTradeIntegrationForm.control,
    name: 'accounts',
  })

  React.useEffect(() => {
    fetchOKXTradeIntegration()
  }, [])

  const fetchOKXTradeIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/okx_trade', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        okxTradeIntegrationForm.reset({
          accounts: Object.values(data?.account_map || {}),
        })
      },
    })
  }

  const onSubmitOkxTradeIntegrationForm: SubmitHandler<OKXTradeInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/okx_trade',
      data,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchOKXTradeIntegration()
          enqueueNotification('儲存成功。', 'success')
        },
      }
    )
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="OKX Service" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>用於監控OKX Risk。</Typography>
            <Stack spacing={3}>
              {okxTradeIntegrationFormAccountFieldArray.fields.map(
                (field, index) => (
                  <Accordion key={field.id} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {okxTradeIntegrationForm.watch(
                        `accounts.${index}.name`
                      ) || '未命名'}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        <Controller
                          control={okxTradeIntegrationForm.control}
                          name={`accounts.${index}.env`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="環境"
                              variant="standard"
                            />
                          )}
                        />
                        <Controller
                          control={okxTradeIntegrationForm.control}
                          name={`accounts.${index}.name`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="識別名稱"
                              variant="standard"
                            />
                          )}
                        />
                        <Controller
                          control={okxTradeIntegrationForm.control}
                          name={`accounts.${index}.api_key`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="API Key"
                              variant="standard"
                            />
                          )}
                        />
                        <Controller
                          control={okxTradeIntegrationForm.control}
                          name={`accounts.${index}.password`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="Password"
                              variant="standard"
                            />
                          )}
                        />
                        <Controller
                          control={okxTradeIntegrationForm.control}
                          name={`accounts.${index}.passphrase`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="Passphrase"
                              variant="standard"
                            />
                          )}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            okxTradeIntegrationFormAccountFieldArray.remove(
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
                  okxTradeIntegrationFormAccountFieldArray.append({
                    env: '',
                    name: '',
                    password: '',
                    passphrase: '',
                    api_key: '',
                  })
                }
              >
                新增一筆
              </Button>
              <LoadingButton
                variant="contained"
                onClick={okxTradeIntegrationForm.handleSubmit(
                  onSubmitOkxTradeIntegrationForm
                )}
                loading={okxTradeIntegrationForm.formState.isSubmitting}
                disabled={
                  !okxTradeIntegrationForm.formState.isDirty ||
                  !okxTradeIntegrationForm.formState.isValid
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
