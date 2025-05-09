'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { TablePagination } from '@/components/Pagination'
import PlaceholderTypography from '@/components/PlaceholderTypography'
import ReferenceBlock from '@/components/ReferenceBlock'
import SidePanel, { useSidePanel } from '@/components/SidePanel'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { useOffsetPagination } from '@/hooks/useOffsetPagination'
import type {
  Asset,
  CreateAssetFormInputs,
  UpdateAssetFormInputs,
} from '@/types/finance'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
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
import { useTranslations } from 'next-intl'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const t = useTranslations('modules.finance.pages.assets')
  const tGlobal = useTranslations('global')
  const sidePanel = useSidePanel()

  // Asset
  const [assets, setAssets] = React.useState<Asset[]>([])
  const assetsPagination = useOffsetPagination({})
  const [isFetchingAssets, setIsFetchingAssets] = React.useState(false)
  const createAssetForm = useForm<CreateAssetFormInputs>()
  const [editingAssetReference, setEditingAssetReference] =
    React.useState<string>()
  const updateAssetForm = useForm<UpdateAssetFormInputs>()

  const fetchAssets = React.useCallback(async () => {
    setIsFetchingAssets(true)
    await choreMasterAPIAgent.get('/v1/finance/users/me/assets', {
      params: {
        offset: assetsPagination.offset,
        limit: assetsPagination.rowsPerPage,
      },
      onError: () => {
        enqueueNotification(`Unable to fetch assets now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({
        data,
        metadata,
      }: {
        data: Asset[]
        metadata: any
      }) => {
        setAssets(data)
        assetsPagination.setCount(metadata.offset_pagination.count)
      },
    })
    setIsFetchingAssets(false)
  }, [assetsPagination.offset, assetsPagination.rowsPerPage])

  const handleSubmitCreateAssetForm: SubmitHandler<
    CreateAssetFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/finance/users/me/assets', data, {
      onError: () => {
        enqueueNotification(`Unable to create asset now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: () => {
        sidePanel.close()
        createAssetForm.reset()
        fetchAssets()
      },
    })
  }

  const handleSubmitUpdateAssetForm: SubmitHandler<
    UpdateAssetFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/finance/users/me/assets/${editingAssetReference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update asset now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          sidePanel.close()
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
        `/v1/finance/users/me/assets/${assetReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete asset now.`, 'error')
          },
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
    <ModuleFunction>
      <ModuleFunctionHeader
        title={t('titles.asset')}
        actions={[
          <Tooltip key="refresh" title={tGlobal('refresh')}>
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
              sidePanel.open('createAsset')
            }}
          >
            {t('buttons.create')}
          </Button>,
        ]}
      />
      <ModuleFunctionBody loading={isFetchingAssets}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <NoWrapTableCell align="right">
                  <PlaceholderTypography>#</PlaceholderTypography>
                </NoWrapTableCell>
                <NoWrapTableCell>{t('tables.headers.name')}</NoWrapTableCell>
                <NoWrapTableCell>{t('tables.headers.symbol')}</NoWrapTableCell>
                <NoWrapTableCell align="right">
                  {t('tables.headers.decimalPlaces')}
                </NoWrapTableCell>
                <NoWrapTableCell>
                  {t('tables.headers.isSettleable')}
                </NoWrapTableCell>
                <NoWrapTableCell>
                  {t('tables.headers.reference')}
                </NoWrapTableCell>
                <NoWrapTableCell align="right">
                  {t('tables.headers.action')}
                </NoWrapTableCell>
              </TableRow>
            </TableHead>
            <StatefulTableBody
              isLoading={isFetchingAssets}
              isEmpty={assets.length === 0}
            >
              {assets.map((asset, index) => (
                <TableRow key={asset.reference} hover>
                  <NoWrapTableCell align="right">
                    <PlaceholderTypography>
                      {assetsPagination.offset + index + 1}
                    </PlaceholderTypography>
                  </NoWrapTableCell>
                  <NoWrapTableCell>{asset.name}</NoWrapTableCell>
                  <NoWrapTableCell>{asset.symbol}</NoWrapTableCell>
                  <NoWrapTableCell align="right">
                    {asset.decimals}
                  </NoWrapTableCell>
                  <NoWrapTableCell>
                    {asset.is_settleable ? (
                      <CheckBoxIcon color="disabled" />
                    ) : (
                      <CheckBoxOutlineBlankIcon color="disabled" />
                    )}
                  </NoWrapTableCell>
                  <NoWrapTableCell>
                    <ReferenceBlock
                      label={asset.reference}
                      primaryKey
                      monospace
                    />
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
                        sidePanel.open('editAsset')
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteAsset(asset.reference)}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </NoWrapTableCell>
                </TableRow>
              ))}
            </StatefulTableBody>
          </Table>
        </TableContainer>
        <TablePagination offsetPagination={assetsPagination} />
      </ModuleFunctionBody>

      <SidePanel id="createAsset">
        {/* <AppBar
            position="sticky"
            elevation={0}
            sx={(theme) => ({
              position: 'sticky',
              top: 0,
              backgroundColor: theme.palette.background.default,
            })}
          >
            <Toolbar disableGutters>
              <IconButton
                onClick={() => {
                  moduleLayout.close()
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Typography fontWeight="bold" component="div" color="textPrimary">
                新增資產
              </Typography>
            </Toolbar>
            <Divider />
          </AppBar> */}
        <CardHeader
          title={t('sidePanels.createAsset.title')}
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
          <FormControl>
            <Controller
              name="name"
              control={createAssetForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label={t('sidePanels.createAsset.labels.name')}
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
                  label={t('sidePanels.createAsset.labels.symbol')}
                  variant="filled"
                />
              )}
              rules={{ required: '必填' }}
            />
          </FormControl>
          <FormControl>
            <Controller
              name="decimals"
              control={createAssetForm.control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label={t('sidePanels.createAsset.labels.decimalPlaces')}
                  variant="filled"
                  type="number"
                  helperText={t('sidePanels.createAsset.helperTexts.immutable')}
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
                  label={t('sidePanels.createAsset.labels.isSettleable')}
                  control={<Checkbox {...field} checked={field.value} />}
                />
              )}
            />
          </FormControl>
          <AutoLoadingButton
            type="submit"
            variant="contained"
            disabled={!createAssetForm.formState.isValid}
            onClick={createAssetForm.handleSubmit(handleSubmitCreateAssetForm)}
          >
            {t('sidePanels.createAsset.buttons.create')}
          </AutoLoadingButton>
        </Stack>
      </SidePanel>

      <SidePanel id="editAsset">
        <CardHeader
          title={t('sidePanels.editAsset.title')}
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
          <FormControl>
            <Controller
              name="name"
              control={updateAssetForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label={t('sidePanels.editAsset.labels.name')}
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
                  label={t('sidePanels.editAsset.labels.symbol')}
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
                  label={t('sidePanels.editAsset.labels.isSettleable')}
                  control={<Checkbox {...field} checked={field.value} />}
                />
              )}
            />
          </FormControl>
          <AutoLoadingButton
            type="submit"
            variant="contained"
            disabled={!updateAssetForm.formState.isValid}
            onClick={updateAssetForm.handleSubmit(handleSubmitUpdateAssetForm)}
          >
            {t('sidePanels.editAsset.buttons.update')}
          </AutoLoadingButton>
        </Stack>
      </SidePanel>
    </ModuleFunction>
  )
}
