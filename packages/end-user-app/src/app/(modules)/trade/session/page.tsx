'use client'

import HighChartsHighStock from '@/components/charts/HighChartsHighStock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import DrawIcon from '@mui/icons-material/Draw'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
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
  // const [report, setReport] = React.useState<Report>()

  const [sessionDF, setSessionDF] = React.useState<dfd.DataFrame>(
    new dfd.DataFrame()
  )
  const [isSessionVisualized, setIsSessionVisualized] = React.useState(false)

  const [allPeriodReportDF, setAllPeriodReportDF] =
    React.useState<dfd.DataFrame>(new dfd.DataFrame())
  const [settlementReportDF, setSettlementReportDF] =
    React.useState<dfd.DataFrame>(new dfd.DataFrame())
  const [isEquityVisualized, setIsEquityVisualized] = React.useState(false)

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

  const sessionDatapoints: any = !isSessionVisualized
    ? []
    : dfd.toJSON(sessionDF)
  const settlementReportDatapoints: any = !isEquityVisualized
    ? []
    : dfd.toJSON(settlementReportDF)

  const onSubmitUploadSessionForm: SubmitHandler<UploadSessionInputs> = async (
    data
  ) => {
    setSessionFiles(Array.from(data.session_files))

    const sessionFile = Array.from(data.session_files).find(
      (file) => file.type === 'text/csv' && file.name === 'session.csv'
    )
    if (sessionFile) {
      dfd.readCSV(sessionFile).then((sessionDF: dfd.DataFrame) => {
        sessionDF.addColumn(
          'parsedContext',
          Array.from(sessionDF['context'].values).map((v: any) =>
            v ? JSON.parse(v) : null
          ),
          { inplace: true }
        )
        setSessionDF(sessionDF)
      })
    }

    const reportFile = Array.from(data.session_files).find(
      (file) =>
        file.type === 'text/csv' && file.name === 'incremental_report.csv'
    )
    if (reportFile) {
      dfd.readCSV(reportFile).then((reportDf: dfd.DataFrame) => {
        const allPeriodReportDf = reportDf.loc({
          rows: reportDf['all_period_symbol'].eq('USDT'),
        })
        setAllPeriodReportDF(allPeriodReportDf)
        const settlementReportDF = reportDf.loc({
          rows: reportDf['settlement_symbol'].apply((v: any) => v !== null),
        })
        setSettlementReportDF(settlementReportDF)
        // setReport({
        //   realized_pnl: {
        //     value:
        //       settlementReportDF['historical_realized_quote_pnl'].values.at(-1),
        //     unit: settlementReportDF['settlement_symbol'].values.at(-1),
        //   },
        //   unrealized_pnl: {
        //     value: settlementReportDF['unrealized_quote_pnl'].values.at(-1),
        //     unit: settlementReportDF['settlement_symbol'].values.at(-1),
        //   },
        //   max_drawdown: {
        //     value:
        //       settlementReportDF[
        //         'historical_max_drawdown_quote_balance_amount_change'
        //       ].values.at(-1),
        //     unit: settlementReportDF['settlement_symbol'].values.at(-1),
        //   },
        //   sharpe_ratio: {
        //     value: allPeriodReportDf['sharpe_ratio'].values.at(-1),
        //   },
        // })
      })
    }
    uploadSessionForm.reset()
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
        <ModuleFunctionHeader title="資料集" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={uploadSessionForm.control}
                name="session_files"
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <React.Fragment>
                    <Typography>匯入資料集</Typography>
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
                匯入
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="報告" />
        <ModuleFunctionBody>
          {settlementReportDF.shape[0] > 0 ? (
            <React.Fragment>
              <Typography variant="h6" sx={{ p: 2 }}>
                資料集
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>檔案路徑</TableCell>
                      {/* <TableCell>檔案名稱</TableCell> */}
                      <TableCell align="right">檔案大小</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessionFiles.map((file) => (
                      <TableRow key={file.webkitRelativePath}>
                        <TableCell component="th">
                          {file.webkitRelativePath}
                        </TableCell>
                        {/* <TableCell component="th" scope="row">
                      {file.name}
                    </TableCell> */}
                        <TableCell align="right">
                          {file.size < 1024
                            ? `${file.size} bytes`
                            : file.size < 1024 * 1024
                            ? `${Math.round(file.size / 1024)} KB`
                            : `${Math.round(file.size / 1024 / 1024)} MB`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h6" sx={{ p: 2, mt: 2 }}>
                統計
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell align="right">統計量</TableCell>
                      <TableCell align="right">統計值</TableCell>
                      <TableCell>單位</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" colSpan={4}>
                        週期
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" rowSpan={2} />
                      <TableCell component="th" align="right">
                        累計期數
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_period_count'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>期</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        每期持續時間
                      </TableCell>
                      <TableCell colSpan={2}>
                        {settlementReportDF['period_duration'].values.at(-1)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" colSpan={4}>
                        截至最末期
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" rowSpan={5} />
                      <TableCell component="th" align="right">
                        累計已實現損益
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_realized_quote_pnl'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>
                        {settlementReportDF['settlement_symbol'].values.at(-1)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        未實現損益
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF['unrealized_quote_pnl'].values.at(
                          -1
                        )}
                      </TableCell>
                      <TableCell>
                        {settlementReportDF['settlement_symbol'].values.at(-1)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        累計最大回撤損失
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_max_drawdown_quote_balance_amount_change'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>
                        {settlementReportDF['settlement_symbol'].values.at(-1)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        累計最大上漲收益
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_max_run_up_quote_balance_amount_change'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>
                        {settlementReportDF['settlement_symbol'].values.at(-1)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        累計交易額度
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_trade_quote_volume'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>
                        {settlementReportDF['settlement_symbol'].values.at(-1)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" colSpan={4}>
                        全期總結
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell rowSpan={7} />
                      <TableCell component="th" align="right">
                        夏普率
                      </TableCell>
                      <TableCell align="right">
                        {allPeriodReportDF['sharpe_ratio'].values.at(-1)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        全商品累計多頭交易次數
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_long_trade_count'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>次</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        全商品累計空頭交易次數
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_short_trade_count'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell>次</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        全商品累計交易次數
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF['historical_trade_count'].values.at(
                          -1
                        )}
                      </TableCell>
                      <TableCell>次</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        全商品累計獲利次數
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF['historical_win_count'].values.at(
                          -1
                        )}
                      </TableCell>
                      <TableCell>次</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        全商品累計損失次數
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF['historical_loss_count'].values.at(
                          -1
                        )}
                      </TableCell>
                      <TableCell>次</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" align="right">
                        全商品累計勝負比
                      </TableCell>
                      <TableCell align="right">
                        {settlementReportDF[
                          'historical_win_loss_ratio'
                        ].values.at(-1)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </React.Fragment>
          ) : (
            <Box p={2}>
              <Typography>尚未匯入資料集</Typography>
            </Box>
          )}
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader
          title="交易明細"
          actions={[
            <Box key="execute">
              <ButtonGroup variant="outlined" size="small">
                <Button
                  variant="contained"
                  startIcon={<DrawIcon />}
                  disabled={sessionDF.shape[0] === 0}
                  onClick={() => setIsSessionVisualized(true)}
                >
                  繪製
                </Button>
                <Button
                  startIcon={<CleaningServicesIcon />}
                  disabled={!isSessionVisualized}
                  onClick={() => setIsSessionVisualized(false)}
                >
                  清除
                </Button>
              </ButtonGroup>
            </Box>,
          ]}
        />

        <ModuleFunctionBody>
          {isSessionVisualized ? (
            <HighChartsHighStock
              series={[
                {
                  id: 'perp_implied_term_ir',
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
                //   {
                //     type: 'flags',
                //     data: sessionDatapoints
                //       .filter(
                //         (d: any) =>
                //           d.operation === 'take' &&
                //           d.symbol === 'ETH/USDT:USDT-240927'
                //       )
                //       .map((d: any) => {
                //         const x = new Date(`${d.datetime_utc}Z`).getTime()
                //         const y = parseFloat(
                //           d.parsedContext.perp_implied_term_ir
                //         )
                //         let yStart, yEnd, color, title
                //         if (d.side === 'short') {
                //           yEnd = y + 0
                //           yStart = yEnd + 0.0001
                //           color = '#FF0000'
                //           title = 'S'
                //         } else if (d.side === 'long') {
                //           yEnd = y - 0
                //           yStart = yEnd - 0.0001
                //           color = '#00FF00'
                //           title = 'L'
                //         }
                //         return {
                //           x,
                //           y: yStart,
                //           color,
                //           fillColor: color,
                //           title,
                //         }
                //       }),
                //     onSeries: 'perp_implied_term_ir',
                //     shape: 'squarepin',
                //     borderRadius: 3,
                //     width: 16,
                //   },
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
                      const y = parseFloat(d.parsedContext.perp_implied_term_ir)
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
          ) : (
            <Box p={2}>
              <Typography>尚未繪製</Typography>
            </Box>
          )}
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader
          title="權益"
          actions={[
            <Box key="execute">
              <ButtonGroup variant="outlined" size="small">
                <Button
                  variant="contained"
                  startIcon={<DrawIcon />}
                  disabled={settlementReportDF.shape[0] === 0}
                  onClick={() => setIsEquityVisualized(true)}
                >
                  繪製
                </Button>
                <Button
                  startIcon={<CleaningServicesIcon />}
                  disabled={!isEquityVisualized}
                  onClick={() => setIsEquityVisualized(false)}
                >
                  清除
                </Button>
              </ButtonGroup>
            </Box>,
          ]}
        />
        <ModuleFunctionBody>
          {isEquityVisualized ? (
            <React.Fragment>
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
            </React.Fragment>
          ) : (
            <Box p={2}>
              <Typography>尚未繪製</Typography>
            </Box>
          )}
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
