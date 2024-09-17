'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// https://github.com/plotly/react-plotly.js/issues/273
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function PlotlyTimeSeriesChart({
  layout,
  datapoints,
  accessTime,
  valueConfigs,
}) {
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

  const [data, setData] = React.useState(datapoints)

  const timeSeriesData = valueConfigs
    .filter((valueConfig) => valueConfig.isVisible)
    .map((valueConfig) => ({
      type: valueConfig.type || 'scatter',
      mode: 'lines',
      name: valueConfig.name,
      x: data.map(accessTime),
      y: data.map(valueConfig.accessValue),
      line: { color: valueConfig.color || '#17BECF' },
      marker: { color: valueConfig.color || '#17BECF' },
      showlegend: false,
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
    barmode: 'relative',
  }

  React.useEffect(() => {
    setData(datapoints)
  }, [datapoints])

  return (
    <Plot
      data={timeSeriesData}
      layout={plotLayout}
      useResizeHandler={true}
      config={{
        responsive: true,
        displaylogo: false,
        scrollZoom: true,
      }}
      style={{
        width: chartLayout.width,
        height: chartLayout.height,
        minWidth: chartLayout.minWidth,
      }}
    />
  )
}
