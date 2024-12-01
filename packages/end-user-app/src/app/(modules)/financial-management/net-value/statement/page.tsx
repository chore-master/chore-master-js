'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
import choreMasterAPIAgent from '@/utils/apiAgent'
import {
  dateToLocalString,
  humanReadableLocalDateTime,
  humanReadableRelativeDateTime,
  localStringToUTCString,
  UTCStringToDate,
} from '@/utils/datetime'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import LoadingButton from '@mui/lab/LoadingButton'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
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

interface Asset {
  reference: string
  symbol: string
}

interface NetValue {
  reference: string
  account_reference: string
  settlement_asset_reference: string
  amount: number
  settled_time: string
  account: Account
  settlement_asset: Asset
}

type CreateNetValueFormInputs = {
  account_reference: string
  settlement_asset_reference: string
  amount: number
  settled_time: string
  shouldCreateAnother: boolean
}

type UpdateNetValueFormInputs = {
  account_reference: string
  settlement_asset_reference: string
  amount: number
  settled_time: string
}

export default function Page() {
  const { enqueueNotification } = useNotification()

  // Asset
  const [netValues, setNetValues] = React.useState<NetValue[]>([])
  const [isFetchingNetValues, setIsFetchingNetValues] = React.useState(false)
  const [isCreateNetValueDrawerOpen, setIsCreateNetValueDrawerOpen] =
    React.useState(false)
  const createNetValueForm = useForm<CreateNetValueFormInputs>()
  const [editingNetValueReference, setEditingNetValueReference] =
    React.useState<string>()
  const updateNetValueForm = useForm<UpdateNetValueFormInputs>()

  // Account
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isFetchingAccounts, setIsFetchingAccounts] = React.useState(false)
  const accountReferenceToAccountMap = React.useMemo(() => {
    return accounts.reduce((acc: Record<string, Account>, account) => {
      acc[account.reference] = account
      return acc
    }, {})
  }, [accounts])

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)
  const assetReferenceToAssetMap = React.useMemo(() => {
    return assets.reduce((acc: Record<string, Asset>, asset) => {
      acc[asset.reference] = asset
      return acc
    }, {})
  }, [assets])

  const fetchNetValues = React.useCallback(async () => {
    setIsFetchingNetValues(true)
    await choreMasterAPIAgent.get('/v1/financial_management/net_values', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setNetValues(data)
      },
    })
    setIsFetchingNetValues(false)
  }, [enqueueNotification])

  const handleSubmitCreateNetValueForm: SubmitHandler<
    CreateNetValueFormInputs
  > = async ({ shouldCreateAnother, settled_time, ...data }) => {
    await choreMasterAPIAgent.post(
      '/v1/financial_management/net_values',
      { ...data, settled_time: localStringToUTCString(settled_time) },
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          if (shouldCreateAnother) {
            createNetValueForm.reset()
            createNetValueForm.setValue(
              'settlement_asset_reference',
              data.settlement_asset_reference
            )
            createNetValueForm.setValue('settled_time', settled_time)
            createNetValueForm.setValue(
              'shouldCreateAnother',
              shouldCreateAnother
            )
          } else {
            setIsCreateNetValueDrawerOpen(false)
            fetchNetValues()
          }
        },
      }
    )
  }

  const handleSubmitUpdateNetValueForm: SubmitHandler<
    UpdateNetValueFormInputs
  > = async ({ settled_time, ...data }) => {
    await choreMasterAPIAgent.patch(
      `/v1/financial_management/net_values/${editingNetValueReference}`,
      { ...data, settled_time: localStringToUTCString(settled_time) },
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          updateNetValueForm.reset()
          setEditingNetValueReference(undefined)
          fetchNetValues()
        },
      }
    )
  }

  const deleteNetValue = React.useCallback(
    async (netValueReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/financial_management/net_values/${netValueReference}`,
        {
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchNetValues()
          },
        }
      )
    },
    [enqueueNotification, fetchNetValues]
  )

  const fetchAccounts = React.useCallback(async () => {
    setIsFetchingAccounts(true)
    await choreMasterAPIAgent.get('/v1/financial_management/accounts', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setAccounts(data)
      },
    })
    setIsFetchingAccounts(false)
  }, [enqueueNotification])

  const fetchAssets = React.useCallback(async () => {
    setIsFetchingAssets(true)
    await choreMasterAPIAgent.get('/v1/financial_management/assets', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setAssets(data)
      },
    })
    setIsFetchingAssets(false)
  }, [enqueueNotification])

  React.useEffect(() => {
    fetchNetValues()
  }, [fetchNetValues])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="權益快照明細"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchNetValues}
                  disabled={isFetchingNetValues}
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
                createNetValueForm.reset()
                setIsCreateNetValueDrawerOpen(true)
              }}
            >
              新增
            </Button>,
          ]}
        />

        <ModuleFunctionBody loading={isFetchingNetValues}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell>帳戶名稱</NoWrapTableCell>
                  <NoWrapTableCell>快照名義價值</NoWrapTableCell>
                  <NoWrapTableCell>快照資產代號</NoWrapTableCell>
                  <NoWrapTableCell>快照時間（瀏覽器時區）</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {netValues.map((netValue) => {
                  const baseDateTime = new Date()
                  return (
                    <TableRow key={netValue.reference}>
                      <NoWrapTableCell>
                        <Chip size="small" label={netValue.reference} />
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        <Chip
                          size="small"
                          label={netValue.account.name}
                          color="info"
                        />
                      </NoWrapTableCell>
                      <NoWrapTableCell>{netValue.amount}</NoWrapTableCell>
                      <NoWrapTableCell>
                        <Chip
                          size="small"
                          label={netValue.settlement_asset.symbol}
                          color="info"
                        />
                      </NoWrapTableCell>
                      <NoWrapTableCell>
                        {humanReadableLocalDateTime(netValue.settled_time)}
                        {` (${humanReadableRelativeDateTime(
                          netValue.settled_time,
                          baseDateTime
                        )})`}
                      </NoWrapTableCell>
                      <NoWrapTableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => {
                            updateNetValueForm.setValue(
                              'account_reference',
                              netValue.account_reference
                            )
                            updateNetValueForm.setValue(
                              'settlement_asset_reference',
                              netValue.settlement_asset_reference
                            )
                            updateNetValueForm.setValue(
                              'amount',
                              netValue.amount
                            )
                            updateNetValueForm.setValue(
                              'settled_time',
                              dateToLocalString(
                                UTCStringToDate(netValue.settled_time)
                              )
                            )
                            setEditingNetValueReference(netValue.reference)
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteNetValue(netValue.reference)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </NoWrapTableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
        anchor="right"
        open={isCreateNetValueDrawerOpen}
        onClose={() => setIsCreateNetValueDrawerOpen(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增權益快照" />
          <Stack component="form" spacing={3} p={2} autoComplete="off">
            <FormControl>
              <Controller
                name="account_reference"
                control={createNetValueForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={accountReferenceToAccountMap[field.value]}
                    onChange={(_event, value) => {
                      if (value) {
                        field.onChange(value.reference)
                      }
                    }}
                    onOpen={() => {
                      if (accounts.length === 0) {
                        fetchAccounts()
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.reference === value.reference
                    }
                    getOptionLabel={(option) => option.name}
                    options={accounts}
                    autoHighlight
                    loading={isFetchingAccounts}
                    loadingText="載入中..."
                    noOptionsText="沒有匹配的選項"
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          <Chip size="small" label={option.name} color="info" />
                        </Box>
                      )
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="帳戶名稱"
                        variant="filled"
                      />
                    )}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="amount"
                control={createNetValueForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="快照名義價值"
                    variant="filled"
                    type="number"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="settlement_asset_reference"
                control={createNetValueForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={assetReferenceToAssetMap[field.value]}
                    onChange={(_event, value) => {
                      if (value) {
                        field.onChange(value.reference)
                      }
                    }}
                    onOpen={() => {
                      if (assets.length === 0) {
                        fetchAssets()
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.reference === value.reference
                    }
                    getOptionLabel={(option) => option.symbol}
                    options={assets}
                    autoHighlight
                    loading={isFetchingAssets}
                    loadingText="載入中..."
                    noOptionsText="沒有匹配的選項"
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          <Chip
                            size="small"
                            label={option.symbol}
                            color="info"
                          />
                        </Box>
                      )
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="快照資產代號"
                        variant="filled"
                      />
                    )}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="settled_time"
                control={createNetValueForm.control}
                defaultValue={new Date().toISOString().slice(0, -5)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="快照時間（瀏覽器時區）"
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
                name="shouldCreateAnother"
                control={createNetValueForm.control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label="繼續新增另一筆"
                    control={<Checkbox {...field} />}
                  />
                )}
              />
            </FormControl>
            <LoadingButton
              variant="contained"
              onClick={createNetValueForm.handleSubmit(
                handleSubmitCreateNetValueForm
              )}
              loading={createNetValueForm.formState.isSubmitting}
            >
              新增
            </LoadingButton>
          </Stack>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={editingNetValueReference !== undefined}
        onClose={() => setEditingNetValueReference(undefined)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="編輯權益快照" />
          <Stack component="form" spacing={3} p={2} autoComplete="off">
            <FormControl>
              <Controller
                name="account_reference"
                control={updateNetValueForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={accountReferenceToAccountMap[field.value]}
                    onChange={(_event, value) => {
                      if (value) {
                        field.onChange(value.reference)
                      }
                    }}
                    onOpen={() => {
                      if (accounts.length === 0) {
                        fetchAccounts()
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.reference === value.reference
                    }
                    getOptionLabel={(option) => option.name}
                    options={accounts}
                    autoHighlight
                    loading={isFetchingAccounts}
                    loadingText="載入中..."
                    noOptionsText="沒有匹配的選項"
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          <Chip size="small" label={option.name} color="info" />
                        </Box>
                      )
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="帳戶名稱"
                        variant="filled"
                      />
                    )}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="amount"
                control={updateNetValueForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="快照名義價值"
                    variant="filled"
                    type="number"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="settlement_asset_reference"
                control={updateNetValueForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={assetReferenceToAssetMap[field.value]}
                    onChange={(_event, value) => {
                      if (value) {
                        field.onChange(value.reference)
                      }
                    }}
                    onOpen={() => {
                      if (assets.length === 0) {
                        fetchAssets()
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.reference === value.reference
                    }
                    getOptionLabel={(option) => option.symbol}
                    options={assets}
                    autoHighlight
                    loading={isFetchingAssets}
                    loadingText="載入中..."
                    noOptionsText="沒有匹配的選項"
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          <Chip
                            size="small"
                            label={option.symbol}
                            color="info"
                          />
                        </Box>
                      )
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="快照資產代號"
                        variant="filled"
                      />
                    )}
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="settled_time"
                control={updateNetValueForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="快照時間（瀏覽器時區）"
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
            <LoadingButton
              variant="contained"
              onClick={updateNetValueForm.handleSubmit(
                handleSubmitUpdateNetValueForm
              )}
              loading={updateNetValueForm.formState.isSubmitting}
            >
              儲存
            </LoadingButton>
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
