/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// https://github.com/plotly/react-plotly.js/issues/273
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function SessionChart({ layout, datapoints }) {
  const chartLayout = Object.assign(
    {
      width: 640,
      minWidth: undefined,
      height: 400,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 40,
    },
    layout
  )

  const [sampleStep, setSampleStep] = React.useState(1)
  const [data, setData] = React.useState(datapoints)
  const [sampledData, setSampledData] = React.useState([])
  const [savedRange, setSavedRange] = React.useState(null)

  const timeSeriesData = [
    {
      type: 'scatter',
      mode: 'lines',
      name: 'IR', // Replace with appropriate name if needed
      x: sampledData.map((point) => point.timeUTC), // Assuming datapoints has a `time` field
      y: sampledData.map((point) => point.value), // Assuming datapoints has a `priceHigh` field
      line: { color: '#17BECF' },
    },
  ]

  const annotationArrows = sampledData
    .filter((d) => d.side)
    .map((point) => ({
      x: point.timeUTC,
      y: point.value,
      xref: 'x',
      yref: 'y',
      // text: point.side === 'long' ? '▲' : '▼', // Label "Long" or "Short"
      showarrow: true,
      // arrowhead: 10,
      ax: 0,
      ay: point.side === 'long' ? 20 : -20,
      font: {
        color: point.side === 'long' ? 'green' : 'red',
      },
      arrowcolor: point.side === 'long' ? 'green' : 'red',
    }))

  const plotLayout = {
    // autosize: true,
    height: chartLayout.height,
    margin: {
      t: chartLayout.marginTop,
      r: chartLayout.marginRight,
      b: chartLayout.marginBottom,
      l: chartLayout.marginLeft,
    },
    xaxis: {
      // autorange: savedRange ? false : true,
      // range: savedRange ? savedRange : undefined,
      rangeslider: {
        visible: true,
      },
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward',
          },
          {
            count: 3,
            label: '3m',
            step: 'month',
            stepmode: 'backward',
          },
          {
            step: 'month',
            stepmode: 'todate',
            count: 1,
            label: 'MTD', // This month
          },
          {
            step: 'year',
            stepmode: 'todate',
            count: 1,
            label: 'YTD', // This year
          },
          { step: 'all' },
        ],
      },
      type: 'date',
    },
    yaxis: {
      autorange: true,
      type: 'linear',
    },
    annotations: annotationArrows,
  }

  const getSampleStep = (viewRangeStart, viewRangeEnd) => {
    if (data.length === 0) {
      return 1
    }
    const allRangeStart = new Date(data[0].timeUTC)
    const allRangeEnd = new Date(data[data.length - 1].timeUTC)
    const allRangeInSeconds = (allRangeEnd - allRangeStart) / 1000
    let viewRangeInSeconds
    if (viewRangeStart && viewRangeEnd) {
      viewRangeInSeconds =
        (new Date(viewRangeEnd) - new Date(viewRangeStart)) / 1000
    } else {
      viewRangeInSeconds = 86400 * 7
    }
    return 1
    return Math.max(1, Math.ceil(allRangeInSeconds / viewRangeInSeconds))
  }

  const handleRelayout = (event) => {
    // if (event.autosize) {
    //   setSavedRange()
    // } else {
    //   setSavedRange([event['xaxis.range[0]'], event['xaxis.range[1]']])
    // }
    // setSampleStep(
    //   getSampleStep(event['xaxis.range[0]'], event['xaxis.range[1]'])
    // )
  }

  React.useEffect(() => {
    setSampleStep(getSampleStep())
  }, [])

  React.useEffect(() => {
    setData(datapoints)
  }, [datapoints])

  React.useEffect(() => {
    // setSampledData(data.filter((_, i) => i % sampleStep === 0))
    setSampledData(data)
  }, [data, sampleStep])

  return (
    <Plot
      data={timeSeriesData}
      layout={plotLayout}
      onRelayout={handleRelayout}
      useResizeHandler={true}
      config={{
        responsive: true,
        displaylogo: false,
        scrollZoom: true,
        locale: 'zh',
      }}
      style={{
        width: chartLayout.width,
        height: chartLayout.height,
        minWidth: chartLayout.minWidth,
      }}
    />
  )
}
