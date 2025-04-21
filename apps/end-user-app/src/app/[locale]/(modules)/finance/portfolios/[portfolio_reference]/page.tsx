'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
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
import { useOffsetPagination } from '@/hooks/useOffsetPagination'
import {
  Asset,
  CreateTransactionFormInputs,
  CreateTransferFormInputs,
  Portfolio,
  Transaction,
  UpdatePortfolioFormInputs,
  UpdateTransactionFormInputs,
  UpdateTransferFormInputs,
} from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
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
import Decimal from 'decimal.js'
import { debounce } from 'lodash'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import CreateTransactionForm from './CreateTransactionForm'
import CreateTransferForm from './CreateTransferForm'
import TransactionRow from './TransactionRow'
import UpdateTransactionForm from './UpdateTransactionForm'
import UpdateTransferForm from './UpdateTransferForm'

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

  // Transactions
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const transactionsPagination = useOffsetPagination({
    pageKey: 'page',
    rowsPerPageKey: 'rowsPerPage',
  })
  const [isFetchingTransactions, setIsFetchingTransactions] =
    React.useState(false)
  const createTransactionForm = useForm<CreateTransactionFormInputs>({
    mode: 'all',
  })
  const [isCreateTransactionDrawerOpen, setIsCreateTransactionDrawerOpen] =
    React.useState(false)
  const [editingTransactionReference, setEditingTransactionReference] =
    React.useState<string | null>(null)
  const [focusedTransactionReference, setFocusedTransactionReference] =
    React.useState<string | null>(null)
  const updateTransactionForm = useForm<UpdateTransactionFormInputs>({
    mode: 'all',
  })

  // Transfer
  const createTransferForm = useForm<CreateTransferFormInputs>({
    mode: 'all',
  })
  const [isCreateTransferDrawerOpen, setIsCreateTransferDrawerOpen] =
    React.useState(false)
  const [editingTransferReference, setEditingTransferReference] =
    React.useState<string | null>(null)
  const updateTransferForm = useForm<UpdateTransferFormInputs>({
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

  // Transactions

  const fetchTransactions = React.useCallback(async () => {
    setIsFetchingTransactions(true)
    await choreMasterAPIAgent.get(
      `/v1/finance/portfolios/${portfolio_reference}/transactions`,
      {
        params: {
          offset: transactionsPagination.offset,
          limit: transactionsPagination.rowsPerPage,
        },
        onError: () => {
          enqueueNotification(`Unable to fetch transactions now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: ({
          data,
          metadata,
        }: {
          data: Transaction[]
          metadata: any
        }) => {
          setTransactions(data)
          transactionsPagination.setCount(metadata.offset_pagination.count)
        },
      }
    )
    setIsFetchingTransactions(false)
  }, [transactionsPagination.offset, transactionsPagination.rowsPerPage])

  const handleSubmitCreateTransactionForm: SubmitHandler<
    CreateTransactionFormInputs
  > = async (data) => {
    let body: CreateTransactionFormInputs = {
      transacted_time: new Date(
        timezone.getUTCTimestamp(data.transacted_time)
      ).toISOString(),
      chain_id: data.chain_id,
      tx_hash: data.tx_hash,
      remark: data.remark,
    }

    await choreMasterAPIAgent.post(
      `/v1/finance/portfolios/${portfolio_reference}/transactions`,
      body,
      {
        onError: () => {
          enqueueNotification(`Unable to create transaction now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchTransactions()
          setIsCreateTransactionDrawerOpen(false)
        },
      }
    )
  }

  const handleSubmitUpdateTransactionForm: SubmitHandler<
    UpdateTransactionFormInputs
  > = async (data) => {
    let body: UpdateTransactionFormInputs = {
      transacted_time: new Date(
        timezone.getUTCTimestamp(data.transacted_time)
      ).toISOString(),
      chain_id: data.chain_id,
      tx_hash: data.tx_hash,
      remark: data.remark,
    }

    await choreMasterAPIAgent.patch(
      `/v1/finance/portfolios/${portfolio_reference}/transactions/${editingTransactionReference}`,
      body,
      {
        onError: () => {
          enqueueNotification(`Unable to update transaction now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchTransactions()
          setEditingTransactionReference(null)
        },
      }
    )
  }

  const deleteTransaction = React.useCallback(
    async (transactionReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/portfolios/${portfolio_reference}/transactions/${transactionReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete transaction now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchTransactions()
          },
        }
      )
    },
    []
  )

  // Transfers

  const handleSubmitCreateTransferForm: SubmitHandler<
    CreateTransferFormInputs
  > = async (data) => {
    let body: CreateTransferFormInputs = {
      flow_type: data.flow_type,
      asset_amount_change: data.asset_amount_change,
      asset_reference: data.asset_reference,
      settlement_asset_amount_change: data.settlement_asset_amount_change,
      remark: data.remark,
    }

    const asset = assetReferenceToAssetMap[data.asset_reference]
    body.asset_amount_change = new Decimal(data.asset_amount_change)
      .times(10 ** asset.decimals)
      .toFixed()

    if (data.settlement_asset_amount_change) {
      const settlementAsset =
        assetReferenceToAssetMap[
          portfolio?.settlement_asset_reference as string
        ]
      if (!settlementAsset) {
        enqueueNotification(
          `Unable to find settlement asset ${portfolio?.settlement_asset_reference}`,
          'error'
        )
        return
      }
      body.settlement_asset_amount_change = new Decimal(
        data.settlement_asset_amount_change
      )
        .times(10 ** settlementAsset.decimals)
        .toFixed()
    }

    await choreMasterAPIAgent.post(
      `/v1/finance/portfolios/${portfolio_reference}/transactions/${focusedTransactionReference}/transfers`,
      body,
      {
        onError: () => {
          enqueueNotification(`Unable to create transfer now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchTransactions()
          setIsCreateTransferDrawerOpen(false)
        },
      }
    )
  }

  const handleSubmitUpdateTransferForm: SubmitHandler<
    UpdateTransferFormInputs
  > = async (data) => {
    let body: UpdateTransferFormInputs = {
      flow_type: data.flow_type,
      asset_amount_change: data.asset_amount_change,
      asset_reference: data.asset_reference,
      settlement_asset_amount_change: data.settlement_asset_amount_change,
      remark: data.remark,
    }

    const asset = assetReferenceToAssetMap[data.asset_reference]
    body.asset_amount_change = new Decimal(data.asset_amount_change)
      .times(10 ** asset.decimals)
      .toFixed()

    if (data.settlement_asset_amount_change) {
      const settlementAsset =
        assetReferenceToAssetMap[
          portfolio?.settlement_asset_reference as string
        ]
      if (!settlementAsset) {
        enqueueNotification(
          `Unable to find settlement asset ${portfolio?.settlement_asset_reference}`,
          'error'
        )
        return
      }
      body.settlement_asset_amount_change = new Decimal(
        data.settlement_asset_amount_change
      )
        .times(10 ** settlementAsset.decimals)
        .toFixed()
    }

    await choreMasterAPIAgent.patch(
      `/v1/finance/portfolios/${portfolio_reference}/transactions/${focusedTransactionReference}/transfers/${editingTransferReference}`,
      body,
      {
        onError: () => {
          enqueueNotification(`Unable to update transfer now.`, 'error')
        },
        onFail: ({ message }: { message: string }) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchTransactions()
          setEditingTransferReference(null)
        },
      }
    )
  }

  const deleteTransfer = React.useCallback(
    async (transactionReference: string, transferReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/finance/portfolios/${portfolio_reference}/transactions/${transactionReference}/transfers/${transferReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete transfer now.`, 'error')
          },
          onFail: ({ message }: { message: string }) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchTransactions()
          },
        }
      )
    },
    []
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
    fetchTransactions()
  }, [fetchTransactions])

  React.useEffect(() => {
    if (assetInputValue.length > 0) {
      debouncedFetchAssets({ search: assetInputValue })
    }
  }, [assetInputValue])

  React.useEffect(() => {
    if (portfolio) {
      fetchAssets({ references: [portfolio.settlement_asset_reference] })
    }
  }, [portfolio])

  React.useEffect(() => {
    const assetReferenceSet = transactions.reduce(
      (acc: Set<string>, transaction) => {
        transaction.transfers.forEach((transfer) => {
          if (transfer.asset_reference) {
            acc.add(transfer.asset_reference)
          }
        })
        return acc
      },
      new Set<string>()
    )
    if (assetReferenceSet.size > 0) {
      fetchAssets({ references: Array.from(assetReferenceSet) })
    }
  }, [transactions])

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
              <ListSubheader>結算資產</ListSubheader>
              <ListItem>
                <ReferenceBlock
                  label={
                    assetReferenceToAssetMap[
                      portfolio?.settlement_asset_reference as string
                    ]?.name
                  }
                  foreignValue
                />
              </ListItem>
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
            subtitle="交易明細"
            actions={[
              <Tooltip key="refresh" title="立即重整">
                <span>
                  <IconButton
                    onClick={fetchTransactions}
                    disabled={isFetchingTransactions}
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
                  createTransactionForm.reset({})
                  setIsCreateTransactionDrawerOpen(true)
                }}
              >
                新增
              </Button>,
            ]}
          />
          <ModuleFunctionBody
            loading={
              isFetchingTransactions ||
              (!isCreateTransferDrawerOpen &&
                !editingTransferReference &&
                isFetchingAssets)
            }
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <NoWrapTableCell />
                    <NoWrapTableCell align="right">
                      <PlaceholderTypography>#</PlaceholderTypography>
                    </NoWrapTableCell>
                    <NoWrapTableCell>交易時間</NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      結算資產變動
                    </NoWrapTableCell>
                    <NoWrapTableCell colSpan={3}>變動明細</NoWrapTableCell>
                    <NoWrapTableCell>備註</NoWrapTableCell>
                    <NoWrapTableCell>區塊鏈 ID</NoWrapTableCell>
                    <NoWrapTableCell>區塊鏈交易 Hash</NoWrapTableCell>
                    <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                    <NoWrapTableCell align="right">操作</NoWrapTableCell>
                  </TableRow>
                </TableHead>
                <StatefulTableBody
                  isLoading={isFetchingTransactions}
                  isEmpty={transactions.length === 0}
                >
                  {transactions.map((transaction, index) => (
                    <TransactionRow
                      key={transaction.reference}
                      portfolio={portfolio}
                      transaction={transaction}
                      index={index}
                      transactionsPagination={transactionsPagination}
                      timezone={timezone}
                      assetReferenceToAssetMap={assetReferenceToAssetMap}
                      updateTransactionForm={updateTransactionForm}
                      createTransferForm={createTransferForm}
                      updateTransferForm={updateTransferForm}
                      setEditingTransactionReference={
                        setEditingTransactionReference
                      }
                      setFocusedTransactionReference={
                        setFocusedTransactionReference
                      }
                      setIsCreateTransferDrawerOpen={
                        setIsCreateTransferDrawerOpen
                      }
                      setEditingTransferReference={setEditingTransferReference}
                      deleteTransaction={deleteTransaction}
                      deleteTransfer={deleteTransfer}
                    />
                  ))}
                </StatefulTableBody>
              </Table>
            </TableContainer>
            <TablePagination offsetPagination={transactionsPagination} />
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
        closeAfterTransition={false}
        anchor="right"
        open={isCreateTransactionDrawerOpen}
        onClose={() => setIsCreateTransactionDrawerOpen(false)}
      >
        <CreateTransactionForm
          createTransactionForm={createTransactionForm}
          timezone={timezone}
          handleSubmitCreateTransactionForm={handleSubmitCreateTransactionForm}
        />
      </Drawer>

      <Drawer
        closeAfterTransition={false}
        anchor="right"
        open={editingTransactionReference !== null}
        onClose={() => setEditingTransactionReference(null)}
      >
        <UpdateTransactionForm
          updateTransactionForm={updateTransactionForm}
          timezone={timezone}
          handleSubmitUpdateTransactionForm={handleSubmitUpdateTransactionForm}
        />
      </Drawer>

      <Drawer
        closeAfterTransition={false}
        anchor="right"
        open={isCreateTransferDrawerOpen}
        onClose={() => setIsCreateTransferDrawerOpen(false)}
      >
        <CreateTransferForm
          portfolio={portfolio}
          createTransferForm={createTransferForm}
          assetInputValue={assetInputValue}
          isFetchingAssets={isFetchingAssets}
          assets={assets}
          assetReferenceToAssetMap={assetReferenceToAssetMap}
          setAssetInputValue={setAssetInputValue}
          fetchAssets={fetchAssets}
          handleSubmitCreateTransferForm={handleSubmitCreateTransferForm}
        />
      </Drawer>

      <Drawer
        closeAfterTransition={false}
        anchor="right"
        open={editingTransferReference !== null}
        onClose={() => setEditingTransferReference(null)}
      >
        <UpdateTransferForm
          portfolio={portfolio}
          updateTransferForm={updateTransferForm}
          assetInputValue={assetInputValue}
          isFetchingAssets={isFetchingAssets}
          assets={assets}
          assetReferenceToAssetMap={assetReferenceToAssetMap}
          setAssetInputValue={setAssetInputValue}
          fetchAssets={fetchAssets}
          handleSubmitUpdateTransferForm={handleSubmitUpdateTransferForm}
        />
      </Drawer>
    </TabContext>
  )
}
