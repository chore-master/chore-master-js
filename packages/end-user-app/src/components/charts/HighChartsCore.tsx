'use client'

import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highstock'
import React from 'react'

export default function HighChartsCore({
  options,
}: {
  options: Highcharts.Options
}) {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null)
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
  const mergedOptions: Highcharts.Options = {
    ...defaultOptions,
    ...options,
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={mergedOptions}
      ref={chartComponentRef}
    />
  )
}
