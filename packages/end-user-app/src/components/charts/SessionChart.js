import React from 'react'
import Plot from 'react-plotly.js'

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
  const [data, setData] = React.useState(datapoints)

  const timeSeriesData = [
    {
      type: 'scatter',
      mode: 'lines',
      name: 'IR', // Replace with appropriate name if needed
      x: data.map((point) => point.timeUTC), // Assuming datapoints has a `time` field
      y: data.map((point) => point.value), // Assuming datapoints has a `priceHigh` field
      line: { color: '#17BECF' },
    },
    // {
    //   type: 'scatter',
    //   mode: 'lines',
    //   name: 'Price Low', // Replace with appropriate name if needed
    //   x: data.map((point) => point.time), // Assuming datapoints has a `time` field
    //   y: data.map((point) => point.priceLow), // Assuming datapoints has a `priceLow` field
    //   line: { color: '#7F7F7F' },
    // },
  ]

  const annotationArrows = data
    .filter((d) => d.side)
    .map((point) => ({
      x: point.timeUTC, // Time of the long/short action
      y: point.value, // Price level for long/short action
      xref: 'x',
      yref: 'y',
      // text: point.side === 'long' ? 'Long' : 'Short', // Label "Long" or "Short"
      showarrow: true,
      arrowhead: 1,
      ax: 0,
      ay: point.side === 'long' ? 32 : -32, // Adjust arrow position
      font: {
        color: point.side === 'long' ? 'green' : 'red',
      },
      arrowcolor: point.side === 'long' ? 'green' : 'red',
    }))

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
    annotations: annotationArrows,
  }

  React.useEffect(() => {
    setData(datapoints)
  }, [datapoints])

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
      config={{ responsive: true }}
    />
  )
}
