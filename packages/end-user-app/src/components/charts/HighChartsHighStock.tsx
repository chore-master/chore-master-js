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
  Highcharts.setOptions({
    lang: {
      rangeSelectorZoom: '範圍',
      rangeSelectorTo: '至',
    },
  })
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
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%Y-%m-%d}',
        rotation: -45,
      },
    },
    navigator: {
      maskInside: false,
      maskFill: 'rgba(102,133,194,0.3)',
      xAxis: {
        labels: {
          format: '{value:%Y-%m}',
        },
      },
    },
    tooltip: {
      // outside: true,
      // split: false,
      // shared: true,
      // useHTML: true,
      headerFormat: '{point.x:%Y-%m-%d %H:%M:%S.%L}',
      // pointFormat:
      //   '<p style="font-size:12px;margin:0px;padding-top:1px;padding-bottom:1px;color:{series.color};">{series.name} <strong>{point.y}</strong></p>',
      // valueDecimals: 2,
      // backgroundColor: 'black',
      borderWidth: 1,
      // style: {
      //   width: 150,
      //   padding: '0px',
      // },
      // shadow: false,

      // xDateFormat: '%Y-%m-%d, %A',
      // headerFormat:
      //   '<span style="font-size: 10px">{point.key:%Y-%m-%d}</span><br/>',
      // outside: true,
      //   dateTimeLabelFormats: {
      //     year: '%Y',
      //     month: '%Y-%m',
      //     week: '%Y-%m-%d',
      //     day: '%Y-%m-%d',
      //     hour: '%Y-%m-%d %H:%M',
      //     minute: '%Y-%m-%d %H:%M',
      //     second: '%Y-%m-%d %H:%M:%S',
      //     millisecond: '%Y-%m-%d %H:%M:%S.%L',
      //   },
    },
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
      inputDateFormat: '%Y-%m-%d',
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
