'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
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
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface Account {
  reference: string
  name: string
}

type CreateAccountFormInputs = {
  name: string
}

type UpdateAccountFormInputs = {
  name: string
}

export default function Page() {
  const { enqueueNotification } = useNotification()

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
    await choreMasterAPIAgent.get('/v1/financial_management/accounts', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch accounts now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setAccounts(data)
      },
    })
    setIsFetchingAccounts(false)
  }, [enqueueNotification])

  const handleSubmitCreateAccountForm: SubmitHandler<
    CreateAccountFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/financial_management/accounts', data, {
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: () => {
        createAccountForm.reset()
        setIsCreateAccountDrawerOpen(false)
        fetchAccounts()
      },
    })
  }

  const handleSubmitUpdateAccountForm: SubmitHandler<
    UpdateAccountFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/financial_management/accounts/${editingAccountReference}`,
      data,
      {
        onFail: ({ message }: any) => {
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
        `/v1/financial_management/accounts/${accountReference}`,
        {
          onFail: ({ message }: any) => {
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
          title="帳戶明細"
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
              onClick={() => setIsCreateAccountDrawerOpen(true)}
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
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell>名字</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.reference} hover>
                    <NoWrapTableCell>
                      <Chip size="small" label={account.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell>{account.name}</NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateAccountForm.setValue('name', account.name)
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
              </TableBody>
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
              createAccountForm.handleSubmit(handleSubmitCreateAccountForm)()
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
            <Button
              variant="contained"
              type="submit"
              loading={createAccountForm.formState.isSubmitting}
            >
              新增
            </Button>
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
              updateAccountForm.handleSubmit(handleSubmitUpdateAccountForm)()
            }}
          >
            <FormControl>
              <Controller
                name="name"
                control={updateAccountForm.control}
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
            <Button
              variant="contained"
              type="submit"
              loading={updateAccountForm.formState.isSubmitting}
            >
              儲存
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
