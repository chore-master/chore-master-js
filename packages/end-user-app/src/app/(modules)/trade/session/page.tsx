'use client'

import HighChartsHighStock from '@/components/charts/HighChartsHighStock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import DrawIcon from '@mui/icons-material/Draw'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import * as dfd from 'danfojs'
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

export default function Page() {
  const uploadSessionForm = useForm<UploadSessionInputs>()
  const [sessionFiles, setSessionFiles] = React.useState<File[]>([])
  const [sessionFile, setSessionFile] = React.useState<File>()
  const [reportFile, setReportFile] = React.useState<File>()
  const [sessionDatapoints, setSessionDatapoints] = React.useState<any>([])
  const [report, setReport] = React.useState<Report>()
  const [settlementReportDatapoints, setSettlementReportDatapoints] =
    React.useState<any>([])
  const [settlementReportSeriesConfigs, setSettlementReportSeriesConfigs] =
    React.useState<any>([
      {
        key: 'historical_quote_balance_amount_change',
        isVisible: true,
        name: 'Equity Change',
        type: 'line',
        color: '#17BECF',
        accessData: (d: any) => [
          new Date(`${d.period_end_datetime_utc}Z`).getTime(),
          d.historical_quote_balance_amount_change,
        ],
      },
      {
        key: 'historical_realized_quote_pnl',
        isVisible: true,
        name: 'Historical Realized PnL',
        type: 'column',
        color: '#CCCCCC',
        stack: 'historical',
        accessData: (d: any) => [
          new Date(`${d.period_end_datetime_utc}Z`).getTime(),
          d.historical_realized_quote_pnl,
        ],
      },
      {
        key: 'unrealized_quote_pnl',
        isVisible: true,
        name: 'Unrealized PnL',
        type: 'column',
        color: 'orange',
        stack: 'historical',
        accessData: (d: any) => [
          new Date(`${d.period_end_datetime_utc}Z`).getTime(),
          d.unrealized_quote_pnl,
        ],
      },
      {
        key: 'period_realized_quote_pnl',
        isVisible: true,
        name: 'Realized PnL',
        type: 'column',
        color: 'green',
        stack: 'period',
        accessData: (d: any) => [
          new Date(`${d.period_end_datetime_utc}Z`).getTime(),
          d.period_realized_quote_pnl,
        ],
      },
    ])

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

  const cleanSession = () => {
    setSessionDatapoints([])
  }

  const drawSession = () => {
    if (sessionFile) {
      dfd.readCSV(sessionFile).then((sessionDf: dfd.DataFrame) => {
        sessionDf.addColumn(
          'parsedContext',
          Array.from(sessionDf['context'].values).map((v: any) =>
            v ? JSON.parse(v) : null
          ),
          { inplace: true }
        )
        const datapoints: any = dfd.toJSON(sessionDf)
        setSessionDatapoints(datapoints)
      })
    }
  }

  const cleanReport = () => {
    setSettlementReportDatapoints([])
    setReport(undefined)
  }

  const drawReport = () => {
    if (reportFile) {
      dfd.readCSV(reportFile).then((reportDf: dfd.DataFrame) => {
        const allPeriodReportDf = reportDf.loc({
          rows: reportDf['all_period_symbol'].eq('USDT'),
        })
        const settlementReportDf = reportDf.loc({
          rows: reportDf['settlement_symbol'].apply((v: any) => v !== null),
        })
        setSettlementReportDatapoints(dfd.toJSON(settlementReportDf))
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
    }
  }

  const updateSettlementReportSeriesConfig = (key: string, update: any) => {
    const configIndex = settlementReportSeriesConfigs.findIndex(
      (cfg: any) => cfg.key === key
    )
    if (configIndex !== -1) {
      setSettlementReportSeriesConfigs([
        ...settlementReportSeriesConfigs.slice(0, configIndex),
        {
          ...settlementReportSeriesConfigs[configIndex],
          ...update,
        },
        ...settlementReportSeriesConfigs.slice(configIndex + 1),
      ])
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
                <Tooltip title="清除">
                  <IconButton onClick={cleanSession}>
                    <CleaningServicesIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="繪製">
                  <IconButton color="success" onClick={drawSession}>
                    <DrawIcon />
                  </IconButton>
                </Tooltip>
              </Box>,
            ]}
          />
          {sessionDatapoints.length > 0 && (
            <ModuleFunctionBody>
              <HighChartsHighStock
                series={[
                  {
                    type: 'line',
                    name: 'Grid IR',
                    data: sessionDatapoints
                      .filter((d: any) => d.symbol === 'ETH/USDT:USDT-240927')
                      .map((d: any) => [
                        new Date(`${d.datetime_utc}Z`).getTime(),
                        parseFloat(d.parsedContext.perp_implied_term_ir),
                      ]),
                    tooltip: {
                      valueDecimals: 4,
                    },
                  },
                ]}
                annotations={[
                  {
                    shapes: sessionDatapoints
                      .filter(
                        (d: any) =>
                          d.operation === 'take' &&
                          d.symbol === 'ETH/USDT:USDT-240927'
                      )
                      .map((d: any) => {
                        const x = new Date(`${d.datetime_utc}Z`).getTime()
                        const y = parseFloat(
                          d.parsedContext.perp_implied_term_ir
                        )
                        let yStart, yEnd, color
                        if (d.side === 'short') {
                          yEnd = y + 0
                          yStart = yEnd + 0.000001
                          color = '#FF0000'
                        } else if (d.side === 'long') {
                          yEnd = y - 0
                          yStart = yEnd - 0.000001
                          color = '#00FF00'
                        }
                        return {
                          type: 'path',
                          points: [
                            {
                              x,
                              y: yStart,
                              xAxis: 0,
                              yAxis: 0,
                            },
                            {
                              x,
                              y: yEnd,
                              xAxis: 0,
                              yAxis: 0,
                            },
                          ],
                          stroke: color,
                          fill: color,
                          width: 1,
                          markerEnd: 'arrow',
                        }
                      }),
                  },
                ]}
              />
            </ModuleFunctionBody>
          )}
        </ModuleFunction>
      ) : null}

      {reportFile ? (
        <ModuleFunction>
          <ModuleFunctionHeader
            title="表現"
            actions={[
              <Box key="execute">
                <Tooltip title="清除">
                  <IconButton onClick={cleanReport}>
                    <CleaningServicesIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="繪製">
                  <IconButton color="success" onClick={drawReport}>
                    <DrawIcon />
                  </IconButton>
                </Tooltip>
              </Box>,
            ]}
          />
          {report && (
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

              <HighChartsHighStock
                series={settlementReportSeriesConfigs
                  .filter((cfg: any) => cfg.isVisible)
                  .map((cfg: any) => ({
                    name: cfg.name,
                    type: cfg.type,
                    color: cfg.color,
                    // stacking: cfg.stacking,
                    stack: cfg.stack,
                    data: settlementReportDatapoints.map(cfg.accessData),
                    tooltip: {
                      valueDecimals: 2,
                    },
                  }))}
              />

              <Stack
                direction="row"
                p={2}
                sx={{
                  flexWrap: 'wrap',
                }}
              >
                {settlementReportSeriesConfigs.map((cfg: any) => (
                  <Box key={cfg.key} sx={{ p: 0.5 }}>
                    <Chip
                      key={cfg.key}
                      label={cfg.name}
                      size="small"
                      avatar={
                        <svg>
                          <circle r="9" cx="9" cy="9" fill={cfg.color} />
                        </svg>
                      }
                      onClick={() => {
                        updateSettlementReportSeriesConfig(cfg.key, {
                          isVisible: !cfg.isVisible,
                        })
                      }}
                      variant={cfg.isVisible ? undefined : 'outlined'}
                    />
                  </Box>
                ))}
              </Stack>
            </ModuleFunctionBody>
          )}
        </ModuleFunction>
      ) : null}
    </React.Fragment>
  )
}
