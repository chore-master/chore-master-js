'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { useTimezone } from '@/components/timezone'
import { financeBalanceEntryTypes } from '@/constants'
import type {
  Account,
  Asset,
  BalanceSheetDetail,
  UpdateBalanceSheetFormInputs,
} from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import SaveIcon from '@mui/icons-material/Save'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MuiLink from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()
  const router = useRouter()
  const { balance_sheet_reference }: { balance_sheet_reference: string } =
    useParams()

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)

  // BalanceSheet
  const [balanceSheet, setBalanceSheet] =
    React.useState<BalanceSheetDetail | null>(null)
  const [isFetchingBalanceSheet, setIsFetchingBalanceSheet] =
    React.useState(false)
  const updateBalanceSheetForm = useForm<UpdateBalanceSheetFormInputs>()
  const updateBalanceSheetFormBalanceSheetEntriesFieldArray = useFieldArray({
    control: updateBalanceSheetForm.control,
    name: 'balance_entries',
  })

  const fetchAssets = React.useCallback(async () => {
    setIsFetchingAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/assets', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch assets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setAssets(data)
      },
    })
    setIsFetchingAssets(false)
  }, [enqueueNotification])

  const fetchAccounts = React.useCallback(
    async (activeAsOfTime: string) => {
      setIsFetchingAccounts(true)
      await choreMasterAPIAgent.get('/v1/finance/accounts', {
        params: {
          active_as_of_time: activeAsOfTime,
        },
        onError: () => {
          enqueueNotification(`Unable to fetch accounts now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: { data: Account[] }) => {
          setAccounts(data)
        },
      })
      setIsFetchingAccounts(false)
    },
    [enqueueNotification]
  )

  const handleSubmitUpdateBalanceSheetForm: SubmitHandler<
    UpdateBalanceSheetFormInputs
  > = async ({ balanced_time, ...data }) => {
    await choreMasterAPIAgent.post(
      '/v1/finance/balance_sheets',
      {
        ...data,
        balanced_time: new Date(
          timezone.getUTCTimestamp(balanced_time)
        ).toISOString(),
      },
      {
        onError: () => {
          enqueueNotification(`Unable to create balance sheet now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          router.push(`/finance/balance-sheets`)
        },
      }
    )
  }

  const fetchBalanceSheet = React.useCallback(async () => {
    setIsFetchingBalanceSheet(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/balance_sheets/${balance_sheet_reference}`,
      {
        params: {},
        onError: () => {
          enqueueNotification(`Unable to fetch balance sheet now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: { data: BalanceSheetDetail }) => {
          setBalanceSheet(data)
        },
      }
    )
    setIsFetchingBalanceSheet(false)
  }, [balance_sheet_reference])

  React.useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  // React.useEffect(() => {
  //   const currentDate = new Date()
  //   const balancedTime = timezone
  //     .getLocalDate(currentDate)
  //     .toISOString()
  //     .slice(0, -5)
  //   updateBalanceSheetForm.setValue('balanced_time', balancedTime)
  //   fetchAccounts(
  //     new Date(timezone.getUTCTimestamp(balancedTime)).toISOString()
  //   )
  // }, [])

  React.useEffect(() => {
    if (assets.length === 0) {
      return
    }

    const currentFields =
      updateBalanceSheetFormBalanceSheetEntriesFieldArray.fields

    const removingFieldIndices: number[] = []
    currentFields.forEach((field, index) => {
      const accountExists = accounts.some(
        (account) => account.reference === field.account_reference
      )
      if (!accountExists) {
        removingFieldIndices.push(index)
      }
    })
    removingFieldIndices
      .sort((a, b) => b - a)
      .forEach((index) => {
        updateBalanceSheetFormBalanceSheetEntriesFieldArray.remove(index)
      })

    accounts.forEach((account) => {
      const existingEntry = currentFields.find(
        (field) => field.account_reference === account.reference
      )
      if (!existingEntry) {
        updateBalanceSheetFormBalanceSheetEntriesFieldArray.append({
          account_reference: account.reference,
          asset_reference: assets[0].reference,
          entry_type: financeBalanceEntryTypes[0].value,
          amount: '0',
        })
      }
    })
  }, [accounts, assets])

  React.useEffect(() => {
    fetchBalanceSheet()
  }, [])

  React.useEffect(() => {
    if (balanceSheet) {
      const balancedTime = timezone
        .getLocalString(balanceSheet.balanced_time)
        .slice(0, -5)
      fetchAccounts(
        new Date(timezone.getUTCTimestamp(balancedTime)).toISOString()
      )
      updateBalanceSheetForm.setValue('balanced_time', balancedTime)
      updateBalanceSheetForm.setValue(
        'balance_entries',
        balanceSheet.balance_entries
      )
    }
  }, [balanceSheet])

  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/finance/balance-sheets"
          >
            資產負債表
          </MuiLink>
          {balanceSheet && (
            <MuiLink
              component={Link}
              underline="hover"
              color="inherit"
              href={`/finance/balance_sheets/${balance_sheet_reference}`}
            >
              <Chip
                size="small"
                sx={{ ml: 1 }}
                label={balanceSheet.reference}
              />
            </MuiLink>
          )}
          <Typography color="text.primary">更新</Typography>
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          title="更新資產負債表"
          actions={[
            <AutoLoadingButton
              key="update"
              variant="contained"
              onClick={updateBalanceSheetForm.handleSubmit(
                handleSubmitUpdateBalanceSheetForm
              )}
              disabled={!updateBalanceSheetForm.formState.isValid}
              startIcon={<SaveIcon />}
            >
              更新
            </AutoLoadingButton>,
          ]}
          sticky
        />

        <ModuleFunctionBody>
          <Stack spacing={3} p={2}>
            <Typography variant="h6">一般</Typography>
            <FormControl>
              <Controller
                name="balanced_time"
                control={updateBalanceSheetForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="結算時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                    onBlur={() => {
                      try {
                        fetchAccounts(
                          new Date(
                            timezone.getUTCTimestamp(field.value)
                          ).toISOString()
                        )
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
          </Stack>
        </ModuleFunctionBody>

        <ModuleFunctionBody loading={isFetchingAssets || isFetchingAccounts}>
          <Stack spacing={3} p={2}>
            <Typography variant="h6">帳目</Typography>
          </Stack>

          <Grid container spacing={2} p={2} rowSpacing={1}>
            {updateBalanceSheetFormBalanceSheetEntriesFieldArray.fields.map(
              (field, index) => {
                return (
                  <React.Fragment key={field.id}>
                    <Grid size={12} container spacing={2} alignItems="center">
                      <Grid size={3}>
                        <Chip
                          size="small"
                          label={
                            accounts.find(
                              (account) =>
                                account.reference === field.account_reference
                            )?.name
                          }
                          color="info"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={3}>
                        <Controller
                          name={`balance_entries.${index}.entry_type`}
                          control={updateBalanceSheetForm.control}
                          defaultValue={financeBalanceEntryTypes[0].value}
                          render={({ field }) => (
                            <FormControl
                              required
                              fullWidth
                              size="small"
                              variant="filled"
                            >
                              <InputLabel>類型</InputLabel>
                              <Select {...field}>
                                {financeBalanceEntryTypes.map((entryType) => (
                                  <MenuItem
                                    key={entryType.value}
                                    value={entryType.value}
                                  >
                                    {entryType.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          rules={{ required: '必填' }}
                        />
                      </Grid>
                      <Grid size={3}>
                        <FormControl fullWidth>
                          <Controller
                            name={`balance_entries.${index}.amount`}
                            control={updateBalanceSheetForm.control}
                            defaultValue="0"
                            render={({ field }) => (
                              <TextField
                                {...field}
                                required
                                label="數量"
                                variant="filled"
                                type="number"
                                size="small"
                              />
                            )}
                            rules={{ required: '必填' }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={3}>
                        <FormControl fullWidth>
                          <Controller
                            name={`balance_entries.${index}.asset_reference`}
                            control={updateBalanceSheetForm.control}
                            defaultValue=""
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                value={
                                  assets.find(
                                    (asset) => asset.reference === field.value
                                  ) ?? null
                                }
                                onChange={(_event, value) => {
                                  field.onChange(value?.reference ?? '')
                                }}
                                // onOpen={() => {
                                //   if (assets.length === 0) {
                                //     fetchAssets()
                                //   }
                                // }}
                                isOptionEqualToValue={(option, value) =>
                                  option.reference === value.reference
                                }
                                getOptionLabel={(option) => option.name}
                                options={assets}
                                autoHighlight
                                loading={isFetchingAssets}
                                loadingText="載入中..."
                                noOptionsText="沒有符合的選項"
                                renderOption={(props, option) => {
                                  const { key, ...optionProps } = props as {
                                    key: React.Key
                                  }
                                  return (
                                    <Box
                                      key={key}
                                      component="li"
                                      {...optionProps}
                                    >
                                      <Chip
                                        size="small"
                                        label={option.name}
                                        color="info"
                                        variant="outlined"
                                      />
                                    </Box>
                                  )
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="結算資產"
                                    variant="filled"
                                    size="small"
                                  />
                                )}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                )
              }
            )}
          </Grid>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
