'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import DatetimeBlock from '@/components/DatetimeBlock'
import ModuleFunction, {
  ModuleContainer,
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useTimezone } from '@/components/timezone'
import WithRef from '@/components/WithRef'
import {
  financeLedgerEntryEntryTypes,
  financeLedgerEntrySourceTypes,
} from '@/constants'
import {
  Asset,
  CreateLedgerEntryFormInputs,
  Instrument,
  LedgerEntry,
  Portfolio,
  UpdateLedgerEntryFormInputs,
  UpdatePortfolioFormInputs,
} from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { validateDatetimeField } from '@/utils/validation'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button/Button'
import CardHeader from '@mui/material/CardHeader'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MuiLink from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { Decimal } from 'decimal.js'
import { debounce } from 'lodash'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const [tabValue, setTabValue] = React.useState<string>('overview')
  const { enqueueNotification } = useNotification()
  const { portfolio_reference }: { portfolio_reference: string } = useParams()
  const router = useRouter()
  const timezone = useTimezone()

  // Portfolio
  const [portfolio, setPortfolio] = React.useState<Portfolio | null>(null)
  const [isFetchingPortfolio, setIsFetchingPortfolio] = React.useState(false)
  const updatePortfolioForm = useForm<UpdatePortfolioFormInputs>({
    mode: 'all',
  })

  // Ledger Entries
  const [ledgerEntries, setLedgerEntries] = React.useState<LedgerEntry[]>([])
  const [ledgerEntriesCount, setLedgerEntriesCount] = React.useState(0)
  const [ledgerEntriesPage, setLedgerEntriesPage] = React.useState(0)
  const [ledgerEntriesRowsPerPage, setLedgerEntriesRowsPerPage] =
    React.useState(10)
  const [isFetchingLedgerEntries, setIsFetchingLedgerEntries] =
    React.useState(false)
  const createLedgerEntryForm = useForm<CreateLedgerEntryFormInputs>({
    mode: 'all',
  })
  const [isCreateLedgerEntryDrawerOpen, setIsCreateLedgerEntryDrawerOpen] =
    React.useState(false)
  const [editingLedgerEntryReference, setEditingLedgerEntryReference] =
    React.useState<string | null>(null)
  const updateLedgerEntryForm = useForm<UpdateLedgerEntryFormInputs>({
    mode: 'all',
  })

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

  // Instruments
  const [instruments, setInstruments] = React.useState<Instrument[]>([])
  const [instrumentInputValue, setInstrumentInputValue] = React.useState('')
  const [isFetchingInstruments, setIsFetchingInstruments] =
    React.useState(false)
  const instrumentReferenceToInstrumentMap = React.useMemo(() => {
    return instruments.reduce((acc: Record<string, Instrument>, instrument) => {
      acc[instrument.reference] = instrument
      return acc
    }, {})
  }, [instruments])

  // Portfolio

  const fetchPortfolio = React.useCallback(async () => {
    setIsFetchingPortfolio(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/portfolios/${portfolio_reference}`,
      {
        params: {},
        onError: () => {
          enqueueNotification(`Unable to fetch portfolio now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: { data: Portfolio }) => {
          setPortfolio(data)
          updatePortfolioForm.reset({
            name: data.name,
            description: data.description,
          })
        },
      }
    )
    setIsFetchingPortfolio(false)
  }, [portfolio_reference])

  const handleSubmitUpdatePortfolioForm: SubmitHandler<
    UpdatePortfolioFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/portfolios/${portfolio_reference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update portfolio now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchPortfolio()
        },
      }
    )
  }

  const deletePortfolio = React.useCallback(
    async (portfolioReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/portfolios/${portfolioReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete portfolio now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            router.push('/finance/portfolios')
          },
        }
      )
    },
    []
  )

  // Ledger Entries

  const fetchLedgerEntries = React.useCallback(async () => {
    setIsFetchingLedgerEntries(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/portfolios/${portfolio_reference}/ledger_entries`,
      {
        params: {
          page: ledgerEntriesPage,
          rows_per_page: ledgerEntriesRowsPerPage,
        },
        onError: () => {
          enqueueNotification(`Unable to fetch ledger entries now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: ({
          data,
          metadata,
        }: {
          data: LedgerEntry[]
          metadata: any
        }) => {
          setLedgerEntries(data)
          setLedgerEntriesCount(metadata.offset_pagination.count)
        },
      }
    )
    setIsFetchingLedgerEntries(false)
  }, [])

  const handleSubmitCreateLedgerEntryForm: SubmitHandler<
    CreateLedgerEntryFormInputs
  > = async (data) => {
    let body: CreateLedgerEntryFormInputs = {
      entry_time: new Date(
        timezone.getUTCTimestamp(data.entry_time)
      ).toISOString(),
      entry_type: data.entry_type,
      settlement_amount_change: Number(data.settlement_amount_change),
      settlement_asset_reference: data.settlement_asset_reference,
      instrument_reference: null,
      quantity_change: null,
      fill_px: null,
      remark: data.remark,
    }

    const asset = assetReferenceToAssetMap[data.settlement_asset_reference]
    body.settlement_amount_change =
      Number(data.settlement_amount_change) * 10 ** asset.decimals

    if (data.quantity_change && data.instrument_reference) {
      const instrument =
        instrumentReferenceToInstrumentMap[data.instrument_reference]
      body.instrument_reference = data.instrument_reference
      body.quantity_change =
        Number(data.quantity_change) * 10 ** instrument.quantity_decimals
      body.fill_px = Number(data.fill_px) * 10 ** instrument.px_decimals
    }

    await choreMasterAPIAgent.post(
      `/v1/finance/portfolios/${portfolio_reference}/ledger_entries`,
      body,
      {
        onError: () => {
          enqueueNotification(`Unable to create ledger entry now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchLedgerEntries()
          setIsCreateLedgerEntryDrawerOpen(false)
        },
      }
    )
  }

  const deleteLedgerEntry = React.useCallback(
    async (ledgerEntryReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/portfolios/${portfolio_reference}/ledger_entries/${ledgerEntryReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete ledger entry now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchLedgerEntries()
          },
        }
      )
    },
    []
  )

  // Instruments

  const fetchInstruments = React.useCallback(
    async ({
      search,
      references,
    }: {
      search?: string
      references?: string[]
    }) => {
      setIsFetchingInstruments(true)
      await choreMasterAPIAgent.get('/v1/finance/users/me/instruments', {
        params: { search, references },
        onError: () => {
          enqueueNotification(`Unable to fetch instruments now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: any) => {
          setInstruments((instruments) => {
            const instrumentReferenceToInstrumentMap = instruments.reduce(
              (acc: Record<string, Instrument>, instrument) => {
                acc[instrument.reference] = instrument
                return acc
              },
              {}
            )
            const newInstrumentReferenceToInstrumentMap = data.reduce(
              (acc: Record<string, Instrument>, instrument: Instrument) => {
                if (!instrumentReferenceToInstrumentMap[instrument.reference]) {
                  acc[instrument.reference] = instrument
                }
                return acc
              },
              {}
            )
            const newInstruments = Object.values<Instrument>(
              newInstrumentReferenceToInstrumentMap
            )
            return [...instruments, ...newInstruments]
          })
        },
      })
      setIsFetchingInstruments(false)
    },
    [enqueueNotification]
  )

  const debouncedFetchInstruments = React.useCallback(
    debounce(fetchInstruments, 1500),
    [fetchInstruments]
  )

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

  // Effects

  React.useEffect(() => {
    fetchPortfolio()
  }, [])

  React.useEffect(() => {
    fetchLedgerEntries()
  }, [])

  React.useEffect(() => {
    if (instrumentInputValue.length > 0) {
      debouncedFetchInstruments({ search: instrumentInputValue })
    }
  }, [instrumentInputValue])

  React.useEffect(() => {
    const instrumentReferenceSet = ledgerEntries.reduce(
      (acc: Set<string>, ledgerEntry) => {
        if (ledgerEntry.instrument_reference) {
          acc.add(ledgerEntry.instrument_reference)
        }
        return acc
      },
      new Set<string>()
    )
    if (instrumentReferenceSet.size > 0) {
      fetchInstruments({ references: Array.from(instrumentReferenceSet) })
    }
  }, [ledgerEntries])

  return (
    <TabContext value={tabValue}>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/finance/portfolios"
          >
            投資組合
          </MuiLink>
          {portfolio && (
            <ReferenceBlock label={portfolio.reference} primaryKey monospace />
          )}
        </Breadcrumbs>
      </Box>

      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader
          title={portfolio?.name}
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={() => {
                    fetchPortfolio()
                  }}
                  disabled={isFetchingPortfolio}
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
                setTabValue(newValue)
              }}
            >
              <Tab label="總覽" value="overview" />
              <Tab label="帳務" value="ledger" />
              <Tab label="設定" value="settings" />
            </TabList>
          </Box>
        </ModuleFunction>
      </ModuleContainer>

      <TabPanel value="overview" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionBody loading={isFetchingPortfolio}>
            <List>
              <ListSubheader>說明</ListSubheader>
              <ListItem>
                {portfolio?.description ? (
                  <ListItemText primary={portfolio?.description} />
                ) : (
                  <PlaceholderTypography>無</PlaceholderTypography>
                )}
              </ListItem>
            </List>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="ledger" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader
            subtitle="帳目"
            actions={[
              <Tooltip key="refresh" title="立即重整">
                <span>
                  <IconButton
                    onClick={fetchLedgerEntries}
                    disabled={isFetchingLedgerEntries}
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
                  createLedgerEntryForm.reset()
                  setIsCreateLedgerEntryDrawerOpen(true)
                }}
              >
                新增
              </Button>,
            ]}
          />
          <ModuleFunctionBody loading={isFetchingLedgerEntries}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <NoWrapTableCell align="right">
                      <PlaceholderTypography>#</PlaceholderTypography>
                    </NoWrapTableCell>
                    <NoWrapTableCell>帳務時間</NoWrapTableCell>
                    <NoWrapTableCell>條目類型</NoWrapTableCell>
                    <NoWrapTableCell>資產變動量</NoWrapTableCell>
                    <NoWrapTableCell>變動資產</NoWrapTableCell>
                    <NoWrapTableCell>部位變動量</NoWrapTableCell>
                    <NoWrapTableCell>交易品種</NoWrapTableCell>
                    <NoWrapTableCell>成交價格/費率</NoWrapTableCell>
                    <NoWrapTableCell>備注</NoWrapTableCell>
                    <NoWrapTableCell>來源</NoWrapTableCell>
                    <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                    <NoWrapTableCell align="right">操作</NoWrapTableCell>
                  </TableRow>
                </TableHead>
                <StatefulTableBody
                  isLoading={isFetchingLedgerEntries}
                  isEmpty={ledgerEntries.length === 0}
                >
                  {ledgerEntries.map((ledgerEntry, index) => {
                    const instrument =
                      instrumentReferenceToInstrumentMap[
                        ledgerEntry.instrument_reference ?? ''
                      ]
                    const quantity_change = !ledgerEntry.quantity_change
                      ? 'N/A'
                      : new Decimal(ledgerEntry.quantity_change)
                          .dividedBy(
                            new Decimal(10 ** instrument.quantity_decimals)
                          )
                          .toString()
                    const fill_px = !ledgerEntry.fill_px
                      ? 'N/A'
                      : new Decimal(ledgerEntry.fill_px)
                          .dividedBy(new Decimal(10 ** instrument.px_decimals))
                          .toString()
                    return (
                      <TableRow key={ledgerEntry.reference} hover>
                        <NoWrapTableCell align="right">
                          <PlaceholderTypography>
                            {ledgerEntriesPage * ledgerEntriesRowsPerPage +
                              index +
                              1}
                          </PlaceholderTypography>
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          <DatetimeBlock isoText={ledgerEntry.entry_time} />
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={
                              financeLedgerEntryEntryTypes.find(
                                (entryType) =>
                                  entryType.value === ledgerEntry.entry_type
                              )?.label
                            }
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          {ledgerEntry.settlement_amount_change}
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={
                              assetReferenceToAssetMap[
                                ledgerEntry.settlement_asset_reference
                              ].name
                            }
                            foreignValue
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>{quantity_change}</NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={instrument.name}
                            foreignValue
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>{fill_px}</NoWrapTableCell>
                        <NoWrapTableCell>{ledgerEntry.remark}</NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={
                              financeLedgerEntrySourceTypes.find(
                                (sourceType) =>
                                  sourceType.value === ledgerEntry.source_type
                              )?.label
                            }
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={ledgerEntry.reference}
                            primaryKey
                            monospace
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => {
                              updateLedgerEntryForm.reset({
                                instrument_reference:
                                  ledgerEntry.instrument_reference ?? '',
                                entry_type: ledgerEntry.entry_type,
                                quantity_change:
                                  ledgerEntry.quantity_change ?? 0,
                                fill_px: ledgerEntry.fill_px ?? 0,
                                entry_time: timezone
                                  .getLocalString(ledgerEntry.entry_time)
                                  .slice(0, -5),
                              })
                              setEditingLedgerEntryReference(
                                ledgerEntry.reference
                              )
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              deleteLedgerEntry(ledgerEntry.reference)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </NoWrapTableCell>
                      </TableRow>
                    )
                  })}
                </StatefulTableBody>
              </Table>
            </TableContainer>
            <TablePagination
              count={ledgerEntriesCount}
              page={ledgerEntriesPage}
              rowsPerPage={ledgerEntriesRowsPerPage}
              setPage={setLedgerEntriesPage}
              setRowsPerPage={setLedgerEntriesRowsPerPage}
              rowsPerPageOptions={[10, 20]}
            />
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="settings" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader subtitle="基本資訊" />
          <ModuleFunctionBody loading={isFetchingPortfolio}>
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
                  control={updatePortfolioForm.control}
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
                  name="description"
                  control={updatePortfolioForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="描述"
                      variant="filled"
                      multiline
                      rows={5}
                    />
                  )}
                />
              </FormControl>
              <AutoLoadingButton
                type="submit"
                variant="contained"
                disabled={
                  !updatePortfolioForm.formState.isDirty ||
                  !updatePortfolioForm.formState.isValid
                }
                onClick={updatePortfolioForm.handleSubmit(
                  handleSubmitUpdatePortfolioForm
                )}
              >
                儲存
              </AutoLoadingButton>
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>

        <ModuleFunction>
          <ModuleFunctionHeader subtitle="進階" />
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
                  await deletePortfolio(portfolio_reference)
                }}
              >
                刪除
              </AutoLoadingButton>
            </Stack>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <Drawer
        anchor="right"
        open={isCreateLedgerEntryDrawerOpen}
        onClose={() => setIsCreateLedgerEntryDrawerOpen(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增帳目" />
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
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="entry_time"
                    control={createLedgerEntryForm.control}
                    defaultValue={timezone
                      .getLocalDate(new Date())
                      .toISOString()
                      .slice(0, -5)}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        required
                        label="帳務時間"
                        variant="filled"
                        type="datetime-local"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={
                          !!createLedgerEntryForm.formState.errors.entry_time
                        }
                        helperText={
                          createLedgerEntryForm.formState.errors.entry_time
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
            <Controller
              name="entry_type"
              control={createLedgerEntryForm.control}
              defaultValue={financeLedgerEntryEntryTypes[0].value}
              render={({ field }) => (
                <FormControl required fullWidth size="small" variant="filled">
                  <InputLabel>條目類型</InputLabel>
                  <Select {...field}>
                    {financeLedgerEntryEntryTypes.map((entryType) => (
                      <MenuItem key={entryType.value} value={entryType.value}>
                        {entryType.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <FormControl>
              <Controller
                name="settlement_amount_change"
                control={createLedgerEntryForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="資產變動量"
                    variant="filled"
                    type="number"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="settlement_asset_reference"
                control={createLedgerEntryForm.control}
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
                    onInputChange={(event, newInputValue) => {
                      setAssetInputValue(newInputValue)
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
                        label="變動資產"
                        variant="filled"
                        size="small"
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
                name="quantity_change"
                control={createLedgerEntryForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="部位變動量"
                    variant="filled"
                    type="number"
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                name="instrument_reference"
                control={createLedgerEntryForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={
                      field.value
                        ? instrumentReferenceToInstrumentMap[field.value]
                        : null
                    }
                    onChange={(_event, value: Instrument | null) => {
                      field.onChange(value?.reference ?? '')
                      setInstrumentInputValue('')
                    }}
                    onInputChange={(event, newInputValue) => {
                      setInstrumentInputValue(newInputValue)
                    }}
                    onOpen={() => {
                      if (
                        instrumentInputValue.length === 0 &&
                        instruments.length === 0
                      ) {
                        fetchInstruments({ search: instrumentInputValue })
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.reference === value.reference
                    }
                    getOptionLabel={(option) => option.name}
                    filterOptions={(instruments) => {
                      const lowerCaseInstrumentInputValue =
                        instrumentInputValue.toLowerCase()
                      return instruments.filter((instrument) =>
                        instrument.name
                          .toLowerCase()
                          .includes(lowerCaseInstrumentInputValue)
                      )
                    }}
                    options={instruments}
                    autoHighlight
                    loading={isFetchingInstruments}
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
                        label="交易品種"
                        variant="filled"
                        size="small"
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="fill_px"
                control={createLedgerEntryForm.control}
                defaultValue={0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="成交價格/費率"
                    variant="filled"
                    type="number"
                    helperText="按交易品種的結算資產計價"
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="remark"
                control={createLedgerEntryForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="備註"
                    variant="filled"
                    multiline
                    rows={5}
                  />
                )}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              disabled={!createLedgerEntryForm.formState.isValid}
              onClick={createLedgerEntryForm.handleSubmit(
                handleSubmitCreateLedgerEntryForm
              )}
            >
              新增
            </AutoLoadingButton>
          </Stack>
        </Box>
      </Drawer>
    </TabContext>
  )
}
