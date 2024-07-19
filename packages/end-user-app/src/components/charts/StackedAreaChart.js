import * as d3 from 'd3'
import React from 'react'
import { useMeasure } from 'react-use'

export default function StackedAreaChart({
  data,
  // width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
}) {
  const [chartRef, chartMeasure] = useMeasure()
  const gx = React.useRef()
  const gy = React.useRef()

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (dp) => dp.x))
    .range([marginLeft, chartMeasure.width - marginRight])
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (dp) => dp.y))
    .range([height - marginBottom, marginTop])
  const line = d3
    .line()
    .x((dp) => xScale(dp.x))
    .y((dp) => yScale(dp.y))

  React.useEffect(() => {
    d3.select(gx.current).call(d3.axisBottom(xScale))
  }, [chartMeasure.width, gx, xScale])

  React.useEffect(() => {
    d3.select(gy.current).call(d3.axisLeft(yScale))
  }, [gy, yScale])

  return (
    <svg ref={chartRef} height={height} style={{ width: '100%' }}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={line(data)}
      />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={xScale(d.x)} cy={yScale(d.y)} r="2.5" />
        ))}
      </g>
    </svg>
  )
}
