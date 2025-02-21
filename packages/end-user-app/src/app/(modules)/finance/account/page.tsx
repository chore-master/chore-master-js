'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import { financeAccountEcosystemTypes } from '@/enums'
import type {
  Account,
  CreateAccountFormInputs,
  UpdateAccountFormInputs,
} from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
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

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)
  const [isCreateAccountDrawerOpen, setIsCreateAccountDrawerOpen] =
    React.useState(false)
  const createAccountForm = useForm<CreateAccountFormInputs>()
  const [editingAccountReference, setEditingAccountReference] =
    React.useState<string>()
  const updateAccountForm = useForm<UpdateAccountFormInputs>()

  const fetchAccounts = React.useCallback(async () => {
    setIsFetchingAccounts(true)
    await choreMasterAPIAgent.get('/v1/finance/accounts', {
      params: {},
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
  }, [enqueueNotification])

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
                  <NoWrapTableCell>名字</NoWrapTableCell>
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
                {accounts.map((account) => (
                  <TableRow key={account.reference} hover>
                    <NoWrapTableCell>{account.name}</NoWrapTableCell>
                    <NoWrapTableCell>
                      {
                        financeAccountEcosystemTypes.find(
                          (ecosystemType) =>
                            ecosystemType.value === account.ecosystem_type
                        )?.label
                      }
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <DatetimeBlock isoText={account.opened_time} />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <DatetimeBlock isoText={account.closed_time} />
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
                    required
                    label="開戶時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="closed_time"
                control={createAccountForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="關戶時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                  />
                )}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
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
              <Controller
                name="opened_time"
                control={updateAccountForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="開戶時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="closed_time"
                control={updateAccountForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="關戶時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                  />
                )}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
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
