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

// function separateData(data, keys) {
//   const positiveData = data.map((d) => {
//     let obj = { x: d.x }
//     keys.forEach((key) => (obj[key] = Math.max(0, d[key])))
//     return obj
//   })

//   const negativeData = data.map((d) => {
//     let obj = { x: d.x }
//     keys.forEach((key) => (obj[key] = Math.min(0, d[key])))
//     return obj
//   })

//   return { positiveData, negativeData }
// }

export default function StackedAreaChart({ data, colors, layout }) {
  // const keys = Array.from(new Set(data.map((d) => d.group)))
  const keys = d3.union(data.map((d) => d.group))
  // fillMissingData(data, keys)
  // const { positiveData, negativeData } = separateData(data, keys)
  const positiveData = data.filter((d) => d.value >= 0)
  const negativeData = data.filter((d) => d.value <= 0)
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
    .domain(d3.extent(data, (d) => d.domain))
    .range([
      chartLayout.marginLeft,
      chartMeasure.width - chartLayout.marginRight,
    ])
  const yScale = d3
    .scaleLinear()
    .range([
      chartMeasure.height - chartLayout.marginBottom,
      chartLayout.marginTop,
    ])

  const stackGenerator = d3
    .stack()
    .keys(keys)
    .value((d, _key) => d.value)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)

  const positiveSeries = stackGenerator(positiveData)
  const negativeSeries = stackGenerator(negativeData)

  yScale.domain([
    d3.min(negativeSeries, (d) => d3.min(d, (item) => item[1])),
    d3.max(positiveSeries, (d) => d3.max(d, (item) => item[1])),
  ])

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.domain))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))

  React.useEffect(() => {
    const xAxis = d3
      .axisBottom(xScale)
      // .ticks(d3.timeHour.every(6))
      .tickFormat(d3.timeFormat('%Y-%m-%d'))
    const yAxis = d3.axisLeft(yScale)
    d3.select(xAxisRef.current).call(xAxis)
    d3.select(yAxisRef.current).call(yAxis)
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
