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
  CreatePortfolioFormInputs,
  Portfolio,
  UpdatePortfolioFormInputs,
} from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
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
  const [portfoliosCount, setPortfoliosCount] = React.useState(0)
  const [portfoliosPage, setPortfoliosPage] = React.useState(0)
  const [portfoliosRowsPerPage, setPortfoliosRowsPerPage] = React.useState(10)
  const [isFetchingPortfolios, setIsFetchingPortfolios] = React.useState(false)
  const [isCreatePortfolioDrawerOpen, setIsCreatePortfolioDrawerOpen] =
    React.useState(false)
  const createPortfolioForm = useForm<CreatePortfolioFormInputs>()
  const [editingPortfolioReference, setEditingPortfolioReference] =
    React.useState<string>()
  const updatePortfolioForm = useForm<UpdatePortfolioFormInputs>()

  const fetchPortfolios = React.useCallback(async () => {
    setIsFetchingPortfolios(true)
    await choreMasterAPIAgent.get('/v1/finance/portfolios', {
      params: {
        offset: portfoliosPage * portfoliosRowsPerPage,
        limit: portfoliosRowsPerPage,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch portfolios now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data, metadata }: any) => {
        setPortfolios(data)
        setPortfoliosCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingPortfolios(false)
  }, [portfoliosPage, portfoliosRowsPerPage])

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

  const handleSubmitUpdatePortfolioForm: SubmitHandler<
    UpdatePortfolioFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/portfolios/${editingPortfolioReference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update portfolio now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          updatePortfolioForm.reset()
          setEditingPortfolioReference(undefined)
          fetchPortfolios()
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
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchPortfolios()
          },
        }
      )
    },
    [enqueueNotification, fetchPortfolios]
  )

  React.useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

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
                  <NoWrapTableCell>描述</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
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
                        {portfoliosPage * portfoliosRowsPerPage + index + 1}
                      </PlaceholderTypography>
                    </NoWrapTableCell>
                    <NoWrapTableCell>{portfolio.name}</NoWrapTableCell>
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
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updatePortfolioForm.setValue('name', portfolio.name)
                          updatePortfolioForm.setValue(
                            'description',
                            portfolio.description
                          )
                          setEditingPortfolioReference(portfolio.reference)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deletePortfolio(portfolio.reference)}
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
            count={portfoliosCount}
            page={portfoliosPage}
            rowsPerPage={portfoliosRowsPerPage}
            setPage={setPortfoliosPage}
            setRowsPerPage={setPortfoliosRowsPerPage}
            rowsPerPageOptions={[10, 20]}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
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

      <Drawer
        anchor="right"
        open={editingPortfolioReference !== undefined}
        onClose={() => setEditingPortfolioReference(undefined)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="編輯投資組合" />
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
              disabled={!updatePortfolioForm.formState.isValid}
              onClick={updatePortfolioForm.handleSubmit(
                handleSubmitUpdatePortfolioForm
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
