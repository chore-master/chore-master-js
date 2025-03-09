'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import WithRef from '@/components/WithRef'
import { financeAccountEcosystemTypes } from '@/constants'
import type {
  Account,
  Asset,
  CreateAccountFormInputs,
  UpdateAccountFormInputs,
} from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { validateDatetimeField } from '@/utils/validation'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()

  // Asset
  const [settleableAssets, setSettleableAssets] = React.useState<Asset[]>([])
  const [isFetchingSettleableAssets, setIsFetchingSettleableAssets] =
    React.useState(false)

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [accountsCount, setAccountsCount] = React.useState(0)
  const [accountsPage, setAccountsPage] = React.useState(0)
  const [accountsRowsPerPage, setAccountsRowsPerPage] = React.useState(10)
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)
  const [isCreateAccountDrawerOpen, setIsCreateAccountDrawerOpen] =
    React.useState(false)
  const createAccountForm = useForm<CreateAccountFormInputs>({ mode: 'all' })
  const [editingAccountReference, setEditingAccountReference] =
    React.useState<string>()
  const updateAccountForm = useForm<UpdateAccountFormInputs>({ mode: 'all' })

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

  const fetchAccounts = React.useCallback(async () => {
    setIsFetchingAccounts(true)
    await choreMasterAPIAgent.get('/v1/finance/accounts', {
      params: {
        offset: accountsPage * accountsRowsPerPage,
        limit: accountsRowsPerPage,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch accounts now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({
        data,
        metadata,
      }: {
        data: Account[]
        metadata: any
      }) => {
        setAccounts(data)
        setAccountsCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingAccounts(false)
  }, [accountsPage, accountsRowsPerPage])

  const handleSubmitCreateAccountForm: SubmitHandler<
    CreateAccountFormInputs
  > = async ({ opened_time, closed_time, ...data }) => {
    await choreMasterAPIAgent.post(
      '/v1/finance/accounts',
      {
        ...data,
        opened_time: new Date(
          timezone.getUTCTimestamp(opened_time)
        ).toISOString(),
        closed_time: closed_time
          ? new Date(timezone.getUTCTimestamp(closed_time)).toISOString()
          : null,
      },
      {
        onError: () => {
          enqueueNotification(`Unable to create account now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          createAccountForm.reset()
          setIsCreateAccountDrawerOpen(false)
          fetchAccounts()
        },
      }
    )
  }

  const handleSubmitUpdateAccountForm: SubmitHandler<
    UpdateAccountFormInputs
  > = async ({ opened_time, closed_time, ...data }) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/accounts/${editingAccountReference}`,
      {
        ...data,
        opened_time: new Date(
          timezone.getUTCTimestamp(opened_time)
        ).toISOString(),
        closed_time: closed_time
          ? new Date(timezone.getUTCTimestamp(closed_time)).toISOString()
          : null,
      },
      {
        onError: () => {
          enqueueNotification(`Unable to update account now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          updateAccountForm.reset()
          setEditingAccountReference(undefined)
          fetchAccounts()
        },
      }
    )
  }

  const deleteAccount = React.useCallback(
    async (accountReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/accounts/${accountReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete account now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchAccounts()
          },
        }
      )
    },
    [enqueueNotification, fetchAccounts]
  )

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  React.useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="帳戶"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchAccounts}
                  disabled={isFetchingAccounts}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
            <Button
              key="create"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                createAccountForm.reset()
                setIsCreateAccountDrawerOpen(true)
              }}
            >
              新增
            </Button>,
          ]}
        />

        <ModuleFunctionBody loading={isFetchingAccounts}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell align="right">#</NoWrapTableCell>
                  <NoWrapTableCell>名字</NoWrapTableCell>
                  <NoWrapTableCell>結算資產</NoWrapTableCell>
                  <NoWrapTableCell>生態系</NoWrapTableCell>
                  <NoWrapTableCell>開戶時間</NoWrapTableCell>
                  <NoWrapTableCell>關戶時間</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingAccounts}
                isEmpty={accounts.length === 0}
              >
                {accounts.map((account, index) => (
                  <TableRow key={account.reference} hover>
                    <NoWrapTableCell align="right">{index + 1}</NoWrapTableCell>
                    <NoWrapTableCell>{account.name}</NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip
                        size="small"
                        label={
                          settleableAssets.find(
                            (asset) =>
                              asset.reference ===
                              account.settlement_asset_reference
                          )?.name
                        }
                        color="info"
                        variant="outlined"
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip
                        size="small"
                        label={
                          financeAccountEcosystemTypes.find(
                            (ecosystemType) =>
                              ecosystemType.value === account.ecosystem_type
                          )?.label
                        }
                        variant="outlined"
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <DatetimeBlock isoText={account.opened_time} />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {account.closed_time ? (
                        <DatetimeBlock isoText={account.closed_time} />
                      ) : (
                        <PlaceholderTypography>N/A</PlaceholderTypography>
                      )}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip size="small" label={account.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateAccountForm.setValue('name', account.name)
                          updateAccountForm.setValue(
                            'ecosystem_type',
                            account.ecosystem_type
                          )
                          updateAccountForm.setValue(
                            'opened_time',
                            timezone
                              .getLocalString(account.opened_time)
                              .slice(0, -5)
                          )
                          updateAccountForm.setValue(
                            'closed_time',
                            account.closed_time
                              ? timezone
                                  .getLocalString(account.closed_time)
                                  .slice(0, -5)
                              : ''
                          )
                          setEditingAccountReference(account.reference)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteAccount(account.reference)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </NoWrapTableCell>
                  </TableRow>
                ))}
              </StatefulTableBody>
            </Table>
          </TableContainer>
          <TablePagination
            count={accountsCount}
            page={accountsPage}
            rowsPerPage={accountsRowsPerPage}
            setPage={setAccountsPage}
            setRowsPerPage={setAccountsRowsPerPage}
            rowsPerPageOptions={[10, 20]}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
        anchor="right"
        open={isCreateAccountDrawerOpen}
        onClose={() => setIsCreateAccountDrawerOpen(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增帳戶" />
          <Stack
            component="form"
            spacing={3}
            p={2}
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <FormControl>
              <Controller
                name="name"
                control={createAccountForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名字"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <Controller
              name="ecosystem_type"
              control={createAccountForm.control}
              defaultValue={financeAccountEcosystemTypes[0].value}
              render={({ field }) => (
                <FormControl required fullWidth size="small" variant="filled">
                  <InputLabel>生態系</InputLabel>
                  <Select {...field}>
                    {financeAccountEcosystemTypes.map((ecosystemType) => (
                      <MenuItem
                        key={ecosystemType.value}
                        value={ecosystemType.value}
                      >
                        {ecosystemType.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <FormControl>
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="opened_time"
                    control={createAccountForm.control}
                    defaultValue={timezone
                      .getLocalDate(new Date())
                      .toISOString()
                      .slice(0, -5)}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        required
                        label="開戶時間"
                        variant="filled"
                        type="datetime-local"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={!!createAccountForm.formState.errors.opened_time}
                        helperText={
                          createAccountForm.formState.errors.opened_time
                            ?.message
                        }
                      />
                    )}
                    rules={{
                      validate: (value) =>
                        validateDatetimeField(value, inputRef, true),
                    }}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="closed_time"
                    control={createAccountForm.control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        label="關戶時間"
                        variant="filled"
                        type="datetime-local"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={!!createAccountForm.formState.errors.closed_time}
                        helperText={
                          createAccountForm.formState.errors.closed_time
                            ?.message
                        }
                      />
                    )}
                    rules={{
                      validate: (value) =>
                        validateDatetimeField(value, inputRef, false),
                    }}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="settlement_asset_reference"
                control={createAccountForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={
                      settleableAssets.find(
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
                    options={settleableAssets}
                    autoHighlight
                    loading={isFetchingSettleableAssets}
                    // loadingText="載入中..."
                    // noOptionsText="沒有符合的選項"
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props as {
                        key: React.Key
                      }
                      return (
                        <Box key={key} component="li" {...optionProps}>
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
                        helperText="建立後無法變更"
                        required
                      />
                    )}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              disabled={!createAccountForm.formState.isValid}
              onClick={createAccountForm.handleSubmit(
                handleSubmitCreateAccountForm
              )}
            >
              新增
            </AutoLoadingButton>
          </Stack>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={editingAccountReference !== undefined}
        onClose={() => setEditingAccountReference(undefined)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="編輯帳戶" />
          <Stack
            component="form"
            spacing={3}
            p={2}
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <FormControl>
              <Controller
                name="name"
                control={updateAccountForm.control}
                defaultValue={financeAccountEcosystemTypes[0].value}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名字"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <Controller
              name="ecosystem_type"
              control={updateAccountForm.control}
              defaultValue=""
              render={({ field }) => (
                <FormControl required fullWidth size="small" variant="filled">
                  <InputLabel>生態系</InputLabel>
                  <Select {...field}>
                    {financeAccountEcosystemTypes.map((ecosystemType) => (
                      <MenuItem
                        key={ecosystemType.value}
                        value={ecosystemType.value}
                      >
                        {ecosystemType.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <FormControl>
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="opened_time"
                    control={updateAccountForm.control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        required
                        label="開戶時間"
                        variant="filled"
                        type="datetime-local"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={!!updateAccountForm.formState.errors.opened_time}
                        helperText={
                          updateAccountForm.formState.errors.opened_time
                            ?.message
                        }
                      />
                    )}
                    rules={{
                      validate: (value) =>
                        validateDatetimeField(value, inputRef, true),
                    }}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="closed_time"
                    control={updateAccountForm.control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        label="關戶時間"
                        variant="filled"
                        type="datetime-local"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={!!updateAccountForm.formState.errors.closed_time}
                        helperText={
                          updateAccountForm.formState.errors.closed_time
                            ?.message
                        }
                      />
                    )}
                    rules={{
                      validate: (value) =>
                        validateDatetimeField(value, inputRef, false),
                    }}
                  />
                )}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              disabled={!updateAccountForm.formState.isValid}
              onClick={updateAccountForm.handleSubmit(
                handleSubmitUpdateAccountForm
              )}
            >
              儲存
            </AutoLoadingButton>
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
