'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoadingButton from '@mui/lab/LoadingButton'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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

type SinoTradeInputs = {
  accounts: {
    name: string
    api_key: string
    secret_key: string
  }[]
}

export default function Page() {
  const sinoTradeIntegrationForm = useForm<SinoTradeInputs>()
  const sinoTradeIntegrationFormAccountFieldArray = useFieldArray({
    control: sinoTradeIntegrationForm.control,
    name: 'accounts',
  })

  React.useEffect(() => {
    fetchSinoTradeIntegration()
  }, [])

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
                          control={sinoTradeIntegrationForm.control}
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
                          control={sinoTradeIntegrationForm.control}
                          name={`accounts.${index}.secret_key`}
                          rules={{ required: '必填' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label="Secret Key"
                              variant="standard"
                            />
                          )}
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
                  !sinoTradeIntegrationForm.formState.isDirty ||
                  !sinoTradeIntegrationForm.formState.isValid
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
