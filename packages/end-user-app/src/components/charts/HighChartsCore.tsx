'use client'

import { useColorScheme } from '@mui/material/styles'
import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highcharts'
import AccessibilityModule from 'highcharts/modules/accessibility'
import DrilldownModule from 'highcharts/modules/drilldown'
import NetworkGraphModule from 'highcharts/modules/networkgraph'
import SankeyModule from 'highcharts/modules/sankey'
// import HighContrastDark from 'highcharts/themes/high-contrast-dark'
// import HighContrastLight from 'highcharts/themes/high-contrast-light'
import { merge } from 'lodash'
import React from 'react'
import { darkThemeOptions, lightThemeOptions } from './highchartsOptions'

if (typeof Highcharts === 'object') {
  AccessibilityModule(Highcharts)
  NetworkGraphModule(Highcharts)
  SankeyModule(Highcharts)
  DrilldownModule(Highcharts)
}

export default function HighChartsCore({
  options,
  callback,
  style,
}: // onRender,
{
  options: Highcharts.Options
  callback?: (chart: Highcharts.Chart) => void
  // onRender?: (chart: Highcharts.Chart) => void
  style?: React.CSSProperties
}) {
  // const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null)
  // const [chart, setChart] = React.useState<Highcharts.Chart | null>(null)
  const { mode } = useColorScheme()
  // const previousMode = usePrevious(mode)
  // const [forceUpdate, setForceUpdate] = React.useState(0)

  const defaultOptions = {
    // chart: {
    //   events: {
    //     // load: function () {
    //     //   console.log('load', this.series)
    //     // },
    //     // redraw: function () {
    //     //   console.log('redraw', this.series)
    //     // },
    //     render: function () {
    //       onRender?.(this)
    //       // console.log('render', this.series)
    //     },
    //   },
    // },
    title: {
      text: '',
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    time: {
      useUTC: true,
    },
  }
  const mergedOptions: Highcharts.Options = merge(
    {},
    mode === 'light' ? lightThemeOptions : darkThemeOptions,
    defaultOptions,
    options
  )

  const _callback = React.useCallback(
    (chart: Highcharts.Chart) => {
      callback?.(chart)
      // setChart(chart)
    },
    [callback]
  )

  // React.useEffect(() => {
  //   setChart(chart)
  // }, [mergedOptions])

  // React.useEffect(() => {
  //   if (previousMode !== mode) {
  //     if (mode === 'light') {
  //       Highcharts.setOptions(lightThemeOptions)
  //       HighContrastLight(Highcharts)
  //     } else if (mode === 'dark') {
  //       Highcharts.setOptions(darkThemeOptions)
  //       HighContrastDark(Highcharts)
  //     }
  //   }
  // }, [mode, previousMode])

  return (
    <HighchartsReact
      // ref={chartComponentRef}
      highcharts={Highcharts}
      options={mergedOptions}
      callback={_callback}
      containerProps={{
        style,
      }}
    />
  )
}
