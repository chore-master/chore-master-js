'use client'

import SessionChart from '@/components/charts/SessionChart'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LoadingButton from '@mui/lab/LoadingButton'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Papa, { ParseResult } from 'papaparse'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type UploadSessionInputs = {
  session_files: FileList
}

const readCSV = (file: File) => {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'text/csv') {
      reject(new Error('File is not a CSV'))
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const csvText = event.target?.result as string
      Papa.parse(csvText, {
        header: true,
        complete: (result: ParseResult<any>) => {
          resolve(result.data)
        },
        error: (error: any) => {
          reject(`Error parsing CSV: ${error}`)
        },
      })
    }
    reader.readAsText(file)
  })
}

export default function Page() {
  const uploadSessionForm = useForm<UploadSessionInputs>()
  const [sessionFiles, setSessionFiles] = React.useState<File[]>([])
  const [sessionFile, setSessionFile] = React.useState<File>()
  const [reportFile, setReportFile] = React.useState<File>()
  const [datapoints, setDatapoints] = React.useState<any>([])

  const onSubmitUploadSessionForm: SubmitHandler<UploadSessionInputs> = async (
    data
  ) => {
    setSessionFiles(Array.from(data.session_files))
    setSessionFile(
      Array.from(data.session_files).find(
        (file) => file.type === 'text/csv' && file.name === 'session.csv'
      )
    )
    setReportFile(
      Array.from(data.session_files).find(
        (file) =>
          file.type === 'text/csv' && file.name === 'incremental_report.csv'
      )
    )
    uploadSessionForm.reset()
  }

  const executeSession = () => {
    if (sessionFile) {
      readCSV(sessionFile).then((rows: any) => {
        setDatapoints(
          rows
            .filter((row: any) => {
              if (!row.context) {
                return false
              }
              if (
                row.operation === 'take' &&
                row.symbol !== 'ETH/USDT:USDT-240927'
              ) {
                return false
              }
              return true
            })
            .map((row: any) => {
              const context = JSON.parse(row.context)
              return {
                timeUTC: row.datetime_utc,
                value: context.order_perp_implied_term_ir
                  ? context.order_perp_implied_term_ir
                  : null,
                side: row.side,
              }
            })
        )
      })
    }
  }

  const executeReport = () => {
    if (reportFile) {
      readCSV(reportFile).then((rows: any) => {
        console.log(rows)
      })
    }
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="檔案匯入" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={uploadSessionForm.control}
                name="session_files"
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <React.Fragment>
                    <Typography>匯入執行階段資料夾</Typography>
                    <input
                      multiple
                      type="file"
                      {...{ webkitdirectory: '' }}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      name={field.name}
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </React.Fragment>
                )}
              />
              <LoadingButton
                variant="contained"
                onClick={uploadSessionForm.handleSubmit(
                  onSubmitUploadSessionForm
                )}
                loading={uploadSessionForm.formState.isSubmitting}
                disabled={
                  !uploadSessionForm.formState.isDirty ||
                  !uploadSessionForm.formState.isValid
                }
              >
                套用
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>

        {sessionFiles.length > 0 && (
          <ModuleFunctionBody>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                <Stack spacing={1} direction="row" alignItems="center">
                  <InfoOutlinedIcon fontSize="small" />
                  <Typography>套用檔案</Typography>
                </Stack>
              </AccordionSummary>
              <TableContainer component={AccordionDetails}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>檔案名稱</TableCell>
                      <TableCell>檔案大小</TableCell>
                      <TableCell>檔案路徑</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessionFiles.map((file) => (
                      <TableRow key={file.webkitRelativePath}>
                        <TableCell component="th" scope="row">
                          {file.name}
                        </TableCell>
                        <TableCell>
                          {file.size < 1024
                            ? `${file.size} bytes`
                            : file.size < 1024 * 1024
                            ? `${Math.round(file.size / 1024)} KB`
                            : `${Math.round(file.size / 1024 / 1024)} MB`}
                        </TableCell>
                        <TableCell>{file.webkitRelativePath}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Accordion>
          </ModuleFunctionBody>
        )}
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader
          title="交易明細"
          actions={[
            <Box key="execute">
              <IconButton color="success" onClick={executeSession}>
                <PlayArrowIcon />
              </IconButton>
            </Box>,
          ]}
        />
        <ModuleFunctionBody>
          <SessionChart
            layout={{
              width: '100%',
              height: 600,
              marginTop: 48,
              marginLeft: 48,
              marginRight: 48,
              minWidth: 480,
            }}
            datapoints={datapoints}
          />
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader
          title="報告"
          actions={[
            <Box key="execute">
              <IconButton color="success" onClick={executeReport}>
                <PlayArrowIcon />
              </IconButton>
            </Box>,
          ]}
        />
        <ModuleFunctionBody>TBD.</ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
