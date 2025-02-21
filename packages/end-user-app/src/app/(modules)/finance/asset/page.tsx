'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { Asset, CreateAssetFormInputs, UpdateAssetFormInputs } from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
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
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

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
    await choreMasterAPIAgent.get('/v1/finance/assets', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch assets now.`, 'error')
      },
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
    await choreMasterAPIAgent.post('/v1/finance/assets', data, {
      onError: () => {
        enqueueNotification(`Unable to create asset now.`, 'error')
      },
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
      `/v1/finance/assets/${editingAssetReference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update asset now.`, 'error')
        },
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
      await choreMasterAPIAgent.delete(`/v1/finance/assets/${assetReference}`, {
        onError: () => {
          enqueueNotification(`Unable to delete asset now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          fetchAssets()
        },
      })
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
          title="資產"
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
              onClick={() => {
                createAssetForm.reset()
                setIsCreateAssetDrawerOpen(true)
              }}
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
                  <NoWrapTableCell>名稱</NoWrapTableCell>
                  <NoWrapTableCell>代號</NoWrapTableCell>
                  <NoWrapTableCell>可結算</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingAssets}
                isEmpty={assets.length === 0}
              >
                {assets.map((asset) => (
                  <TableRow key={asset.reference} hover>
                    <NoWrapTableCell>{asset.name}</NoWrapTableCell>
                    <NoWrapTableCell>{asset.symbol}</NoWrapTableCell>
                    <NoWrapTableCell>
                      {asset.is_settleable ? (
                        <CheckBoxIcon color="disabled" />
                      ) : (
                        <CheckBoxOutlineBlankIcon color="disabled" />
                      )}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip size="small" label={asset.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateAssetForm.setValue('name', asset.name)
                          updateAssetForm.setValue('symbol', asset.symbol)
                          updateAssetForm.setValue(
                            'is_settleable',
                            asset.is_settleable
                          )
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
              </StatefulTableBody>
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
            }}
          >
            <FormControl>
              <Controller
                name="name"
                control={createAssetForm.control}
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
            <FormControl>
              <Controller
                name="is_settleable"
                control={createAssetForm.control}
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
              onClick={createAssetForm.handleSubmit(
                handleSubmitCreateAssetForm
              )}
            >
              新增
            </AutoLoadingButton>
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
            }}
          >
            <FormControl>
              <Controller
                name="name"
                control={updateAssetForm.control}
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
            <FormControl>
              <Controller
                name="is_settleable"
                control={updateAssetForm.control}
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
              onClick={updateAssetForm.handleSubmit(
                handleSubmitUpdateAssetForm
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
