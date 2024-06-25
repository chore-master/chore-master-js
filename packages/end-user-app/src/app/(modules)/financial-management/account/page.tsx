'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
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
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

const columns: GridColDef[] = [{ field: 'name', headerName: '名字' }]

type CreateAccountFormInputs = {
  name: string
}

export default function Page() {
  const [rows, setRows] = React.useState([])
  const [isCreateAccountDrawerOpen, setIsCreateAccountDrawerOpen] =
    React.useState(false)
  const createAccountForm = useForm<CreateAccountFormInputs>()

  React.useEffect(() => {
    fetchRows()
  }, [])

  const toggleCreateAccountDrawer =
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      setIsCreateAccountDrawerOpen(isOpen)
    }

  const fetchRows = async () => {
    choreMasterAPIAgent.get('/v1/financial_management/accounts', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        setRows(data)
      },
    })
  }

  const onSubmitCreateAccountForm: SubmitHandler<
    CreateAccountFormInputs
  > = async (data) => {
    await choreMasterAPIAgent.post('/v1/financial_management/accounts', data, {
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: () => {
        createAccountForm.reset()
        setIsCreateAccountDrawerOpen(false)
        fetchRows()
      },
    })
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="帳戶列表"
          actions={
            <Button
              variant="contained"
              onClick={toggleCreateAccountDrawer(true)}
            >
              新增
            </Button>
          }
        />
        <ModuleFunctionBody>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.reference}
            autoHeight
          />
        </ModuleFunctionBody>
      </ModuleFunction>

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
                      onSubmitCreateAccountForm
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
