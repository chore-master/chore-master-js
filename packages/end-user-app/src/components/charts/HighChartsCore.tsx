'use client'

import { useColorScheme } from '@mui/material/styles'
import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highcharts'
import AccessibilityModule from 'highcharts/modules/accessibility'
import NetworkGraphModule from 'highcharts/modules/networkgraph'
// import HighContrastDark from 'highcharts/themes/high-contrast-dark'
// import HighContrastLight from 'highcharts/themes/high-contrast-light'
import { merge } from 'lodash'
import React from 'react'
import { usePrevious } from 'react-use'
import { darkThemeOptions, lightThemeOptions } from './highchartsOptions'

if (typeof Highcharts === 'object') {
  AccessibilityModule(Highcharts)
  NetworkGraphModule(Highcharts)
}

export default function HighChartsCore({
  options,
  callback,
}: {
  options: Highcharts.Options
  callback?: (chart: Highcharts.Chart) => void
}) {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null)
  const [chart, setChart] = React.useState<Highcharts.Chart | null>(null)
  const { mode } = useColorScheme()
  const previousMode = usePrevious(mode)
  const [forceUpdate, setForceUpdate] = React.useState(0)

  const defaultOptions = {
    title: {
      text: '',
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
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
      setChart(chart)
      callback?.(chart)
    },
    [callback]
  )

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
      ref={chartComponentRef}
      highcharts={Highcharts}
      options={mergedOptions}
      callback={_callback}
    />
  )
}
