'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import SidePanel, { useSidePanel } from '@/components/SidePanel'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import WithRef from '@/components/WithRef'
import { useOffsetPagination } from '@/hooks/useOffsetPagination'
import type {
  Asset,
  AutoFillPriceFormInputs,
  CreatePriceFormInputs,
  Price,
  UpdatePriceFormInputs,
} from '@/types/finance'
import { Operator } from '@/types/integration'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { validateDatetimeField } from '@/utils/validation'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
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
import Typography from '@mui/material/Typography'
import { debounce } from 'lodash'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()
  const sidePanel = useSidePanel()

  // Assets
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [assetInputValue, setAssetInputValue] = React.useState('')
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)
  const assetReferenceToAssetMap = React.useMemo(() => {
    return assets.reduce((acc: Record<string, Asset>, asset) => {
      acc[asset.reference] = asset
      return acc
    }, {})
  }, [assets])

  // Feed operator
  const autoFillPriceForm = useForm<AutoFillPriceFormInputs>()
  const [feedOperators, setFeedOperators] = React.useState<Operator[]>([])
  const [isFetchingFeedOperators, setIsFetchingFeedOperators] =
    React.useState(false)

  // Price
  const [prices, setPrices] = React.useState<Price[]>([])
  const pricesPagination = useOffsetPagination({})
  const [isFetchingPrices, setIsFetchingPrices] = React.useState(false)
  const createPriceForm = useForm<CreatePriceFormInputs>()
  const [editingPriceReference, setEditingPriceReference] =
    React.useState<string>()
  const updatePriceForm = useForm<UpdatePriceFormInputs>()

  // Assets

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

  // Auto fill

  const fetchFeedOperators = React.useCallback(async () => {
    setIsFetchingFeedOperators(true)
    await choreMasterAPIAgent.get('/v1/integration/users/me/operators', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch feed operators now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setFeedOperators(data)
      },
    })
    setIsFetchingFeedOperators(false)
  }, [enqueueNotification])

  const handleSubmitAutoFillPriceForm: SubmitHandler<
    AutoFillPriceFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/users/me/prices/auto-fill`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to auto fill price now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          sidePanel.close()
          fetchPrices()
        },
      }
    )
  }

  React.useEffect(() => {
    const values = autoFillPriceForm.getValues()
    if (feedOperators.length > 0 && !values.operator_reference) {
      autoFillPriceForm.setValue(
        'operator_reference',
        feedOperators[0]?.reference || '',
        { shouldValidate: true }
      )
    }
  }, [feedOperators])

  // Price

  const fetchPrices = React.useCallback(async () => {
    setIsFetchingPrices(true)
    await choreMasterAPIAgent.get('/v1/finance/users/me/prices', {
      params: {
        offset: pricesPagination.offset,
        limit: pricesPagination.rowsPerPage,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch prices now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({
        data,
        metadata,
      }: {
        data: Price[]
        metadata: any
      }) => {
        setPrices(data)
        pricesPagination.setCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingPrices(false)
  }, [pricesPagination.offset, pricesPagination.rowsPerPage])

  const handleSubmitCreatePriceForm: SubmitHandler<
    CreatePriceFormInputs
  > = async ({ confirmed_time, ...data }) => {
    await choreMasterAPIAgent.post(
      '/v1/finance/users/me/prices',
      {
        ...data,
        confirmed_time: new Date(
          timezone.getUTCTimestamp(confirmed_time)
        ).toISOString(),
      },
      {
        onError: () => {
          enqueueNotification(`Unable to create price now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          sidePanel.close()
          createPriceForm.reset()
          fetchPrices()
        },
      }
    )
  }

  const handleSubmitUpdatePriceForm: SubmitHandler<
    UpdatePriceFormInputs
  > = async ({ confirmed_time, ...data }) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/users/me/prices/${editingPriceReference}`,
      {
        ...data,
        confirmed_time: new Date(
          timezone.getUTCTimestamp(confirmed_time)
        ).toISOString(),
      },
      {
        onError: () => {
          enqueueNotification(`Unable to update price now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          sidePanel.close()
          updatePriceForm.reset()
          setEditingPriceReference(undefined)
          fetchPrices()
        },
      }
    )
  }

  const deletePrice = React.useCallback(
    async (priceReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/users/me/prices/${priceReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete price now.`, 'error')
          },
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchPrices()
          },
        }
      )
    },
    [enqueueNotification, fetchPrices]
  )

  // Effects

  React.useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  React.useEffect(() => {
    if (assetInputValue.length > 0) {
      debouncedFetchAssets({ search: assetInputValue })
    }
  }, [assetInputValue])

  React.useEffect(() => {
    const assetReferenceSet = prices.reduce((acc: Set<string>, price) => {
      acc.add(price.base_asset_reference)
      acc.add(price.quote_asset_reference)
      return acc
    }, new Set<string>())
    if (assetReferenceSet.size > 0) {
      fetchAssets({ references: Array.from(assetReferenceSet) })
    }
  }, [prices])

  return (
    <ModuleFunction>
      <ModuleFunctionHeader
        title="價格"
        actions={[
          <Tooltip key="refresh" title="立即重整">
            <span>
              <IconButton onClick={fetchPrices} disabled={isFetchingPrices}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>,
          // <Button
          //   key="refill"
          //   component={Link}
          //   href="/finance/market/prices/refill"
          // >
          //   批次回補
          // </Button>,
          <AutoLoadingButton
            key="refill"
            onClick={async () => {
              await fetchFeedOperators()
              sidePanel.open('refillPrice')
            }}
          >
            回補精靈
          </AutoLoadingButton>,
          <Button
            key="create"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              createPriceForm.reset()
              sidePanel.open('createPrice')
            }}
          >
            新增
          </Button>,
        ]}
      />
      <ModuleFunctionBody loading={isFetchingPrices}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <NoWrapTableCell align="right">
                  <PlaceholderTypography>#</PlaceholderTypography>
                </NoWrapTableCell>
                <NoWrapTableCell>外幣資產</NoWrapTableCell>
                <NoWrapTableCell>本幣資產</NoWrapTableCell>
                <NoWrapTableCell>價格</NoWrapTableCell>
                <NoWrapTableCell>收定時間</NoWrapTableCell>
                <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                <NoWrapTableCell align="right">操作</NoWrapTableCell>
              </TableRow>
            </TableHead>
            <StatefulTableBody
              isLoading={isFetchingPrices}
              isEmpty={prices.length === 0}
            >
              {prices.map((price, index) => (
                <TableRow key={price.reference} hover>
                  <NoWrapTableCell align="right">
                    <PlaceholderTypography>
                      {pricesPagination.offset + index + 1}
                    </PlaceholderTypography>
                  </NoWrapTableCell>
                  <NoWrapTableCell>
                    <ReferenceBlock
                      label={
                        assetReferenceToAssetMap[price.base_asset_reference]
                          ?.name
                      }
                      foreignValue
                    />
                  </NoWrapTableCell>
                  <NoWrapTableCell>
                    <ReferenceBlock
                      label={
                        assetReferenceToAssetMap[price.quote_asset_reference]
                          ?.name
                      }
                      foreignValue
                    />
                  </NoWrapTableCell>
                  <NoWrapTableCell>{price.value}</NoWrapTableCell>
                  <NoWrapTableCell>
                    <DatetimeBlock isoText={price.confirmed_time} />
                  </NoWrapTableCell>
                  <NoWrapTableCell>
                    <ReferenceBlock
                      label={price.reference}
                      primaryKey
                      monospace
                    />
                  </NoWrapTableCell>
                  <NoWrapTableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        updatePriceForm.setValue(
                          'base_asset_reference',
                          price.base_asset_reference
                        )
                        updatePriceForm.setValue(
                          'quote_asset_reference',
                          price.quote_asset_reference
                        )
                        updatePriceForm.setValue('value', price.value)
                        updatePriceForm.setValue(
                          'confirmed_time',
                          timezone
                            .getLocalString(price.confirmed_time)
                            .slice(0, -5)
                        )
                        setEditingPriceReference(price.reference)
                        sidePanel.open('editPrice')
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deletePrice(price.reference)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </NoWrapTableCell>
                </TableRow>
              ))}
            </StatefulTableBody>
          </Table>
        </TableContainer>
        <TablePagination offsetPagination={pricesPagination} />
      </ModuleFunctionBody>

      <SidePanel id="createPrice">
        <CardHeader
          title="新增價格"
          action={
            <IconButton onClick={() => sidePanel.close()}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Stack
          component="form"
          spacing={3}
          p={2}
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <FormControl fullWidth>
            <Controller
              name="base_asset_reference"
              control={createPriceForm.control}
              defaultValue=""
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={
                    field.value ? assetReferenceToAssetMap[field.value] : null
                  }
                  onChange={(_event, value: Asset | null) => {
                    field.onChange(value?.reference ?? '')
                    setAssetInputValue('')
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== 'reset') {
                      setAssetInputValue(newInputValue)
                    }
                  }}
                  onOpen={() => {
                    if (assetInputValue.length === 0 && assets.length === 0) {
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
                        <ReferenceBlock label={option.name} foreignValue />
                      </Box>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="外幣資產"
                      variant="filled"
                      required
                    />
                  )}
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="quote_asset_reference"
              control={createPriceForm.control}
              defaultValue=""
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={
                    field.value ? assetReferenceToAssetMap[field.value] : null
                  }
                  onChange={(_event, value: Asset | null) => {
                    field.onChange(value?.reference ?? '')
                    setAssetInputValue('')
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== 'reset') {
                      setAssetInputValue(newInputValue)
                    }
                  }}
                  onOpen={() => {
                    if (assetInputValue.length === 0 && assets.length === 0) {
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
                        <ReferenceBlock label={option.name} foreignValue />
                      </Box>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="本幣資產"
                      variant="filled"
                      required
                    />
                  )}
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl>
            <Controller
              name="value"
              control={createPriceForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="價格"
                  variant="filled"
                  type="number"
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl>
            <WithRef
              render={(inputRef) => (
                <Controller
                  name="confirmed_time"
                  control={createPriceForm.control}
                  defaultValue={timezone
                    .getLocalDate(new Date())
                    .toISOString()
                    .slice(0, -5)}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      inputRef={inputRef}
                      required
                      label="收定時間"
                      variant="filled"
                      type="datetime-local"
                      slotProps={{
                        htmlInput: {
                          step: 1,
                        },
                      }}
                      error={!!createPriceForm.formState.errors.confirmed_time}
                      helperText={
                        createPriceForm.formState.errors.confirmed_time?.message
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
          <AutoLoadingButton
            type="submit"
            variant="contained"
            disabled={!createPriceForm.formState.isValid}
            onClick={createPriceForm.handleSubmit(handleSubmitCreatePriceForm)}
          >
            新增
          </AutoLoadingButton>
        </Stack>
      </SidePanel>

      <SidePanel id="editPrice">
        <CardHeader
          title="編輯價格"
          action={
            <IconButton
              onClick={() => {
                sidePanel.close()
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Stack
          component="form"
          spacing={3}
          p={2}
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <FormControl fullWidth>
            <Controller
              name="base_asset_reference"
              control={updatePriceForm.control}
              defaultValue=""
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={
                    field.value ? assetReferenceToAssetMap[field.value] : null
                  }
                  onChange={(_event, value: Asset | null) => {
                    field.onChange(value?.reference ?? '')
                    setAssetInputValue('')
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== 'reset') {
                      setAssetInputValue(newInputValue)
                    }
                  }}
                  onOpen={() => {
                    if (assetInputValue.length === 0 && assets.length === 0) {
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
                        <ReferenceBlock label={option.name} foreignValue />
                      </Box>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="外幣資產"
                      variant="filled"
                      required
                    />
                  )}
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              name="quote_asset_reference"
              control={updatePriceForm.control}
              defaultValue=""
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={
                    field.value ? assetReferenceToAssetMap[field.value] : null
                  }
                  onChange={(_event, value: Asset | null) => {
                    field.onChange(value?.reference ?? '')
                    setAssetInputValue('')
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason !== 'reset') {
                      setAssetInputValue(newInputValue)
                    }
                  }}
                  onOpen={() => {
                    if (assetInputValue.length === 0 && assets.length === 0) {
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
                        <ReferenceBlock label={option.name} foreignValue />
                      </Box>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="本幣資產"
                      variant="filled"
                      required
                    />
                  )}
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl>
            <Controller
              name="value"
              control={updatePriceForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="價格"
                  variant="filled"
                  type="number"
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl>
            <WithRef
              render={(inputRef) => (
                <Controller
                  name="confirmed_time"
                  control={updatePriceForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      inputRef={inputRef}
                      required
                      label="收定時間"
                      variant="filled"
                      type="datetime-local"
                      slotProps={{
                        htmlInput: {
                          step: 1,
                        },
                      }}
                      error={!!createPriceForm.formState.errors.confirmed_time}
                      helperText={
                        createPriceForm.formState.errors.confirmed_time?.message
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
          <AutoLoadingButton
            type="submit"
            variant="contained"
            disabled={!updatePriceForm.formState.isValid}
            onClick={updatePriceForm.handleSubmit(handleSubmitUpdatePriceForm)}
          >
            儲存
          </AutoLoadingButton>
        </Stack>
      </SidePanel>

      <SidePanel id="refillPrice">
        <CardHeader
          title="回補精靈"
          action={
            <IconButton
              onClick={() => {
                sidePanel.close()
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Stack
          component="form"
          spacing={3}
          p={2}
          useFlexGap
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Stack spacing={1} direction="row" alignItems="center">
                <InfoOutlinedIcon fontSize="small" />
                <Typography>說明</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                回補精靈根據您在 Chore Master
                所使用到的時間戳、貨幣對，以及整合的價格來源，自動撈取最高精確至每日的歷史價格。視
                Chore Master
                及價格來源伺服器系統負載情況，本功能不一定隨時可用，請使用者見諒。
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Controller
            name="operator_reference"
            control={autoFillPriceForm.control}
            defaultValue=""
            render={({ field }) => (
              <FormControl required variant="standard">
                <InputLabel>價格來源</InputLabel>
                <Select
                  {...field}
                  onChange={(event: SelectChangeEvent) => {
                    const value = event.target.value
                    field.onChange(value)
                  }}
                  autoWidth
                >
                  {feedOperators.map((operator) => (
                    <MenuItem
                      key={operator.reference}
                      value={operator.reference}
                    >
                      {operator.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            rules={{ required: '必填' }}
          />
          <AutoLoadingButton
            type="submit"
            variant="contained"
            disabled={!autoFillPriceForm.formState.isValid}
            onClick={autoFillPriceForm.handleSubmit(
              handleSubmitAutoFillPriceForm
            )}
          >
            回補
          </AutoLoadingButton>
        </Stack>
      </SidePanel>
    </ModuleFunction>
  )
}
