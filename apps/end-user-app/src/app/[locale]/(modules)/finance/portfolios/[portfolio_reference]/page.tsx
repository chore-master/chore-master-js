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
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
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
import { Decimal } from 'decimal.js'
import { debounce } from 'lodash'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import CreateLedgerEntryForm from './CreateLedgerEntryForm'
import UpdateLedgerEntryForm from './UpdateLedgerEntryForm'

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
      parent_ledger_entry_reference: data.parent_ledger_entry_reference,
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

  const handleSubmitUpdateLedgerEntryForm: SubmitHandler<
    UpdateLedgerEntryFormInputs
  > = async (data) => {
    let body: UpdateLedgerEntryFormInputs = {
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
      parent_ledger_entry_reference: data.parent_ledger_entry_reference,
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

    await choreMasterAPIAgent.patch(
      `/v1/finance/portfolios/${portfolio_reference}/ledger_entries/${editingLedgerEntryReference}`,
      body,
      {
        onError: () => {
          enqueueNotification(`Unable to update ledger entry now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchLedgerEntries()
          setEditingLedgerEntryReference(null)
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
    if (assetInputValue.length > 0) {
      debouncedFetchAssets({ search: assetInputValue })
    }
  }, [assetInputValue])

  React.useEffect(() => {
    if (instrumentInputValue.length > 0) {
      debouncedFetchInstruments({ search: instrumentInputValue })
    }
  }, [instrumentInputValue])

  React.useEffect(() => {
    const assetReferenceSet = ledgerEntries.reduce(
      (acc: Set<string>, ledgerEntry) => {
        if (ledgerEntry.settlement_asset_reference) {
          acc.add(ledgerEntry.settlement_asset_reference)
        }
        return acc
      },
      new Set<string>()
    )
    if (assetReferenceSet.size > 0) {
      fetchAssets({ references: Array.from(assetReferenceSet) })
    }
  }, [ledgerEntries])

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
                  createLedgerEntryForm.reset({
                    parent_ledger_entry_reference: null,
                  })
                  setIsCreateLedgerEntryDrawerOpen(true)
                }}
              >
                新增
              </Button>,
            ]}
          />
          <ModuleFunctionBody
            loading={
              isFetchingLedgerEntries ||
              isFetchingAssets ||
              isFetchingInstruments
            }
          >
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
                    const settlement_asset =
                      assetReferenceToAssetMap[
                        ledgerEntry.settlement_asset_reference
                      ]
                    let settlement_amount_change: number | undefined
                    if (settlement_asset) {
                      settlement_amount_change = new Decimal(
                        ledgerEntry.settlement_amount_change
                      )
                        .dividedBy(new Decimal(10 ** settlement_asset.decimals))
                        .toNumber()
                    }
                    let instrument: Instrument | undefined
                    let quantity_change: number | undefined
                    let fill_px: number | undefined
                    if (ledgerEntry.instrument_reference) {
                      instrument =
                        instrumentReferenceToInstrumentMap[
                          ledgerEntry.instrument_reference
                        ]
                      if (instrument) {
                        quantity_change = new Decimal(
                          ledgerEntry.quantity_change as number
                        )
                          .dividedBy(
                            new Decimal(10 ** instrument.quantity_decimals)
                          )
                          .toNumber()

                        fill_px = new Decimal(ledgerEntry.fill_px as number)
                          .dividedBy(new Decimal(10 ** instrument.px_decimals))
                          .toNumber()
                      }
                    }
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
                          {settlement_amount_change}
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          <ReferenceBlock
                            label={settlement_asset?.name}
                            foreignValue
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          {quantity_change === undefined ? (
                            <PlaceholderTypography>N/A</PlaceholderTypography>
                          ) : (
                            quantity_change
                          )}
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          {instrument ? (
                            <ReferenceBlock
                              label={instrument.name}
                              foreignValue
                            />
                          ) : (
                            <PlaceholderTypography>N/A</PlaceholderTypography>
                          )}
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          {fill_px === undefined ? (
                            <PlaceholderTypography>N/A</PlaceholderTypography>
                          ) : (
                            fill_px
                          )}
                        </NoWrapTableCell>
                        <NoWrapTableCell>
                          {ledgerEntry.remark || (
                            <PlaceholderTypography>無</PlaceholderTypography>
                          )}
                        </NoWrapTableCell>
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
                              createLedgerEntryForm.reset({
                                parent_ledger_entry_reference:
                                  ledgerEntry.reference,
                                entry_time: timezone
                                  .getLocalString(ledgerEntry.entry_time)
                                  .slice(0, -5),
                              })
                              setIsCreateLedgerEntryDrawerOpen(true)
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              updateLedgerEntryForm.reset({
                                parent_ledger_entry_reference:
                                  ledgerEntry.parent_ledger_entry_reference,
                                entry_time: timezone
                                  .getLocalString(ledgerEntry.entry_time)
                                  .slice(0, -5),
                                entry_type: ledgerEntry.entry_type,
                                settlement_amount_change:
                                  settlement_amount_change,
                                settlement_asset_reference:
                                  ledgerEntry.settlement_asset_reference,
                                quantity_change: quantity_change,
                                instrument_reference:
                                  ledgerEntry.instrument_reference ?? '',
                                fill_px: fill_px,
                                remark: ledgerEntry.remark ?? '',
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
        <CreateLedgerEntryForm
          createLedgerEntryForm={createLedgerEntryForm}
          timezone={timezone}
          assetReferenceToAssetMap={assetReferenceToAssetMap}
          instrumentReferenceToInstrumentMap={
            instrumentReferenceToInstrumentMap
          }
          assets={assets}
          instruments={instruments}
          fetchAssets={fetchAssets}
          fetchInstruments={fetchInstruments}
          isFetchingAssets={isFetchingAssets}
          isFetchingInstruments={isFetchingInstruments}
          setAssetInputValue={setAssetInputValue}
          setInstrumentInputValue={setInstrumentInputValue}
          assetInputValue={assetInputValue}
          instrumentInputValue={instrumentInputValue}
          handleSubmitCreateLedgerEntryForm={handleSubmitCreateLedgerEntryForm}
        />
      </Drawer>

      <Drawer
        anchor="right"
        open={editingLedgerEntryReference !== null}
        onClose={() => setEditingLedgerEntryReference(null)}
      >
        <UpdateLedgerEntryForm
          updateLedgerEntryForm={updateLedgerEntryForm}
          timezone={timezone}
          assetReferenceToAssetMap={assetReferenceToAssetMap}
          instrumentReferenceToInstrumentMap={
            instrumentReferenceToInstrumentMap
          }
          assets={assets}
          instruments={instruments}
          fetchAssets={fetchAssets}
          fetchInstruments={fetchInstruments}
          isFetchingAssets={isFetchingAssets}
          isFetchingInstruments={isFetchingInstruments}
          setAssetInputValue={setAssetInputValue}
          setInstrumentInputValue={setInstrumentInputValue}
          assetInputValue={assetInputValue}
          instrumentInputValue={instrumentInputValue}
          handleSubmitUpdateLedgerEntryForm={handleSubmitUpdateLedgerEntryForm}
        />
      </Drawer>
    </TabContext>
  )
}
