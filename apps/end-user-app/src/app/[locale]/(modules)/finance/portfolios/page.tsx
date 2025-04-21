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
import { useOffsetPagination } from '@/hooks/useOffsetPagination'
import { Asset, CreatePortfolioFormInputs, Portfolio } from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
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

  // Portfolios
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([])
  const portfoliosPagination = useOffsetPagination({})
  const [isFetchingPortfolios, setIsFetchingPortfolios] = React.useState(false)
  const [isCreatePortfolioDrawerOpen, setIsCreatePortfolioDrawerOpen] =
    React.useState(false)
  const createPortfolioForm = useForm<CreatePortfolioFormInputs>()

  // Asset
  const [settleableAssets, setSettleableAssets] = React.useState<Asset[]>([])
  const [isFetchingSettleableAssets, setIsFetchingSettleableAssets] =
    React.useState(false)

  const fetchPortfolios = React.useCallback(async () => {
    setIsFetchingPortfolios(true)
    await choreMasterAPIAgent.get('/v1/finance/portfolios', {
      params: {
        offset: portfoliosPagination.offset,
        limit: portfoliosPagination.rowsPerPage,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch portfolios now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data, metadata }: any) => {
        setPortfolios(data)
        portfoliosPagination.setCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingPortfolios(false)
  }, [portfoliosPagination.offset, portfoliosPagination.rowsPerPage])

  const fetchSettleableAssets = React.useCallback(async () => {
    setIsFetchingSettleableAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/users/me/assets', {
      params: {
        is_settleable: true,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch settleable assets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setSettleableAssets(data)
      },
    })
    setIsFetchingSettleableAssets(false)
  }, [enqueueNotification])

  const handleSubmitCreatePortfolioForm: SubmitHandler<
    CreatePortfolioFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/finance/portfolios', data, {
      onError: () => {
        enqueueNotification(`Unable to create portfolio now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: () => {
        createPortfolioForm.reset()
        setIsCreatePortfolioDrawerOpen(false)
        fetchPortfolios()
      },
    })
  }

  React.useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

  React.useEffect(() => {
    fetchSettleableAssets()
  }, [fetchSettleableAssets])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="投資組合"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchPortfolios}
                  disabled={isFetchingPortfolios}
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
                createPortfolioForm.reset()
                setIsCreatePortfolioDrawerOpen(true)
              }}
            >
              新增
            </Button>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingPortfolios}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell align="right">
                    <PlaceholderTypography>#</PlaceholderTypography>
                  </NoWrapTableCell>
                  <NoWrapTableCell>名稱</NoWrapTableCell>
                  <NoWrapTableCell>結算資產</NoWrapTableCell>
                  <NoWrapTableCell>描述</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingPortfolios}
                isEmpty={portfolios.length === 0}
              >
                {portfolios.map((portfolio, index) => (
                  <TableRow key={portfolio.reference} hover>
                    <NoWrapTableCell align="right">
                      <PlaceholderTypography>
                        {portfoliosPagination.offset + index + 1}
                      </PlaceholderTypography>
                    </NoWrapTableCell>
                    <NoWrapTableCell>{portfolio.name}</NoWrapTableCell>
                    <NoWrapTableCell>
                      <ReferenceBlock
                        label={
                          settleableAssets.find(
                            (asset) =>
                              asset.reference ===
                              portfolio.settlement_asset_reference
                          )?.name
                        }
                        foreignValue
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      {portfolio.description || (
                        <PlaceholderTypography>無</PlaceholderTypography>
                      )}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <ReferenceBlock
                        label={portfolio.reference}
                        primaryKey
                        monospace
                        href={`/finance/portfolios/${portfolio.reference}`}
                      />
                    </NoWrapTableCell>
                  </TableRow>
                ))}
              </StatefulTableBody>
            </Table>
          </TableContainer>
          <TablePagination offsetPagination={portfoliosPagination} />
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
        closeAfterTransition={false}
        anchor="right"
        open={isCreatePortfolioDrawerOpen}
        onClose={() => setIsCreatePortfolioDrawerOpen(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增投資組合" />
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
                control={createPortfolioForm.control}
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
            <FormControl fullWidth>
              <Controller
                name="settlement_asset_reference"
                control={createPortfolioForm.control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    value={
                      settleableAssets.find(
                        (asset) => asset.reference === field.value
                      ) ?? null
                    }
                    onChange={(_event, value) => {
                      field.onChange(value?.reference ?? '')
                    }}
                    // onOpen={() => {
                    //   if (assets.length === 0) {
                    //     fetchAssets()
                    //   }
                    // }}
                    isOptionEqualToValue={(option, value) =>
                      option.reference === value.reference
                    }
                    getOptionLabel={(option) => option.name}
                    options={settleableAssets}
                    autoHighlight
                    loading={isFetchingSettleableAssets}
                    // loadingText="載入中..."
                    // noOptionsText="沒有符合的選項"
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
                        label="結算資產"
                        variant="filled"
                        helperText="建立後無法變更"
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
                name="description"
                control={createPortfolioForm.control}
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
              disabled={!createPortfolioForm.formState.isValid}
              onClick={createPortfolioForm.handleSubmit(
                handleSubmitCreatePortfolioForm
              )}
            >
              新增
            </AutoLoadingButton>
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
