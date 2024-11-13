'use client'

import { useColorScheme } from '@mui/material/styles'
import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highcharts'
import AccessibilityModule from 'highcharts/modules/accessibility'
import HighContrastDark from 'highcharts/themes/high-contrast-dark'
import HighContrastLight from 'highcharts/themes/high-contrast-light'
import React from 'react'
import usePrevious from 'react-use/lib/usePrevious'

if (typeof Highcharts === 'object') {
  AccessibilityModule(Highcharts)
}

export default function HighChartsCore({
  options,
}: {
  options: Highcharts.Options
}) {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null)
  const { mode } = useColorScheme()
  const previousMode = usePrevious(mode)

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
  }, [mode])

  React.useEffect(() => {
    if (mode === 'light') {
      HighContrastLight(Highcharts)
    } else if (mode === 'dark') {
      HighContrastDark(Highcharts)
    }
  }, [])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={mergedOptions}
      ref={chartComponentRef}
    />
  )
}
