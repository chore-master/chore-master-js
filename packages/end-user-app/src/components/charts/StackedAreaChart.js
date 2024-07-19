import * as d3 from 'd3'
import React from 'react'
import { useMeasure } from 'react-use'

// https://observablehq.com/@mbostock/most-popular-operating-systems-2003-2020
// https://observablehq.com/@d3/stacked-area-chart/2
export default function StackedAreaChart({ data, colors, layout }) {
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

  const positiveData = data.filter((d) => d.value >= 0)
  const negativeData = data.filter((d) => d.value <= 0)
  const keys = d3.union(data.map((d) => d.group))

  const stack = d3
    .stack()
    .keys(keys)
    .value(([, D], key) => D.get(key) || 0)
  const positiveSeries = stack(
    d3.rollup(
      positiveData,
      ([d]) => d.value,
      (d) => d.domain,
      (d) => d.group
    )
  )
  const negativeSeries = stack(
    d3.rollup(
      negativeData,
      ([d]) => d.value,
      (d) => d.domain,
      (d) => d.group
    )
  )

  const xScale = d3
    .scaleUtc()
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
  const colorScale = d3.scaleOrdinal().domain(keys).range(d3.schemeTableau10)

  yScale.domain([
    d3.min(negativeSeries, (d) => d3.min(d, (d) => d[1])),

    d3.max(positiveSeries, (d) => d3.max(d, (d) => d[1])),
  ])

  const area = d3
    .area()
    .x((d) => xScale(d.data[0]))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))

  React.useEffect(() => {
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeDay.every(1))
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
      {positiveSeries.map((D, idx) => (
        <path
          key={idx}
          d={area(D)}
          fill={colorScale(D.key)}
          // stroke="currentColor"
          // strokeWidth="1.5"
        />
      ))}
      {negativeSeries.map((D, idx) => (
        <path
          key={idx}
          d={area(D)}
          fill={colorScale(D.key)}
          // stroke="currentColor"
          // strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}
