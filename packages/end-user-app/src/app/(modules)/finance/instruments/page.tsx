'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { financeInstrumentTypes } from '@/constants'
import type {
  Asset,
  CreateInstrumentFormInputs,
  Instrument,
  UpdateInstrumentFormInputs,
} from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
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
import { throttle } from 'lodash'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

const assetReferenceFieldNames = [
  'base_asset_reference',
  'quote_asset_reference',
  'settlement_asset_reference',
  'underlying_asset_reference',
  'staking_asset_reference',
  'yielding_asset_reference',
] as const

export default function Page() {
  const { enqueueNotification } = useNotification()

  // Instruments
  const [instruments, setInstruments] = React.useState<Instrument[]>([])
  const [isFetchingInstruments, setIsFetchingInstruments] =
    React.useState(false)
  const [isCreateInstrumentDrawerOpen, setIsCreateInstrumentDrawerOpen] =
    React.useState(false)
  const createInstrumentForm = useForm<CreateInstrumentFormInputs>()
  const [editingInstrumentReference, setEditingInstrumentReference] =
    React.useState<string>()
  const updateInstrumentForm = useForm<UpdateInstrumentFormInputs>()

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [assetInputValue, setAssetInputValue] = React.useState('')
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)
  const assetReferenceToAssetMap = React.useMemo(() => {
    return assets.reduce((acc: Record<string, Asset>, asset) => {
      acc[asset.reference] = asset
      return acc
    }, {})
  }, [assets])

  const fetchInstruments = React.useCallback(async () => {
    setIsFetchingInstruments(true)
    await choreMasterAPIAgent.get('/v1/finance/instruments', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch instruments now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setInstruments(data)
      },
    })
    setIsFetchingInstruments(false)
  }, [enqueueNotification])

  const fetchAssets = React.useCallback(
    async (search?: string) => {
      setIsFetchingAssets(true)
      await choreMasterAPIAgent.get('/v1/finance/assets', {
        params: { search },
        onError: () => {
          enqueueNotification(`Unable to fetch assets now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: any) => {
          setAssets((assets) => {
            const assetReferenceToAssetMap = assets.reduce(
              (acc: Record<string, Asset>, asset) => {
                acc[asset.reference] = asset
                return acc
              },
              {}
            )
            const newAssetReferenceToAssetMap = data.reduce(
              (acc: Record<string, Asset>, asset: Asset) => {
                if (!assetReferenceToAssetMap[asset.reference]) {
                  acc[asset.reference] = asset
                }
                return acc
              },
              {}
            )
            const newAssets = Object.values<Asset>(newAssetReferenceToAssetMap)
            return [...assets, ...newAssets]
          })
        },
      })
      setIsFetchingAssets(false)
    },
    [enqueueNotification]
  )

  const throttledFetchAssets = React.useMemo(
    () => throttle(fetchAssets, 300),
    []
  )

  const handleSubmitCreateInstrumentForm: SubmitHandler<
    CreateInstrumentFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/finance/instruments', data, {
      onError: () => {
        enqueueNotification(`Unable to create instrument now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: () => {
        createInstrumentForm.reset()
        setIsCreateInstrumentDrawerOpen(false)
        fetchInstruments()
      },
    })
  }

  const handleSubmitUpdateInstrumentForm: SubmitHandler<
    UpdateInstrumentFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/instruments/${editingInstrumentReference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update instrument now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          updateInstrumentForm.reset()
          setEditingInstrumentReference(undefined)
          fetchInstruments()
        },
      }
    )
  }

  const deleteInstrument = React.useCallback(
    async (instrumentReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/instruments/${instrumentReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete instrument now.`, 'error')
          },
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchInstruments()
          },
        }
      )
    },
    [enqueueNotification, fetchInstruments]
  )

  React.useEffect(() => {
    fetchInstruments()
  }, [fetchInstruments])

  React.useEffect(() => {
    if (assetInputValue.length > 0) {
      throttledFetchAssets(assetInputValue)
    }
  }, [assetInputValue])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="交易品種"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchInstruments}
                  disabled={isFetchingInstruments}
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
                createInstrumentForm.reset()
                setIsCreateInstrumentDrawerOpen(true)
              }}
            >
              新增
            </Button>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingInstruments}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell align="right">#</NoWrapTableCell>
                  <NoWrapTableCell>名稱</NoWrapTableCell>
                  <NoWrapTableCell>數量精度</NoWrapTableCell>
                  <NoWrapTableCell>價格精度</NoWrapTableCell>
                  <NoWrapTableCell>類型</NoWrapTableCell>
                  <NoWrapTableCell>基礎資產</NoWrapTableCell>
                  <NoWrapTableCell>報價資產</NoWrapTableCell>
                  <NoWrapTableCell>結算資產</NoWrapTableCell>
                  <NoWrapTableCell>標的資產</NoWrapTableCell>
                  <NoWrapTableCell>抵押資產</NoWrapTableCell>
                  <NoWrapTableCell>產出資產</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingInstruments}
                isEmpty={instruments.length === 0}
              >
                {instruments.map((instrument, index) => (
                  <TableRow key={instrument.reference} hover>
                    <NoWrapTableCell align="right">{index + 1}</NoWrapTableCell>
                    <NoWrapTableCell>{instrument.name}</NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.quantity_decimals}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.price_decimals}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {
                        financeInstrumentTypes.find(
                          (type) => type.value === instrument.instrument_type
                        )?.label
                      }
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.base_asset_reference}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.quote_asset_reference}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.settlement_asset_reference}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.underlying_asset_reference}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.staking_asset_reference}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.yielding_asset_reference}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip size="small" label={instrument.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateInstrumentForm.setValue('name', instrument.name)
                          updateInstrumentForm.setValue(
                            'quantity_decimals',
                            instrument.quantity_decimals
                          )
                          updateInstrumentForm.setValue(
                            'price_decimals',
                            instrument.price_decimals
                          )
                          updateInstrumentForm.setValue(
                            'instrument_type',
                            instrument.instrument_type
                          )
                          assetReferenceFieldNames.forEach((fieldName) => {
                            updateInstrumentForm.setValue(
                              fieldName,
                              instrument[fieldName]
                            )
                          })
                          setEditingInstrumentReference(instrument.reference)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteInstrument(instrument.reference)}
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
        open={isCreateInstrumentDrawerOpen}
        onClose={() => setIsCreateInstrumentDrawerOpen(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增交易品種" />
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
                control={createInstrumentForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名稱"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="quantity_decimals"
                control={createInstrumentForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="數量精度"
                    variant="filled"
                    type="number"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="price_decimals"
                control={createInstrumentForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="價格精度"
                    variant="filled"
                    type="number"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <Controller
              name="instrument_type"
              control={createInstrumentForm.control}
              defaultValue={financeInstrumentTypes[0].value}
              render={({ field }) => (
                <FormControl required fullWidth size="small" variant="filled">
                  <InputLabel>類型</InputLabel>
                  <Select
                    {...field}
                    onChange={(event, newValue) => {
                      field.onChange(newValue)
                      assetReferenceFieldNames.forEach((fieldName) => {
                        createInstrumentForm.setValue(fieldName, '')
                      })
                    }}
                  >
                    {financeInstrumentTypes.map((instrumentType) => (
                      <MenuItem
                        key={instrumentType.value}
                        value={instrumentType.value}
                      >
                        {instrumentType.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <FormControl fullWidth>
              <Controller
                name="base_asset_reference"
                control={createInstrumentForm.control}
                defaultValue=""
                render={({ field }) => {
                  const instrumentType =
                    createInstrumentForm.getValues('instrument_type')
                  return (
                    <Autocomplete
                      {...field}
                      value={
                        field.value
                          ? assetReferenceToAssetMap[field.value]
                          : null
                      }
                      onChange={(_event, value: Asset | null) => {
                        field.onChange(value?.reference ?? '')
                      }}
                      onInputChange={(event, newInputValue) => {
                        setAssetInputValue(newInputValue)
                      }}
                      onOpen={() => {
                        if (assets.length === 0) {
                          fetchAssets()
                        }
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.reference === value.reference
                      }
                      getOptionLabel={(option) => option.name}
                      filterOptions={(assets) => {
                        const lowerCaseAssetInputValue =
                          assetInputValue.toLowerCase()
                        return assets.filter(
                          (asset) =>
                            asset.name
                              .toLowerCase()
                              .includes(lowerCaseAssetInputValue) ||
                            asset.symbol
                              .toLowerCase()
                              .includes(lowerCaseAssetInputValue)
                        )
                      }}
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
                          label="基礎資產"
                          variant="filled"
                          size="small"
                          required={['FX'].includes(instrumentType)}
                        />
                      )}
                    />
                  )
                }}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              onClick={createInstrumentForm.handleSubmit(
                handleSubmitCreateInstrumentForm
              )}
            >
              新增
            </AutoLoadingButton>
          </Stack>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={editingInstrumentReference !== undefined}
        onClose={() => setEditingInstrumentReference(undefined)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="編輯交易品種" />
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
                control={updateInstrumentForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名稱"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="symbol"
                control={updateInstrumentForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="代號"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="decimals"
                control={updateInstrumentForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="精度"
                    variant="filled"
                    type="number"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="is_settleable"
                control={updateInstrumentForm.control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    label="可結算"
                    control={<Checkbox {...field} checked={field.value} />}
                  />
                )}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              onClick={updateInstrumentForm.handleSubmit(
                handleSubmitUpdateInstrumentForm
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
