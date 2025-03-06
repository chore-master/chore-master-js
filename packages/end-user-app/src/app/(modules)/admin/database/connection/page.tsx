/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type DatabaseConnectionInputs = {
  relational_database_origin: string
  relational_database_schema_name?: string
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isFetchingDatabaseConnection, setIsFetchingDatabaseConnection] =
    React.useState(true)
  const databaseConnectionForm = useForm<DatabaseConnectionInputs>()

  const fetchDatabaseConnection = async () => {
    setIsFetchingDatabaseConnection(true)
    await choreMasterAPIAgent.get('/v1/admin/user_database/connection', {
      params: {},
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        databaseConnectionForm.reset({
          relational_database_origin: data.relational_database_origin || '',
          relational_database_schema_name:
            data.relational_database_schema_name || '',
        })
      },
    })
    setIsFetchingDatabaseConnection(false)
  }

  const onSubmitDatabaseConnectionForm: SubmitHandler<
    DatabaseConnectionInputs
  > = async (data) => {
    await choreMasterAPIAgent.patch(
      '/v1/admin/user_database/connection',
      data,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchDatabaseConnection()
        },
      }
    )
  }

  React.useEffect(() => {
    fetchDatabaseConnection()
  }, [])

  return (
    <ModuleFunction>
      <ModuleFunctionHeader title="連線" />
      <ModuleFunctionBody loading={isFetchingDatabaseConnection}>
        <Box p={2}>
          <Typography mb={3}>
            Chore Master
            使用關聯式資料庫來儲存此帳戶產生的資料，您必須完成此設定才能使用完整服務。
          </Typography>
          <Stack component="form" spacing={3} autoComplete="off">
            <Controller
              control={databaseConnectionForm.control}
              name="relational_database_origin"
              defaultValue=""
              rules={{ required: '必填' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="連線字串"
                  variant="standard"
                />
              )}
            />
            <Controller
              control={databaseConnectionForm.control}
              name="relational_database_schema_name"
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="綱要" variant="standard" />
              )}
            />
            <AutoLoadingButton
              variant="contained"
              onClick={databaseConnectionForm.handleSubmit(
                onSubmitDatabaseConnectionForm
              )}
            >
              儲存
            </AutoLoadingButton>
          </Stack>
        </Box>
      </ModuleFunctionBody>
      <ModuleFunctionBody>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Stack spacing={1} direction="row" alignItems="center">
              <InfoOutlinedIcon fontSize="small" />
              <Typography>連線範本</Typography>
            </Stack>
          </AccordionSummary>
          <TableContainer component={AccordionDetails}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>資料庫服務</TableCell>
                  <TableCell>範例連線字串</TableCell>
                  <TableCell>範例綱要</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {'SQLite'}
                  </TableCell>
                  <TableCell>
                    <pre>{'sqlite+aiosqlite:///./local.db'}</pre>
                  </TableCell>
                  <TableCell>{'（不支援）'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {'PostgreSQL'}
                  </TableCell>
                  <TableCell>
                    <pre>
                      {'postgresql+asyncpg://user:password@postgresserver/db'}
                    </pre>
                  </TableCell>
                  <TableCell>
                    <pre>{'public'}</pre>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Accordion>
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
