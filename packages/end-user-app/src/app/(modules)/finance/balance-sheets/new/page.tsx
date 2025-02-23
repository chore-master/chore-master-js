'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { useTimezone } from '@/components/timezone'
import type { Account, Asset, CreateBalanceSheetFormInputs } from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

  // Asset
  const [settleableAssets, setSettleableAssets] = React.useState<Asset[]>([])
  const [isFetchingSettleableAssets, setIsFetchingSettleableAssets] =
    React.useState(false)

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)

  // BalanceSheet
  const createBalanceSheetForm = useForm<CreateBalanceSheetFormInputs>()
  const createBalanceSheetFormBalanceSheetEntriesFieldArray = useFieldArray({
    control: createBalanceSheetForm.control,
    name: 'balance_entries',
  })

  const fetchSettleableAssets = React.useCallback(async () => {
    setIsFetchingSettleableAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/assets', {
      params: {
        is_settleable: true,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch settleable assets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setSettleableAssets(data)
      },
    })
    setIsFetchingSettleableAssets(false)
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

  const handleSubmitCreateBalanceSheetForm: SubmitHandler<
    CreateBalanceSheetFormInputs
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

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  React.useEffect(() => {
    const currentDate = new Date()
    const balancedTime = timezone
      .getLocalDate(currentDate)
      .toISOString()
      .slice(0, -5)
    createBalanceSheetForm.setValue('balanced_time', balancedTime)
    fetchAccounts(
      new Date(timezone.getUTCTimestamp(balancedTime)).toISOString()
    )
  }, [])

  React.useEffect(() => {
    const currentFields =
      createBalanceSheetFormBalanceSheetEntriesFieldArray.fields

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
        createBalanceSheetFormBalanceSheetEntriesFieldArray.remove(index)
      })

    accounts.forEach((account) => {
      const existingEntry = currentFields.find(
        (field) => field.account_reference === account.reference
      )
      if (!existingEntry) {
        createBalanceSheetFormBalanceSheetEntriesFieldArray.append({
          account_reference: account.reference,
          amount: '0',
        })
      }
    })
  }, [accounts])

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
          <Typography color="text.primary">新增</Typography>
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          title="新增資產負債表"
          actions={[
            <AutoLoadingButton
              key="create"
              variant="contained"
              onClick={createBalanceSheetForm.handleSubmit(
                handleSubmitCreateBalanceSheetForm
              )}
              disabled={!createBalanceSheetForm.formState.isValid}
              startIcon={<AddIcon />}
            >
              新增
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
                control={createBalanceSheetForm.control}
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

        <ModuleFunctionBody
          loading={isFetchingSettleableAssets || isFetchingAccounts}
        >
          <Stack spacing={3} p={2}>
            <Typography variant="h6">帳目</Typography>
          </Stack>

          <Grid container spacing={2} p={2} rowSpacing={1}>
            {createBalanceSheetFormBalanceSheetEntriesFieldArray.fields.map(
              (field, index) => {
                const account = accounts.find(
                  (account) => account.reference === field.account_reference
                )
                const settleableAsset = settleableAssets.find(
                  (asset) =>
                    asset.reference === account?.settlement_asset_reference
                )
                return (
                  <React.Fragment key={field.id}>
                    <Grid size={12} container spacing={2} alignItems="center">
                      <Grid size={4}>
                        <Chip
                          size="small"
                          label={account?.name}
                          color="info"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={4}>
                        <FormControl fullWidth>
                          <Controller
                            name={`balance_entries.${index}.amount`}
                            control={createBalanceSheetForm.control}
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
                      <Grid size={4}>
                        <Chip
                          size="small"
                          label={settleableAsset?.name}
                          color="info"
                          variant="outlined"
                        />
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
