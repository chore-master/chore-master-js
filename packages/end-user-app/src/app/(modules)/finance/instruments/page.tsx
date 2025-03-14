'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import {
  financeInstrumentAssetReferenceFields,
  financeInstrumentTypes,
} from '@/constants'
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
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import debounce from 'lodash/debounce'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()

  // Instruments
  const [instruments, setInstruments] = React.useState<Instrument[]>([])
  const [instrumentsCount, setInstrumentsCount] = React.useState(0)
  const [instrumentsPage, setInstrumentsPage] = React.useState(0)
  const [instrumentsRowsPerPage, setInstrumentsRowsPerPage] = React.useState(10)
  const [isFetchingInstruments, setIsFetchingInstruments] =
    React.useState(false)
  const [isCreateInstrumentDrawerOpen, setIsCreateInstrumentDrawerOpen] =
    React.useState(false)
  const createInstrumentForm = useForm<CreateInstrumentFormInputs>()
  const [editingInstrumentReference, setEditingInstrumentReference] =
    React.useState<string>()
  const updateInstrumentForm = useForm<UpdateInstrumentFormInputs>()
  const createInstrumentFormInstrumentType =
    createInstrumentForm.watch('instrument_type')

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
    await choreMasterAPIAgent.get('/v1/finance/users/me/instruments', {
      params: {
        offset: instrumentsPage * instrumentsRowsPerPage,
        limit: instrumentsRowsPerPage,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch instruments now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data, metadata }: any) => {
        setInstruments(data)
        setInstrumentsCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingInstruments(false)
  }, [instrumentsPage, instrumentsRowsPerPage])

  const fetchAssets = React.useCallback(
    async ({
      search,
      references,
    }: {
      search?: string
      references?: string[]
    }) => {
      setIsFetchingAssets(true)
      await choreMasterAPIAgent.get('/v1/finance/users/me/assets', {
        params: { search, references },
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

  const debouncedFetchAssets = React.useCallback(debounce(fetchAssets, 1500), [
    fetchAssets,
  ])

  const handleSubmitCreateInstrumentForm: SubmitHandler<
    CreateInstrumentFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/finance/users/me/instruments', data, {
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
      `/v1/finance/users/me/instruments/${editingInstrumentReference}`,
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
        `/v1/finance/users/me/instruments/${instrumentReference}`,
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
      debouncedFetchAssets({ search: assetInputValue })
    }
  }, [assetInputValue])

  React.useEffect(() => {
    const assetReferenceSet = instruments.reduce(
      (acc: Set<string>, instrument) => {
        financeInstrumentAssetReferenceFields.forEach(({ name }) => {
          if (instrument[name]) {
            acc.add(instrument[name])
          }
        })
        return acc
      },
      new Set<string>()
    )
    if (assetReferenceSet.size > 0) {
      fetchAssets({ references: Array.from(assetReferenceSet) })
    }
  }, [instruments])

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
                createInstrumentForm.setValue(
                  'instrument_type',
                  financeInstrumentTypes[0].value
                )
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
                  {financeInstrumentAssetReferenceFields.map(({ label }) => (
                    <NoWrapTableCell key={label}>{label}</NoWrapTableCell>
                  ))}
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingInstruments}
                isEmpty={instruments.length === 0}
              >
                {instruments.map((instrument, index) => (
                  <TableRow key={instrument.reference} hover>
                    <NoWrapTableCell align="right">
                      <PlaceholderTypography>
                        {instrumentsPage * instrumentsRowsPerPage + index + 1}
                      </PlaceholderTypography>
                    </NoWrapTableCell>
                    <NoWrapTableCell>{instrument.name}</NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.quantity_decimals}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {instrument.price_decimals}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <ReferenceBlock
                        label={
                          financeInstrumentTypes.find(
                            (type) => type.value === instrument.instrument_type
                          )?.label
                        }
                        foreignValue
                      />
                    </NoWrapTableCell>
                    {financeInstrumentAssetReferenceFields.map(({ name }) => (
                      <NoWrapTableCell key={name}>
                        {instrument[name] ? (
                          <ReferenceBlock
                            label={
                              assetReferenceToAssetMap[instrument[name]]?.name
                            }
                            foreignValue
                          />
                        ) : (
                          <PlaceholderTypography>N/A</PlaceholderTypography>
                        )}
                      </NoWrapTableCell>
                    ))}
                    <NoWrapTableCell>
                      <ReferenceBlock
                        label={instrument.reference}
                        primaryKey
                        monospace
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateInstrumentForm.setValue('name', instrument.name)
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
          <TablePagination
            count={instrumentsCount}
            page={instrumentsPage}
            rowsPerPage={instrumentsRowsPerPage}
            setPage={setInstrumentsPage}
            setRowsPerPage={setInstrumentsRowsPerPage}
            rowsPerPageOptions={[10, 20]}
          />
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
                    helperText="建立後無法變更"
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
                    helperText="建立後無法變更"
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
                    onChange={(event: SelectChangeEvent) => {
                      field.onChange(event.target.value)
                      financeInstrumentAssetReferenceFields.forEach(
                        ({ name }) => {
                          createInstrumentForm.setValue(name, '')
                        }
                      )
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
                  <FormHelperText>建立後無法變更</FormHelperText>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            {financeInstrumentAssetReferenceFields
              .filter((assetReferenceField) =>
                (
                  assetReferenceField.requiredByInstrumentTypes as unknown as string[]
                ).includes(createInstrumentFormInstrumentType)
              )
              .map((assetReferenceField) => (
                <FormControl fullWidth key={assetReferenceField.name}>
                  <Controller
                    name={assetReferenceField.name}
                    control={createInstrumentForm.control}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={
                          field.value
                            ? assetReferenceToAssetMap[field.value]
                            : null
                        }
                        onChange={(_event, value: Asset | null) => {
                          field.onChange(value?.reference ?? '')
                          setAssetInputValue('')
                        }}
                        onInputChange={(event, newInputValue) => {
                          setAssetInputValue(newInputValue)
                        }}
                        onOpen={() => {
                          if (
                            assetInputValue.length === 0 &&
                            assets.length === 0
                          ) {
                            fetchAssets({ search: assetInputValue })
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
                              <ReferenceBlock
                                label={option.name}
                                foreignValue
                              />
                            </Box>
                          )
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={assetReferenceField.label}
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
              ))}
            <AutoLoadingButton
              type="submit"
              variant="contained"
              disabled={!createInstrumentForm.formState.isValid}
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
            <AutoLoadingButton
              type="submit"
              variant="contained"
              disabled={!updateInstrumentForm.formState.isValid}
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
