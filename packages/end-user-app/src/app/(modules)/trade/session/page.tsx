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
import * as dfd from 'danfojs'
import Papa, { ParseResult } from 'papaparse'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type UploadSessionInputs = {
  session_files: FileList
}

interface Report {
  realized_pnl?: { value: number; unit: string }
  unrealized_pnl?: { value: number; unit: string }
  max_drawdown?: { value: number; unit: string }
  sharpe_ratio?: { value: number }
}

const readFileText = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    if (!file) {
      reject(new Error('File is empty'))
    }
    // if (!file || file.type !== 'text/csv') {
    //   reject(new Error('File is not a CSV'))
    // }
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target?.result as string)
      // const csvText = event.target?.result as string
      // Papa.parse(csvText, {
      //   header: true,
      //   complete: (result: ParseResult<any>) => {
      //     resolve(result.data)
      //   },
      //   error: (error: any) => {
      //     reject(`Error parsing CSV: ${error}`)
      //   },
      // })
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
  const [report, setReport] = React.useState<Report>()

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
      readFileText(sessionFile).then((text: string) => {
        Papa.parse(text, {
          header: true,
          complete: (result: ParseResult<any>) => {
            const rows = result.data
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
          },
          error: (error: any) => {
            alert(`Error parsing CSV: ${error}`)
          },
        })
      })
    }
  }

  const executeReport = () => {
    if (reportFile) {
      dfd.readCSV(reportFile).then((reportDf: any) => {
        const allPeriodReportDf = reportDf.loc({
          rows: reportDf['all_period_symbol'].eq('USDT'),
        })
        const settlementReportDf = reportDf.loc({
          rows: reportDf['settlement_symbol'].apply((v: any) => v !== null),
        })
        // settlementReportDf.print()
        // const x = settlementReportDf.iloc({
        //   rows: [settlementReportDf.shape[0] - 1],
        // })
        // console.log(x)
        // console.log(x.data)
        // const y = new dfd.Series(x.data[0], {
        //   columns: settlementReportDf.columns,
        // })
        // console.log(y)
        // return
        setReport({
          realized_pnl: {
            value:
              settlementReportDf['historical_realized_quote_pnl'].values.at(-1),
            unit: settlementReportDf['settlement_symbol'].values.at(-1),
          },
          unrealized_pnl: {
            value: settlementReportDf['unrealized_quote_pnl'].values.at(-1),
            unit: settlementReportDf['settlement_symbol'].values.at(-1),
          },
          max_drawdown: {
            value:
              settlementReportDf[
                'historical_max_drawdown_quote_balance_amount_change'
              ].values.at(-1),
            unit: settlementReportDf['settlement_symbol'].values.at(-1),
          },
          sharpe_ratio: {
            value: allPeriodReportDf['sharpe_ratio'].values.at(-1),
          },
        })
      })
      // readFileText(reportFile).then((text: string) => {

      // })
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

      {sessionFile ? (
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
      ) : null}

      {reportFile ? (
        <ModuleFunction>
          <ModuleFunctionHeader
            title="表現"
            actions={[
              <Box key="execute">
                <IconButton color="success" onClick={executeReport}>
                  <PlayArrowIcon />
                </IconButton>
              </Box>,
            ]}
          />
          <ModuleFunctionBody>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">統計量</TableCell>
                    <TableCell align="right">統計值</TableCell>
                    <TableCell>單位</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" align="right">
                      已實現損益
                    </TableCell>
                    <TableCell align="right">
                      {report?.realized_pnl?.value}
                    </TableCell>
                    <TableCell>{report?.realized_pnl?.unit}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="right">
                      未實現損益
                    </TableCell>
                    <TableCell align="right">
                      {report?.unrealized_pnl?.value}
                    </TableCell>
                    <TableCell>{report?.unrealized_pnl?.unit}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="right">
                      最大回撤損失
                    </TableCell>
                    <TableCell align="right">
                      {report?.max_drawdown?.value}
                    </TableCell>
                    <TableCell>{report?.max_drawdown?.unit}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="right">
                      夏普率
                    </TableCell>
                    <TableCell align="right">
                      {report?.sharpe_ratio?.value}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ModuleFunctionBody>
        </ModuleFunction>
      ) : null}
    </React.Fragment>
  )
}
