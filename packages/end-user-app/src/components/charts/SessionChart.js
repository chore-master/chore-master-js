import React from 'react'
import Plot from 'react-plotly.js'
import { useMeasure } from 'react-use'

export default function SessionChart({ layout, priceDatapoints }) {
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
  const [chartRef, chartMeasure] = useMeasure()
  const [pricesData, setPricesData] = React.useState(priceDatapoints)

  const timeSeriesData = [
    {
      type: 'scatter',
      mode: 'lines',
      name: 'Price High', // Replace with appropriate name if needed
      x: pricesData.map((point) => point.timeUTC), // Assuming priceDatapoints has a `time` field
      y: pricesData.map((point) => point.value), // Assuming priceDatapoints has a `priceHigh` field
      line: { color: '#17BECF' },
    },
    // {
    //   type: 'scatter',
    //   mode: 'lines',
    //   name: 'Price Low', // Replace with appropriate name if needed
    //   x: pricesData.map((point) => point.time), // Assuming priceDatapoints has a `time` field
    //   y: pricesData.map((point) => point.priceLow), // Assuming priceDatapoints has a `priceLow` field
    //   line: { color: '#7F7F7F' },
    // },
  ]

  const plotLayout = {
    autosize: true,
    height: chartLayout.height,
    margin: {
      t: chartLayout.marginTop,
      r: chartLayout.marginRight,
      b: chartLayout.marginBottom,
      l: chartLayout.marginLeft,
    },
    xaxis: {
      autorange: true,
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
            count: 2,
            label: '2m',
            step: 'month',
            stepmode: 'backward',
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
  }

  React.useEffect(() => {
    setPricesData(priceDatapoints)
  }, [priceDatapoints])

  return (
    <Plot
      data={timeSeriesData}
      layout={plotLayout}
      useResizeHandler={true}
      style={{
        width: chartLayout.width,
        height: chartLayout.height,
        minWidth: chartLayout.minWidth,
      }}
    />
  )
}
