'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import CodeBlock from '@/components/CodeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { NoWrapTableCell, StatefulTableBody } from '@/components/Table'
import { integrationResourceDiscriminators } from '@/constants'
import type {
  CreateResourceFormInputs,
  Resource,
  UpdateResourceFormInputs,
} from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [resources, setResources] = React.useState<Resource[]>([])
  const [isFetchingResources, setIsFetchingResources] = React.useState(false)
  const [isCreateResourceDrawerOpen, setIsCreateResourceDrawerOpen] =
    React.useState(false)
  const [editingResourceReference, setEditingResourceReference] =
    React.useState<string>()
  const createResourceForm = useForm<CreateResourceFormInputs>()
  const updateResourceForm = useForm<UpdateResourceFormInputs>()

  const fetchResources = React.useCallback(async () => {
    setIsFetchingResources(true)
    await choreMasterAPIAgent.get('/v1/integration/end_users/me/resources', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch resources now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setResources(data)
      },
    })
    setIsFetchingResources(false)
  }, [enqueueNotification])

  const handleSubmitCreateResourceForm: SubmitHandler<
    CreateResourceFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post(
      '/v1/integration/end_users/me/resources',
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to create resource now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          createResourceForm.reset()
          fetchResources()
          setIsCreateResourceDrawerOpen(false)
        },
      }
    )
  }

  const handleSubmitUpdateResourceForm: SubmitHandler<
    UpdateResourceFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      `/v1/integration/end_users/me/resources/${editingResourceReference}`,
      data,
      {
        onError: () => {
          enqueueNotification(`Unable to update resource now.`, 'error')
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: () => {
          updateResourceForm.reset()
          fetchResources()
          setEditingResourceReference(undefined)
        },
      }
    )
  }

  const deleteResource = React.useCallback(
    async (resourceReference: string) => {
      const isConfirmed = confirm('此操作執行後無法復原，確定要繼續嗎？')
      if (!isConfirmed) {
        return
      }
      await choreMasterAPIAgent.delete(
        `/v1/integration/end_users/me/resources/${resourceReference}`,
        {
          onError: () => {
            enqueueNotification(`Unable to delete resource now.`, 'error')
          },
          onFail: ({ message }: any) => {
            enqueueNotification(message, 'error')
          },
          onSuccess: () => {
            fetchResources()
          },
        }
      )
    },
    [enqueueNotification, fetchResources]
  )

  React.useEffect(() => {
    void fetchResources()
  }, [fetchResources])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="資源"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchResources}
                  disabled={isFetchingResources}
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
                createResourceForm.reset()
                setIsCreateResourceDrawerOpen(true)
              }}
            >
              新增
            </Button>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingResources}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <NoWrapTableCell>名字</NoWrapTableCell>
                  <NoWrapTableCell>鑑別器</NoWrapTableCell>
                  <NoWrapTableCell>值</NoWrapTableCell>
                  <NoWrapTableCell>系統識別碼</NoWrapTableCell>
                  <NoWrapTableCell align="right">操作</NoWrapTableCell>
                </TableRow>
              </TableHead>
              <StatefulTableBody
                isLoading={isFetchingResources}
                isEmpty={resources.length === 0}
              >
                {resources.map((integration) => (
                  <TableRow key={integration.reference} hover>
                    <NoWrapTableCell>{integration.name}</NoWrapTableCell>
                    <NoWrapTableCell>
                      {integration.discriminator}
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <CodeBlock
                        language="json"
                        code={JSON.stringify(integration.value, null, 2)}
                      />
                    </NoWrapTableCell>
                    <NoWrapTableCell>
                      <Chip size="small" label={integration.reference} />
                    </NoWrapTableCell>
                    <NoWrapTableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          updateResourceForm.setValue('name', integration.name)
                          updateResourceForm.setValue(
                            'discriminator',
                            integration.discriminator
                          )
                          updateResourceForm.setValue(
                            'value',
                            JSON.stringify(integration.value)
                          )
                          setEditingResourceReference(integration.reference)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          void deleteResource(integration.reference)
                        }
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

        <ModuleFunctionBody>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Stack spacing={1} direction="row" alignItems="center">
                <InfoOutlinedIcon fontSize="small" />
                <Typography>範本</Typography>
              </Stack>
            </AccordionSummary>
            <TableContainer component={AccordionDetails}>
              <Table>
                <TableHead>
                  <TableRow>
                    <NoWrapTableCell>鑑別器</NoWrapTableCell>
                    <NoWrapTableCell>值</NoWrapTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <NoWrapTableCell>coingecko_feed</NoWrapTableCell>
                    <NoWrapTableCell>
                      <CodeBlock
                        language="json"
                        code={JSON.stringify({}, null, 2)}
                      />
                    </NoWrapTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Accordion>
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
        anchor="right"
        open={isCreateResourceDrawerOpen}
        onClose={() => {
          setIsCreateResourceDrawerOpen(false)
        }}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增資源" />
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
                control={createResourceForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名稱"
                    variant="filled"
                    size="small"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <Controller
              name="discriminator"
              control={createResourceForm.control}
              defaultValue=""
              render={({ field }) => (
                <FormControl required fullWidth size="small" variant="filled">
                  <InputLabel>鑑別器</InputLabel>
                  <Select {...field}>
                    {integrationResourceDiscriminators.map((discriminator) => (
                      <MenuItem key={discriminator} value={discriminator}>
                        {discriminator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <FormControl>
              <Controller
                name="value"
                control={createResourceForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    multiline
                    minRows={3}
                    maxRows={20}
                    size="small"
                    label="值"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              onClick={createResourceForm.handleSubmit(
                handleSubmitCreateResourceForm
              )}
            >
              新增
            </AutoLoadingButton>
          </Stack>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={!!editingResourceReference}
        onClose={() => {
          setEditingResourceReference(undefined)
        }}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="編輯資源" />
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
                control={updateResourceForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名稱"
                    variant="filled"
                    size="small"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <Controller
              name="discriminator"
              control={updateResourceForm.control}
              defaultValue=""
              render={({ field }) => (
                <FormControl required fullWidth size="small" variant="filled">
                  <InputLabel>鑑別器</InputLabel>
                  <Select {...field}>
                    {integrationResourceDiscriminators.map((discriminator) => (
                      <MenuItem key={discriminator} value={discriminator}>
                        {discriminator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <FormControl>
              <Controller
                name="value"
                control={updateResourceForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    multiline
                    minRows={3}
                    maxRows={20}
                    size="small"
                    label="值"
                    variant="filled"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
            <AutoLoadingButton
              type="submit"
              variant="contained"
              onClick={updateResourceForm.handleSubmit(
                handleSubmitUpdateResourceForm
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
