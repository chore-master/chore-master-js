import * as d3 from 'd3'
import React from 'react'
import { useMeasure } from 'react-use'

function fillMissingData(data, keys) {
  data.forEach((item, index) => {
    keys.forEach((key) => {
      if (item[key] === undefined || item[key] === null) {
        // Find the last non-null value in the previous data points
        let lastValidIndex = index - 1
        while (
          lastValidIndex >= 0 &&
          (data[lastValidIndex][key] === undefined ||
            data[lastValidIndex][key] === null)
        ) {
          lastValidIndex -= 1
        }
        item[key] = lastValidIndex >= 0 ? data[lastValidIndex][key] : 0
      }
    })
  })
}
function separateData(data, keys) {
  const positiveData = data.map((d) => {
    let obj = { date: d.date }
    keys.forEach((key) => (obj[key] = Math.max(0, d[key])))
    return obj
  })

  const negativeData = data.map((d) => {
    let obj = { date: d.date }
    keys.forEach((key) => (obj[key] = Math.min(0, d[key])))
    return obj
  })

  return { positiveData, negativeData }
}
export default function StackedAreaChart({ data, keys, colors, layout }) {
  fillMissingData(data, keys)
  const { positiveData, negativeData } = separateData(data, keys)
  const chartLayout = Object.assign(
    {
      width: 640,
      height: 400,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 40,
    },
    layout
  )
  const [chartRef, chartMeasure] = useMeasure()
  const xAxisRef = React.useRef()
  const yAxisRef = React.useRef()

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.date))
    .range([
      chartLayout.marginLeft,
      chartMeasure.width - chartLayout.marginRight,
    ])

  const stackGenerator = d3
    .stack()
    .keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)

  const positiveSeries = stackGenerator(positiveData)
  const negativeSeries = stackGenerator(negativeData)

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(negativeSeries, (layer) =>
        d3.min(layer, (sequence) => sequence[1])
      ),
      d3.max(positiveSeries, (layer) =>
        d3.max(layer, (sequence) => sequence[1])
      ),
    ])
    .range([
      chartMeasure.height - chartLayout.marginBottom,
      chartLayout.marginTop,
    ])

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.date))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))

  React.useEffect(() => {
    d3.select(xAxisRef.current).call(d3.axisBottom(xScale))
    d3.select(yAxisRef.current).call(d3.axisLeft(yScale))
  }, [
    chartMeasure.width,
    chartMeasure.height,
    xAxisRef,
    yAxisRef,
    xScale,
    yScale,
  ])

  return (
    <svg
      ref={chartRef}
      style={{ width: chartLayout.width, height: chartLayout.height }}
    >
      <g
        ref={xAxisRef}
        transform={`translate(0,${
          chartMeasure.height - chartLayout.marginBottom
        })`}
      />
      <g ref={yAxisRef} transform={`translate(${chartLayout.marginLeft},0)`} />
      {positiveSeries.map((layer, idx) => (
        <path
          key={idx}
          d={areaGenerator(layer)}
          fill={colors[idx]}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
      {negativeSeries.map((layer, idx) => (
        <path
          key={idx}
          d={areaGenerator(layer)}
          fill={colors[idx]}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}
