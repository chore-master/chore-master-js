import * as d3 from 'd3'
import React from 'react'
import { useMeasure } from 'react-use'

// https://observablehq.com/@mbostock/most-popular-operating-systems-2003-2020
// https://observablehq.com/@d3/stacked-area-chart/2
export default function StackedAreaChart({
  layout,
  datapoints,
  accessDate,
  accessValue,
  accessGroup,
  // mapGroupToLegendText,
  // colors,
  colorScale,
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
  const [chartRef, chartMeasure] = useMeasure()
  const [data, setData] = React.useState(datapoints)
  const xAxisRef = React.useRef()
  const leftYAxisRef = React.useRef()
  const rightYAxisRef = React.useRef()
  const tickLineRef = React.useRef()
  // const legendRef = React.useRef()

  const positiveData = data.filter((d) => accessValue(d) >= 0)
  const negativeData = data.filter((d) => accessValue(d) <= 0)
  const keys = d3.union(data.map(accessGroup))
  const stack = d3
    .stack()
    .keys(keys)
    .value(([, D], key) => D.get(key) || 0)
  const positiveSeries = stack(
    d3.rollup(positiveData, ([d]) => accessValue(d), accessDate, accessGroup)
  )
  const negativeSeries = stack(
    d3.rollup(negativeData, ([d]) => accessValue(d), accessDate, accessGroup)
  )
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, accessDate))
    .range([
      chartLayout.marginLeft,
      chartMeasure.width - chartLayout.marginRight,
    ])
  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(negativeSeries, (d) => d3.min(d, (d) => d[1])) || 0,
      d3.max(positiveSeries, (d) => d3.max(d, (d) => d[1])) || 0,
    ])
    .rangeRound([
      chartMeasure.height - chartLayout.marginBottom,
      chartLayout.marginTop,
    ])
  const area = d3
    .area()
    .x((d) => xScale(d.data[0]))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))

  React.useEffect(() => {
    setData(datapoints)
  }, [datapoints])

  // React.useEffect(() => {
  //   const legend = d3.select(legendRef.current)
  //   legend.selectAll('*').remove()
  //   const size = 20
  //   const spacing = 25

  //   legend
  //     .selectAll('rect')
  //     .data(colorScale.domain())
  //     .enter()
  //     .append('rect')
  //     .attr('x', 0)
  //     .attr('y', (d, i) => i * spacing)
  //     .attr('width', size)
  //     .attr('height', size)
  //     .style('fill', colorScale)

  //   legend
  //     .selectAll('text')
  //     .data(colorScale.domain().map(mapGroupToLegendText))
  //     .enter()
  //     .append('text')
  //     .attr('x', size + 5)
  //     .attr('y', (d, i) => i * spacing + size / 1.5)
  //     .text((d) => d)
  //     .style('font-size', '15px')
  //     .attr('alignment-baseline', 'middle')
  // }, [colorScale, mapGroupToLegendText])

  React.useEffect(() => {
    const yTicks = yScale.ticks()

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(chartMeasure.width / 200)
      // .ticks(d3.timeDay.every(1))
      .tickSizeOuter(0)
      .tickFormat(d3.timeFormat('%Y-%m-%d'))
    const leftYAxis = d3.axisLeft(yScale).ticks(chartMeasure.height / 40)
    const rightYAxis = d3.axisRight(yScale).ticks(chartMeasure.height / 40)
    d3.select(xAxisRef.current).call(xAxis)
    d3.select(leftYAxisRef.current).call(leftYAxis)
    d3.select(rightYAxisRef.current).call(rightYAxis)
    const tickLines = d3.select(tickLineRef.current)
    tickLines.selectAll('*').remove()
    tickLines
      .selectAll('.y-tick')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'y-tick')
      .attr('x1', chartLayout.marginLeft)
      .attr('x2', chartMeasure.width - chartLayout.marginRight)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', 'lightgray')
      .attr('stroke-width', 0.5)
  }, [
    chartMeasure.width,
    chartMeasure.height,
    xAxisRef,
    leftYAxisRef,
    rightYAxisRef,
    xScale,
    yScale,
  ])

  return (
    <svg
      ref={chartRef}
      style={{
        width: chartLayout.width,
        minWidth: chartLayout.minWidth,
        height: chartLayout.height,
      }}
    >
      <g>
        {positiveSeries.map((D, idx) => (
          <path key={idx} d={area(D)} fill={colorScale(D.key)} />
        ))}
        {negativeSeries.map((D, idx) => (
          <path key={idx} d={area(D)} fill={colorScale(D.key)} />
        ))}
      </g>
      <g
        ref={xAxisRef}
        transform={`translate(0,${
          chartMeasure.height - chartLayout.marginBottom
        })`}
      />
      <g
        ref={leftYAxisRef}
        transform={`translate(${chartLayout.marginLeft},0)`}
      />
      <g
        ref={rightYAxisRef}
        transform={`translate(${
          chartMeasure.width - chartLayout.marginRight
        },0)`}
      />
      <g ref={tickLineRef} />
      {/* <g ref={legendRef} /> */}
    </svg>
  )
}
