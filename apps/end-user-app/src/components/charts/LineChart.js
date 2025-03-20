import * as d3 from 'd3'
import React from 'react'
import { useMeasure } from 'react-use'

export default function LineChart({ data, layout }) {
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
    .domain(d3.extent(data, (dp) => dp.x))
    .range([
      chartLayout.marginLeft,
      chartMeasure.width - chartLayout.marginRight,
    ])
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (dp) => dp.y))
    .range([
      chartMeasure.height - chartLayout.marginBottom,
      chartLayout.marginTop,
    ])

  React.useEffect(() => {
    d3.select(xAxisRef.current).call(d3.axisBottom(xScale))
  }, [chartMeasure.width, xAxisRef, xScale])

  React.useEffect(() => {
    d3.select(yAxisRef.current).call(d3.axisLeft(yScale))
  }, [chartMeasure.height, yAxisRef, yScale])

  const line = d3
    .line()
    .x((dp) => xScale(dp.x))
    .y((dp) => yScale(dp.y))

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
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={line(data)}
      />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((dp, i) => (
          <circle key={i} cx={xScale(dp.x)} cy={yScale(dp.y)} r="2.5" />
        ))}
      </g>
    </svg>
  )
}
