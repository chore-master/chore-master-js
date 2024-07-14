'use client'

import { ModuleDataGrid } from '@/components/ModuleDataGrid'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardHeader from '@mui/material/CardHeader'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

type CreateAccountFormInputs = {
  name: string
}

export default function Page() {
  const [accountRows, setAccountRows] = React.useState<GridRowsProp>([])
  const [isLoadingAccountRows, setIsLoadingAccountRows] = React.useState(false)
  const [accountRowModesModel, setAccountRowModesModel] =
    React.useState<GridRowModesModel>({})
  const [isCreateAccountDrawerOpen, setIsCreateAccountDrawerOpen] =
    React.useState(false)
  const [isViewAccountDrawerOpen, setIsViewAccountDrawerOpen] =
    React.useState(false)
  const createAccountForm = useForm<CreateAccountFormInputs>()

  React.useEffect(() => {
    fetchAccountRows()
  }, [])

  const toggleCreateAccountDrawer = (isOpen: boolean) => () => {
    setIsCreateAccountDrawerOpen(isOpen)
  }

  const toggleViewAccountDrawer = (isOpen: boolean) => () => {
    setIsViewAccountDrawerOpen(isOpen)
  }

  const fetchAccountRows = async () => {
    setIsLoadingAccountRows(true)
    await choreMasterAPIAgent.get('/v1/financial_management/accounts', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setAccountRows(data)
      },
    })
    setIsLoadingAccountRows(false)
  }

  const handleSubmitCreateAccountForm: SubmitHandler<
    CreateAccountFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/financial_management/accounts', data, {
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: () => {
        createAccountForm.reset()
        setIsCreateAccountDrawerOpen(false)
        fetchAccountRows()
      },
    })
  }

  const getNewAccountRow = () => {
    return {
      isNew: true,
      reference: uuidv4(),
      name: '',
    }
  }

  const handleViewAccountClick = (reference: GridRowId) => () => {
    console.log('View account', reference)
    setIsViewAccountDrawerOpen(true)
  }

  const handleEditAccountClick = (reference: GridRowId) => () => {
    setAccountRowModesModel({
      ...accountRowModesModel,
      [reference]: { mode: GridRowModes.Edit },
    })
  }

  const handleSaveAccountClick = (reference: GridRowId) => () => {
    setAccountRowModesModel({
      ...accountRowModesModel,
      [reference]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteAccountClick = (reference: GridRowId) => async () => {
    setIsLoadingAccountRows(true)
    await choreMasterAPIAgent.delete(
      `/v1/financial_management/accounts/${reference}`,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          setAccountRows(
            accountRows.filter((row) => row.reference !== reference)
          )
        },
      }
    )
    setIsLoadingAccountRows(false)
  }

  const handleCancelEditAccountClick = (reference: GridRowId) => () => {
    setAccountRowModesModel({
      ...accountRowModesModel,
      [reference]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = accountRows.find((row) => row.reference === reference)
    if (editedRow!.isNew) {
      setAccountRows(accountRows.filter((row) => row.reference !== reference))
    }
  }

  const handleUpsertAccountRow = async ({
    isNew,
    ...upsertedRow
  }: GridRowModel) => {
    setIsLoadingAccountRows(true)
    if (isNew) {
      await choreMasterAPIAgent.post(
        '/v1/financial_management/accounts',
        upsertedRow,
        {
          onFail: ({ message }: any) => {
            alert(message)
          },
          onSuccess: () => {
            setAccountRows(
              accountRows.map((row) =>
                row.reference === upsertedRow.reference ? upsertedRow : row
              )
            )
          },
        }
      )
    } else {
      await choreMasterAPIAgent.patch(
        `/v1/financial_management/accounts/${upsertedRow.reference}`,
        upsertedRow,
        {
          onFail: ({ message }: any) => {
            alert(message)
          },
          onSuccess: () => {
            setAccountRows(
              accountRows.map((row) =>
                row.reference === upsertedRow.reference ? upsertedRow : row
              )
            )
          },
        }
      )
    }
    setIsLoadingAccountRows(false)
    return upsertedRow
  }

  const accountColumns: GridColDef[] = [
    {
      field: 'reference',
      headerName: '識別碼',
      hideSortIcons: true,
      sortable: false,
    },
    {
      field: 'name',
      type: 'string',
      headerName: '名字',
      editable: true,
      flex: 1,
    },
    {
      field: '互動',
      type: 'actions',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode =
          accountRowModesModel[id]?.mode === GridRowModes.Edit
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveAccountClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelEditAccountClick(id)}
              color="inherit"
            />,
          ]
        }
        return [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityIcon />}
            label="View"
            onClick={handleViewAccountClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditAccountClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteAccountClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="帳戶列表"
          actions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={toggleCreateAccountDrawer(true)}
            >
              引導式新增
            </Button>
          }
        />
        <ModuleFunctionBody>
          <ModuleDataGrid
            rows={accountRows}
            columns={accountColumns}
            rowModesModel={accountRowModesModel}
            onRowModesModelChange={setAccountRowModesModel}
            getNewRow={getNewAccountRow}
            setRows={setAccountRows}
            processRowUpdate={handleUpsertAccountRow}
            loading={isLoadingAccountRows}
            getRowId={(row) => row.reference}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <Drawer
        anchor="right"
        open={isViewAccountDrawerOpen}
        onClose={toggleViewAccountDrawer(false)}
      >
        <Box sx={{ minWidth: 320 }}>Coming soon...</Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={isCreateAccountDrawerOpen}
        onClose={toggleCreateAccountDrawer(false)}
      >
        <Box sx={{ minWidth: 320 }}>
          <CardHeader title="新增帳戶" />
          <Stack component="form" spacing={3} p={2} autoComplete="off">
            <FormControl>
              <Controller
                name="name"
                control={createAccountForm.control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="名字"
                    variant="standard"
                  />
                )}
                rules={{ required: '必填' }}
              />
            </FormControl>
          </Stack>
          <Paper elevation={0} sx={{ position: 'sticky', bottom: 0 }}>
            <CardHeader
              action={
                <CardActions>
                  <LoadingButton
                    variant="contained"
                    onClick={createAccountForm.handleSubmit(
                      handleSubmitCreateAccountForm
                    )}
                    loading={createAccountForm.formState.isSubmitting}
                  >
                    新增
                  </LoadingButton>
                </CardActions>
              }
            />
          </Paper>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
