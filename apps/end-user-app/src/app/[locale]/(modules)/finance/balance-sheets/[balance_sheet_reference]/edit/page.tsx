'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import ReferenceBlock from '@/components/ReferenceBlock'
import { useTimezone } from '@/components/timezone'
import type {
  Account,
  Asset,
  BalanceSheetDetail,
  UpdateBalanceSheetFormInputs,
} from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import SaveIcon from '@mui/icons-material/Save'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import LinearProgress from '@mui/material/LinearProgress'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Decimal from 'decimal.js'
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
  const [settleableAssets, setSettleableAssets] = React.useState<Asset[]>([])
  const [isFetchingSettleableAssets, setIsFetchingSettleableAssets] =
    React.useState(false)

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

  const fetchSettleableAssets = React.useCallback(async () => {
    setIsFetchingSettleableAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/users/me/assets', {
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
      await choreMasterAPIAgent.get('/v1/finance/users/me/accounts', {
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
  > = async ({ balanced_time, balance_entries, ...data }) => {
    await choreMasterAPIAgent.put(
      `/v1/finance/users/me/balance_sheets/${balance_sheet_reference}`,
      {
        ...data,
        balanced_time: new Date(
          timezone.getUTCTimestamp(balanced_time)
        ).toISOString(),
        balance_entries: balance_entries.map(
          ({ amount, ...balance_entry }, i) => {
            const account = accounts[i]
            const asset = settleableAssets.find(
              (asset) => asset.reference === account.settlement_asset_reference
            ) as Asset
            const decimals = asset.decimals
            return {
              ...balance_entry,
              amount: new Decimal(amount).times(10 ** decimals).toFixed(),
            }
          }
        ),
      },
      {
        onError: () => {
          enqueueNotification(`Unable to update balance sheet now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          router.push(`/finance/balance-sheets/${balance_sheet_reference}`)
        },
      }
    )
  }

  const fetchBalanceSheet = React.useCallback(async () => {
    setIsFetchingBalanceSheet(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/users/me/balance_sheets/${balance_sheet_reference}`,
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

  const deleteBalanceSheet = React.useCallback(
    async (balanceSheetReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/users/me/balance_sheets/${balanceSheetReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete balance sheet now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            router.push(`/finance/balance-sheets`)
          },
        }
      )
    },
    [enqueueNotification]
  )

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  React.useEffect(() => {
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
          amount: '0',
        })
      }
    })
  }, [accounts])

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
    }
  }, [balanceSheet])

  React.useEffect(() => {
    if (balanceSheet && accounts.length > 0 && settleableAssets.length > 0) {
      updateBalanceSheetForm.setValue(
        'balance_entries',
        balanceSheet.balance_entries.map(({ amount, ...balance_entry }, i) => {
          const account = accounts[i]
          const asset = settleableAssets.find(
            (asset) => asset.reference === account.settlement_asset_reference
          ) as Asset
          const decimals = asset.decimals
          return {
            account_reference: balance_entry.account_reference,
            amount: new Decimal(amount).dividedBy(10 ** decimals).toFixed(),
          }
        })
      )
    }
  }, [balanceSheet, accounts, settleableAssets])

  if (isFetchingBalanceSheet || isFetchingSettleableAssets) {
    return <LinearProgress />
  }

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
            結餘
          </MuiLink>
          {balanceSheet && (
            <MuiLink
              component={Link}
              underline="hover"
              color="inherit"
              href={`/finance/balance-sheets/${balance_sheet_reference}`}
            >
              <ReferenceBlock
                label={balanceSheet.reference}
                primaryKey
                monospace
              />
            </MuiLink>
          )}
          <Typography color="text.primary">更新</Typography>
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          stickyTop
          title="更新結餘"
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
        />

        <ModuleFunctionBody>
          <Stack spacing={3} p={2}>
            <Typography variant="h6" color="textSecondary">
              一般
            </Typography>
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

        <ModuleFunctionBody
          loading={isFetchingSettleableAssets || isFetchingAccounts}
        >
          <Stack spacing={3} p={2}>
            <Typography variant="h6" color="textSecondary">
              帳目
            </Typography>
          </Stack>

          <Grid container spacing={2} p={2} rowSpacing={1}>
            {updateBalanceSheetFormBalanceSheetEntriesFieldArray.fields.map(
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
                        <ReferenceBlock label={account?.name} foreignValue />
                      </Grid>
                      <Grid size={4}>
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
                      <Grid size={4}>
                        <ReferenceBlock
                          label={settleableAsset?.name}
                          foreignValue
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

      <ModuleFunction>
        <ModuleFunctionBody>
          <Stack
            component="form"
            spacing={3}
            p={2}
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Typography variant="h6" color="textSecondary">
              進階
            </Typography>
            <AutoLoadingButton
              variant="contained"
              color="error"
              onClick={async () => {
                await deleteBalanceSheet(balance_sheet_reference)
              }}
            >
              刪除
            </AutoLoadingButton>
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
