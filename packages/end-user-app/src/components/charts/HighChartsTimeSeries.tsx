'use client'

// import * as Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highstock'
import AnnotationsModule from 'highcharts/modules/annotations'
import React from 'react'

if (typeof Highcharts === 'object') {
  AnnotationsModule(Highcharts)
}

export default function HighChartsTimeSeries({
  series,
  annotations,
}: {
  series: Highcharts.SeriesOptionsType[]
  annotations: Highcharts.AnnotationsOptions[]
}) {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null)
  const options: Highcharts.Options = {
    rangeSelector: {
      selected: 1, // Pre-selects one of the range buttons
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
    series: series,
    annotations: annotations,
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
