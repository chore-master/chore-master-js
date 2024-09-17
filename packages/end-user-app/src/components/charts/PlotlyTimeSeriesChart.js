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
  getAnnotations,
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
    .map((valueConfig) => {
      const filteredData = data.filter(valueConfig.filterDatapoint)
      return {
        type: valueConfig.type || 'scatter',
        mode: 'lines',
        name: valueConfig.name,
        x: filteredData.map(accessTime),
        y: filteredData.map(valueConfig.accessValue),
        line: { color: valueConfig.color || '#17BECF' },
        marker: { color: valueConfig.color || '#17BECF' },
        showlegend: false,
      }
    })
  const annotations = getAnnotations(data)

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
      autorange: true,
      // type: 'date',
      // range: ['2024-01-01', '2024-08-01'],
      rangeslider: {
        visible: true,

        // range: ['2024-06-15', '2024-08-01'],
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
    annotations: annotations,
    // hovermode: false,
  }

  React.useEffect(() => {
    setData(datapoints)
  }, [datapoints])

  return (
    <Plot
      data={timeSeriesData}
      layout={plotLayout}
      useResizeHandler={true}
      // onRelayout={(layout) => {
      //   console.log('layout', layout)
      // }}
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
