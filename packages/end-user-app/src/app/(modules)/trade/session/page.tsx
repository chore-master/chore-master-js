'use client'

import HighChartsHighStock from '@/components/charts/HighChartsHighStock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import DrawIcon from '@mui/icons-material/Draw'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoadingButton from '@mui/lab/LoadingButton'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
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

export default function Page() {
  const uploadSessionForm = useForm<UploadSessionInputs>()
  const [sessionFiles, setSessionFiles] = React.useState<File[]>([])

  const [eventDF, setEventDF] = React.useState<dfd.DataFrame>(
    new dfd.DataFrame()
  )
  const [tradeDF, setTradeDF] = React.useState<dfd.DataFrame>(
    new dfd.DataFrame()
  )
  const [sessionOpenedEventDF, setSessionOpenedEventDF] =
    React.useState<dfd.DataFrame>(new dfd.DataFrame())
  const [quotationUpdatedEventDF, setQuotationUpdatedEventDF] =
    React.useState<dfd.DataFrame>(new dfd.DataFrame())
  const [
    quotationUpdatedEventContextKeys,
    setQuotationUpdatedEventContextKeys,
  ] = React.useState<string[]>([])
  const [isEventVisualized, setIsEventVisualized] = React.useState(false)

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
        name: '權益變化曲線',
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
        name: '累計已實現損益',
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
        name: '當期未實現損益',
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
        name: '當期已實現損益',
        type: 'column',
        color: 'green',
        stack: 'period',
        accessData: (d: any) => [
          new Date(`${d.period_end_datetime_utc}Z`).getTime(),
          d.period_realized_quote_pnl,
        ],
      },
    ])
  console.log(
    'quotationUpdatedEventContextKeys',
    quotationUpdatedEventContextKeys
  )
  const quotationUpdatedEventDatapoints: any = !isEventVisualized
    ? []
    : dfd.toJSON(quotationUpdatedEventDF)
  const tradeDatapoints: any = !isEventVisualized ? [] : dfd.toJSON(tradeDF)
  const settlementReportDatapoints: any = !isEquityVisualized
    ? []
    : dfd.toJSON(settlementReportDF)

  const onSubmitUploadSessionForm: SubmitHandler<UploadSessionInputs> = async (
    data
  ) => {
    setIsEventVisualized(false)
    setIsEquityVisualized(false)
    setSessionFiles(Array.from(data.session_files))

    const eventFile = Array.from(data.session_files).find(
      (file) => file.type === 'text/csv' && file.name === 'event.csv'
    )
    if (eventFile) {
      dfd.readCSV(eventFile).then((eventDF: dfd.DataFrame) => {
        setEventDF(eventDF)
        setSessionOpenedEventDF(
          eventDF.loc({
            rows: eventDF['event_name'].eq('session_opened'),
          })
        )
        const _quotationUpdatedEventDF = eventDF.loc({
          rows: eventDF['event_name'].eq('quotation_updated'),
        })
        setQuotationUpdatedEventDF(_quotationUpdatedEventDF)
        setQuotationUpdatedEventContextKeys(
          Array.from(
            _quotationUpdatedEventDF['event_context'].values.reduce(
              (s: Set<string>, text: any) => {
                const obj = JSON.parse(text)
                Object.entries(obj).forEach(([k, v]) => {
                  if (typeof v !== 'object' && k !== 'updated_datetime_utc') {
                    s.add(k)
                  }
                })
                return s
              },
              new Set<string>()
            )
          )
        )
      })
    }

    const tradeFile = Array.from(data.session_files).find(
      (file) => file.type === 'text/csv' && file.name === 'trade.csv'
    )
    if (tradeFile) {
      dfd.readCSV(tradeFile).then((tradeDF: dfd.DataFrame) => {
        setTradeDF(tradeDF)
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
          {sessionOpenedEventDF.shape[0] > 0 &&
          settlementReportDF.shape[0] > 0 ? (
            <React.Fragment>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">資料集</Typography>
                </AccordionSummary>
                <TableContainer component={AccordionDetails} sx={{ p: 0 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>檔案路徑</TableCell>
                        <TableCell align="right">檔案大小</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sessionFiles.map((file) => (
                        <TableRow key={file.webkitRelativePath}>
                          <TableCell component="th">
                            {file.webkitRelativePath}
                          </TableCell>
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
              </Accordion>

              <Accordion elevation={0} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">基本資訊</Typography>
                </AccordionSummary>
                <TableContainer component={AccordionDetails} sx={{ p: 0 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">欄位</TableCell>
                        <TableCell>值</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(
                        JSON.parse(
                          sessionOpenedEventDF['event_context'].values.at(0)
                        )
                      ).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell component="th" align="right">
                            {key}
                          </TableCell>
                          <TableCell>{value as any}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Accordion>

              <Accordion elevation={0} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">統計</Typography>
                </AccordionSummary>
                <TableContainer component={AccordionDetails} sx={{ p: 0 }}>
                  <Table size="small">
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
                        <TableCell align="right">
                          {settlementReportDF[
                            'period_duration_in_second'
                          ].values.at(-1)}
                        </TableCell>
                        <TableCell>秒</TableCell>
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
                          <Typography color="primary">
                            {settlementReportDF[
                              'historical_realized_quote_pnl'
                            ].values.at(-1)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {settlementReportDF['settlement_symbol'].values.at(
                            -1
                          )}
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
                          {settlementReportDF['settlement_symbol'].values.at(
                            -1
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" align="right">
                          累計最大回撤損失
                        </TableCell>
                        <TableCell align="right">
                          <Typography color="primary">
                            {settlementReportDF[
                              'historical_max_drawdown_quote_balance_amount_change'
                            ].values.at(-1)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {settlementReportDF['settlement_symbol'].values.at(
                            -1
                          )}
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
                          {settlementReportDF['settlement_symbol'].values.at(
                            -1
                          )}
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
                          {settlementReportDF['settlement_symbol'].values.at(
                            -1
                          )}
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
                          {settlementReportDF[
                            'historical_trade_count'
                          ].values.at(-1)}
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
                          {settlementReportDF[
                            'historical_loss_count'
                          ].values.at(-1)}
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
              </Accordion>
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
                  disabled={eventDF.shape[0] === 0}
                  onClick={() => setIsEventVisualized(true)}
                >
                  繪製
                </Button>
                <Button
                  startIcon={<CleaningServicesIcon />}
                  disabled={!isEventVisualized}
                  onClick={() => setIsEventVisualized(false)}
                >
                  清除
                </Button>
              </ButtonGroup>
            </Box>,
          ]}
        />

        <ModuleFunctionBody>
          {isEventVisualized ? (
            <HighChartsHighStock
              series={[
                {
                  id: 'perp_implied_term_ir',
                  type: 'line',
                  name: 'Grid IR',
                  data: quotationUpdatedEventDatapoints.map((d: any) => {
                    const eventContext = JSON.parse(d.event_context)
                    return [
                      new Date(
                        `${eventContext.updated_datetime_utc}Z`
                      ).getTime(),
                      parseFloat(eventContext.perp_implied_term_ir),
                    ]
                  }),
                  tooltip: {
                    valueDecimals: 4,
                  },
                },
                //   {
                //     type: 'flags',
                //     data: logDatapoints
                //       .filter(
                //         (d: any) =>
                //           d.operation === 'take' &&
                //           d.symbol === 'binance_ETH_USDT_USDT_241227'
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
                  shapes: tradeDatapoints
                    .filter(
                      (d: any) =>
                        d.trade_symbol === 'binance_ETH_USDT_USDT_241227'
                    )
                    .map((d: any) => {
                      const tradeContext = JSON.parse(d.trade_context)
                      const x = new Date(`${d.trade_datetime_utc}Z`).getTime()
                      const y = parseFloat(tradeContext.perp_implied_term_ir)
                      let yStart, yEnd, color
                      if (d.trade_side === 'short') {
                        yEnd = y + 0
                        yStart = yEnd + 0.000001
                        color = '#FF0000'
                      } else if (d.trade_side === 'long') {
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
