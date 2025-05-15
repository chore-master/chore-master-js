'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleContainer,
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTab } from '@/hooks/useTab'
import { Link } from '@/i18n/navigation'
import type { UpdateUserFormInputs, UserDetail } from '@/types/admin'
import type { Role } from '@/types/identity'
import { Quota, UpdateQuotaFormInputs } from '@/types/trace'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import RefreshIcon from '@mui/icons-material/Refresh'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import MuiLink from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const tab = useTab({
    defaultValue: 'overview',
  })
  const { enqueueNotification } = useNotification()
  const { user_reference }: { user_reference: string } = useParams()
  const router = useRouter()

  // User
  const [user, setUser] = React.useState<UserDetail | null>(null)
  const [isFetchingUser, setIsFetchingUser] = React.useState(false)
  const updateUserForm = useForm<UpdateUserFormInputs>({ mode: 'all' })

  // Role
  const [roles, setRoles] = React.useState<Role[]>([])
  const [isFetchingRoles, setIsFetchingRoles] = React.useState(false)

  // Quotas
  const [quotas, setQuotas] = React.useState<Quota[]>([])
  const [isFetchingQuotas, setIsFetchingQuotas] = React.useState(false)
  const updateQuotaForm = useForm<UpdateQuotaFormInputs>({ mode: 'all' })

  const fetchUser = React.useCallback(async () => {
    setIsFetchingUser(true)
    await choreMasterAPIAgent.get(`/v1/admin/users/${user_reference}`, {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch user now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: { data: UserDetail }) => {
        setUser(data)
        updateUserForm.reset({
          name: data.name,
          username: data.username,
        })
      },
    })
    setIsFetchingUser(false)
  }, [user_reference])

  const fetchRoles = React.useCallback(async () => {
    setIsFetchingRoles(true)
    await choreMasterAPIAgent.get('/v1/identity/roles', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch roles now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: { data: Role[] }) => {
        setRoles(data)
      },
    })
    setIsFetchingRoles(false)
  }, [])

  const fetchQuotas = React.useCallback(async () => {
    setIsFetchingQuotas(true)
    await choreMasterAPIAgent.get(`/v1/admin/users/${user_reference}/quotas`, {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch quotas now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: { data: Quota[] }) => {
        setQuotas(data)
        if (data.length > 0) {
          updateQuotaForm.reset({
            used: data[0].used,
            limit: data[0].limit,
          })
        }
      },
    })
    setIsFetchingQuotas(false)
  }, [user_reference])

  const recalculateQuotas = React.useCallback(async () => {
    await choreMasterAPIAgent.patch(
      `/v1/admin/users/${user_reference}/quotas/recalculate`,
      {},
      {
        onError: () => {
          enqueueNotification(`Unable to recalculate quotas now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchQuotas()
        },
      }
    )
  }, [user_reference])

  const handleSubmitUpdateQuotaForm: SubmitHandler<
    UpdateQuotaFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/admin/quotas/${quotas[0].reference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update quota now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchQuotas()
        },
      }
    )
  }

  const handleSubmitUpdateUserForm: SubmitHandler<
    UpdateUserFormInputs
  > = async ({ password, ...data }) => {
    await choreMasterAPIAgent.patch(
      `/v1/admin/users/${user_reference}`,
      {
        password: !!password ? password : undefined,
        ...data,
      },
      {
        onError: () => {
          enqueueNotification(`Unable to update user now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchUser()
        },
      }
    )
  }

  const deleteUser = React.useCallback(async (userReference: string) => {
    const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
    if (!isConfirmed) {
      return
    }
    await choreMasterAPIAgent.delete(`/v1/admin/users/${userReference}`, {
      onError: () => {
        enqueueNotification(`Unable to delete user now.`, 'error')
      },
      onFail: ({ message }: { message: string }) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: () => {
        router.push('/admin/users')
      },
    })
  }, [])

  const createUserRole = React.useCallback(
    async (userReference: string, roleReference: string) => {
      await choreMasterAPIAgent.post(
        `/v1/admin/user_roles`,
        {
          user_reference: userReference,
          role_reference: roleReference,
        },
        {
          onError: () => {
            enqueueNotification(`Unable to create user role now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchUser()
          },
        }
      )
    },
    []
  )

  const deleteUserRole = React.useCallback(
    async (userRoleReference: string) => {
      await choreMasterAPIAgent.delete(
        `/v1/admin/user_roles/${userRoleReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete user role now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchUser()
          },
        }
      )
    },
    []
  )

  // Effects

  React.useEffect(() => {
    fetchUser()
  }, [])

  React.useEffect(() => {
    fetchRoles()
  }, [])

  React.useEffect(() => {
    if (tab.value === 'quotas') {
      fetchQuotas()
    }
  }, [tab.value])

  return (
    <TabContext value={tab.value}>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/admin/users"
          >
            使用者
          </MuiLink>
          {user && (
            <ReferenceBlock label={user.reference} primaryKey monospace />
          )}
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          title={user?.name}
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={() => {
                    fetchUser()
                    fetchRoles()
                    fetchQuotas()
                  }}
                  disabled={
                    isFetchingUser || isFetchingRoles || isFetchingQuotas
                  }
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
      </ModuleFunction>

      <ModuleContainer stickyTop>
        <ModuleFunction sx={{ p: 0, px: 3 }}>
          <Box sx={{ mx: 2, mt: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              variant="scrollable"
              scrollButtons={false}
              onChange={(event: React.SyntheticEvent, newValue: string) => {
                tab.setValue(newValue)
              }}
            >
              <Tab label="總覽" value="overview" />
              <Tab label="設定" value="settings" />
              <Tab label="配額" value="quotas" />
            </TabList>
          </Box>
        </ModuleFunction>
      </ModuleContainer>

      <TabPanel value="overview" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionBody loading={isFetchingUser || isFetchingRoles}>
            <List>
              <ListSubheader>名字</ListSubheader>
              <ListItem>
                <ListItemText primary={user?.name} />
              </ListItem>
              <ListSubheader>使用者名稱</ListSubheader>
              <ListItem>
                <ListItemText primary={user?.username} />
              </ListItem>
              <ListSubheader>角色</ListSubheader>
              <ListItem>
                {user?.user_roles.length === 0 ? (
                  <PlaceholderTypography>無</PlaceholderTypography>
                ) : (
                  <Stack
                    direction="row"
                    sx={{
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    {user?.user_roles.map((userRole) => (
                      <Box key={userRole.reference} sx={{ pr: 1, pb: 1 }}>
                        <ReferenceBlock
                          label={
                            roles.find(
                              (role) =>
                                role.reference === userRole.role_reference
                            )?.symbol
                          }
                          foreignValue
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </ListItem>
            </List>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="settings" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader title="基本資訊" />
          <ModuleFunctionBody loading={isFetchingUser}>
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
                  control={updateUserForm.control}
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
              <FormControl>
                <Controller
                  name="username"
                  control={updateUserForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      label="使用者名稱"
                      variant="filled"
                    />
                  )}
                  rules={{ required: '必填' }}
                />
              </FormControl>
              <FormControl>
                <Controller
                  name="password"
                  control={updateUserForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="密碼"
                      variant="filled"
                      helperText="留空則不變更"
                    />
                  )}
                />
              </FormControl>
              <AutoLoadingButton
                type="submit"
                variant="contained"
                disabled={
                  !updateUserForm.formState.isDirty ||
                  !updateUserForm.formState.isValid
                }
                onClick={updateUserForm.handleSubmit(
                  handleSubmitUpdateUserForm
                )}
              >
                儲存
              </AutoLoadingButton>
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>

        <ModuleFunction>
          <ModuleFunctionHeader title="角色" />
          <ModuleFunctionBody loading={isFetchingUser || isFetchingRoles}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <NoWrapTableCell align="right">
                      <PlaceholderTypography>#</PlaceholderTypography>
                    </NoWrapTableCell>
                    <NoWrapTableCell>角色代號</NoWrapTableCell>
                    <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                    <NoWrapTableCell align="right">操作</NoWrapTableCell>
                  </TableRow>
                </TableHead>
                <StatefulTableBody
                  isLoading={isFetchingUser || isFetchingRoles}
                  isEmpty={roles.length === 0}
                >
                  {roles.map((role, index) => {
                    const userRole = user?.user_roles.find(
                      (userRole) => userRole.role_reference === role.reference
                    )
                    return (
                      <TableRow key={role.reference} selected={!!userRole}>
                        <NoWrapTableCell align="right">
                          <PlaceholderTypography>
                            {index + 1}
                          </PlaceholderTypography>
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={role.symbol}
                            foreignValue={!!userRole}
                            disabled={!userRole}
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          {userRole ? (
                            <ReferenceBlock
                              label={userRole.reference}
                              primaryKey
                              monospace
                            />
                          ) : (
                            <PlaceholderTypography>N/A</PlaceholderTypography>
                          )}
                        </NoWrapTableCell>
                        <NoWrapTableCell align="right" padding="checkbox">
                          <Checkbox
                            size="small"
                            disabled={isFetchingUser || isFetchingRoles}
                            checked={!!userRole}
                            onChange={(event) => {
                              if (event.target.checked) {
                                createUserRole(user_reference, role.reference)
                              } else if (userRole) {
                                deleteUserRole(userRole.reference)
                              }
                            }}
                          />
                        </NoWrapTableCell>
                      </TableRow>
                    )
                  })}
                </StatefulTableBody>
              </Table>
            </TableContainer>
          </ModuleFunctionBody>
        </ModuleFunction>

        <ModuleFunction>
          <ModuleFunctionHeader title="進階" />
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
              <AutoLoadingButton
                variant="contained"
                color="error"
                onClick={async () => {
                  await deleteUser(user_reference)
                }}
              >
                刪除
              </AutoLoadingButton>
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="quotas" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader
            title="配額"
            actions={[
              <AutoLoadingButton
                key="recalculate"
                variant="contained"
                onClick={recalculateQuotas}
              >
                重新計算
              </AutoLoadingButton>,
            ]}
          />
          <ModuleFunctionBody loading={isFetchingQuotas}>
            <Stack spacing={2} sx={{ p: 2, flexGrow: 1 }}>
              {quotas.map((quota) => (
                <Stack
                  key={quota.reference}
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
                      name="used"
                      control={updateQuotaForm.control}
                      defaultValue={quota.used}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          label="已使用"
                          variant="filled"
                          type="number"
                        />
                      )}
                      rules={{ required: '必填' }}
                    />
                  </FormControl>
                  <FormControl>
                    <Controller
                      name="limit"
                      control={updateQuotaForm.control}
                      defaultValue={quota.limit}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          label="配額上限"
                          variant="filled"
                          type="number"
                        />
                      )}
                      rules={{ required: '必填' }}
                    />
                  </FormControl>
                  <Typography variant="body1">
                    {`使用率 ${(
                      ((updateQuotaForm.watch('used') || 0) /
                        (updateQuotaForm.watch('limit') || 0)) *
                      100
                    ).toFixed(2)}%`}
                  </Typography>
                  <LinearProgress
                    value={
                      ((updateQuotaForm.watch('used') || 0) /
                        (updateQuotaForm.watch('limit') || 0)) *
                      100
                    }
                    variant="determinate"
                    sx={{
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                  <AutoLoadingButton
                    type="submit"
                    variant="contained"
                    disabled={
                      !updateQuotaForm.formState.isDirty ||
                      !updateQuotaForm.formState.isValid
                    }
                    onClick={updateQuotaForm.handleSubmit(
                      handleSubmitUpdateQuotaForm
                    )}
                  >
                    儲存
                  </AutoLoadingButton>
                </Stack>
              ))}
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>
    </TabContext>
  )
}
