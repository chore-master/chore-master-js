'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
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

interface Asset {
  reference: string
  symbol: string
}

type CreateAssetFormInputs = {
  symbol: string
}

type UpdateAssetFormInputs = {
  symbol: string
}

export default function Page() {
  const { enqueueNotification } = useNotification()

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)
  const [isCreateAssetDrawerOpen, setIsCreateAssetDrawerOpen] =
    React.useState(false)
  const createAssetForm = useForm<CreateAssetFormInputs>()
  const [editingAssetReference, setEditingAssetReference] =
    React.useState<string>()
  const updateAssetForm = useForm<UpdateAssetFormInputs>()

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

  const handleSubmitCreateAssetForm: SubmitHandler<
    CreateAssetFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/financial_management/assets', data, {
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: () => {
        createAssetForm.reset()
        setIsCreateAssetDrawerOpen(false)
        fetchAssets()
      },
    })
  }

  const handleSubmitUpdateAssetForm: SubmitHandler<
    UpdateAssetFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/financial_management/assets/${editingAssetReference}`,
      data,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          updateAssetForm.reset()
          setEditingAssetReference(undefined)
          fetchAssets()
        },
      }
    )
  }

  const deleteAsset = React.useCallback(
    async (assetReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/financial_management/assets/${assetReference}`,
        {
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchAssets()
          },
        }
      )
    },
    [enqueueNotification, fetchAssets]
  )

  React.useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="資產類別明細"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton onClick={fetchAssets} disabled={isFetchingAssets}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
            <Button
              key="create"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateAssetDrawerOpen(true)}
            >
              新增
            </Button>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingAssets}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell>代號</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.reference} hover>
                    <NoWrapTableCell>
                      <Chip size="small" label={asset.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell>{asset.symbol}</NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateAssetForm.setValue('symbol', asset.symbol)
                          setEditingAssetReference(asset.reference)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteAsset(asset.reference)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </NoWrapTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
        anchor="right"
        open={isCreateAssetDrawerOpen}
        onClose={() => setIsCreateAssetDrawerOpen(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增資產" />
          <Stack
            component="form"
            spacing={3}
            p={2}
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault()
              createAssetForm.handleSubmit(handleSubmitCreateAssetForm)()
            }}
          >
            <FormControl>
              <Controller
                name="symbol"
                control={createAssetForm.control}
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
            <LoadingButton
              variant="contained"
              type="submit"
              loading={createAssetForm.formState.isSubmitting}
            >
              新增
            </LoadingButton>
          </Stack>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={editingAssetReference !== undefined}
        onClose={() => setEditingAssetReference(undefined)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="編輯資產" />
          <Stack
            component="form"
            spacing={3}
            p={2}
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault()
              updateAssetForm.handleSubmit(handleSubmitUpdateAssetForm)()
            }}
          >
            <FormControl>
              <Controller
                name="symbol"
                control={updateAssetForm.control}
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
            <LoadingButton
              variant="contained"
              type="submit"
              loading={updateAssetForm.formState.isSubmitting}
            >
              儲存
            </LoadingButton>
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
