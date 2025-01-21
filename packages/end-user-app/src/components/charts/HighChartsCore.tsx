'use client'

import { useColorScheme } from '@mui/material/styles'
import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highcharts'
import AccessibilityModule from 'highcharts/modules/accessibility'
import NetworkGraphModule from 'highcharts/modules/networkgraph'
import HighContrastDark from 'highcharts/themes/high-contrast-dark'
import HighContrastLight from 'highcharts/themes/high-contrast-light'
import React from 'react'
import usePrevious from 'react-use/lib/usePrevious'

if (typeof Highcharts === 'object') {
  AccessibilityModule(Highcharts)
  NetworkGraphModule(Highcharts)
}

const modeToThemeMap = {
  light: {
    colors: [
      '#265FB5',
      '#222',
      '#698F01',
      '#F4693E',
      '#4C0684',
      '#0FA388',
      '#B7104A',
      '#AF9023',
      '#1A704C',
      '#B02FDD',
    ],
    credits: { style: { color: '#767676' } },
    navigator: { series: { color: '#5f98cf', lineColor: '#5f98cf' } },
  },
  dark: {
    colors: [
      '#67B9EE',
      '#CEEDA5',
      '#9F6AE1',
      '#FEA26E',
      '#6BA48F',
      '#EA3535',
      '#8D96B7',
      '#ECCA15',
      '#20AA09',
      '#E0C3E4',
    ],
    chart: { backgroundColor: '#1f1f20', plotBorderColor: '#606063' },
    title: { style: { color: '#F0F0F3' } },
    subtitle: { style: { color: '#F0F0F3' } },
    xAxis: {
      gridLineColor: '#707073',
      labels: { style: { color: '#F0F0F3' } },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: { style: { color: '#F0F0F3' } },
    },
    yAxis: {
      gridLineColor: '#707073',
      labels: { style: { color: '#F0F0F3' } },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: { style: { color: '#F0F0F3' } },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: { color: '#F0F0F3' },
    },
    plotOptions: {
      series: {
        dataLabels: { color: '#F0F0F3' },
        marker: { lineColor: '#333' },
      },
      boxplot: { fillColor: '#505053' },
      candlestick: { lineColor: 'white' },
      errorbar: { color: 'white' },
      map: { nullColor: '#353535' },
    },
    legend: {
      backgroundColor: 'transparent',
      itemStyle: { color: '#F0F0F3' },
      itemHoverStyle: { color: '#FFF' },
      itemHiddenStyle: { color: '#606063' },
      title: { style: { color: '#D0D0D0' } },
    },
    credits: { style: { color: '#F0F0F3' } },
    drilldown: {
      activeAxisLabelStyle: { color: '#F0F0F3' },
      activeDataLabelStyle: { color: '#F0F0F3' },
    },
    navigation: {
      buttonOptions: { symbolStroke: '#DDDDDD', theme: { fill: '#505053' } },
    },
    rangeSelector: {
      buttonTheme: {
        fill: '#505053',
        stroke: '#000000',
        style: { color: '#eee' },
        states: {
          hover: {
            fill: '#707073',
            stroke: '#000000',
            style: { color: '#F0F0F3' },
          },
          select: {
            fill: '#303030',
            stroke: '#101010',
            style: { color: '#F0F0F3' },
          },
        },
      },
      inputBoxBorderColor: '#505053',
      inputStyle: { backgroundColor: '#333', color: '#F0F0F3' },
      labelStyle: { color: '#F0F0F3' },
    },
    navigator: {
      handles: { backgroundColor: '#666', borderColor: '#AAA' },
      outlineColor: '#CCC',
      maskFill: 'rgba(180,180,255,0.2)',
      series: { color: '#7798BF', lineColor: '#A6C7ED' },
      xAxis: { gridLineColor: '#505053' },
    },
    scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043',
    },
  },
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

  const mergedOptions: Highcharts.Options = Object.assign(
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

  React.useEffect(() => {
    if (previousMode && previousMode !== mode) {
      const isConfirmed = confirm(
        '必須重新載入頁面以完整切換圖表主題，確定要繼續嗎？'
      )
      if (!isConfirmed) {
        return
      }
      window.location.reload()
    }
  }, [mode, previousMode])

  React.useEffect(() => {
    if (previousMode !== mode) {
      if (mode === 'light') {
        HighContrastLight(Highcharts)
      } else if (mode === 'dark') {
        HighContrastDark(Highcharts)
      }
    }
  }, [mode, previousMode])

  return (
    <HighchartsReact
      ref={chartComponentRef}
      highcharts={Highcharts}
      options={mergedOptions}
      callback={_callback}
    />
  )
}
