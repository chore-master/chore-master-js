'use client'

// import * as Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highstock'
import AccessibilityModule from 'highcharts/modules/accessibility'
import AnnotationsModule from 'highcharts/modules/annotations'
import React from 'react'

if (typeof Highcharts === 'object') {
  AccessibilityModule(Highcharts)
  AnnotationsModule(Highcharts)
}

export default function HighChartsHighStock({
  series,
  annotations,
  plotOptions,
}: {
  series: Highcharts.SeriesOptionsType[]
  annotations?: Highcharts.AnnotationsOptions[]
  plotOptions?: Highcharts.PlotOptions
}) {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null)
  const options: Highcharts.Options = {
    rangeSelector: {
      selected: 3, // Pre-selects one of the range buttons
      buttons: [
        {
          type: 'month',
          count: 1,
          text: '1M',
        },
        {
          type: 'month',
          count: 3,
          text: '3M',
        },
        {
          type: 'year',
          count: 1,
          text: '1Y',
        },
        {
          type: 'all',
          text: 'All',
        },
      ],
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      },
      ...plotOptions,
    },
    series: series,
    annotations: annotations,
    credits: {
      enabled: false,
    },
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={options}
      ref={chartComponentRef}
    />
  )
}
