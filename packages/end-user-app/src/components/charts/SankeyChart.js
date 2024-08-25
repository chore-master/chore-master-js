import { colors } from '@/utils/chart'
import * as d3 from 'd3'
import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey'
import React from 'react'
import { useMeasure } from 'react-use'

export default function SankeyChart({
  layout,
  datapoints,
  accessSource,
  accessTarget,
  accessValue,
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
  const linkRef = React.useRef()
  const nodeRef = React.useRef()
  const nodeGroups = Array.from(
    new Set(data.flatMap((d) => [accessSource(d), accessTarget(d)])),
    (d) => ({ id: d })
  )
  const colorScale = d3.scaleOrdinal().domain(nodeGroups).range(colors)

  const sankeyGenerator = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [chartLayout.marginLeft, chartLayout.marginTop],
      [
        chartMeasure.width - chartLayout.marginRight,
        chartMeasure.height - chartLayout.marginBottom,
      ],
    ])
    .nodeId((node) => node.id)
    .nodeAlign(sankeyCenter)

  const { nodes, links } = sankeyGenerator({
    nodes: nodeGroups,
    links: data.map((d) => ({
      source: accessSource(d),
      target: accessTarget(d),
      value: accessValue(d),
    })),
  })

  React.useEffect(() => {
    setData(datapoints)
  }, [datapoints])

  React.useEffect(() => {
    const linkSelection = d3.select(linkRef.current)
    linkSelection.selectAll('*').remove()

    linkSelection
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke-width', (d) => Math.max(0.5, d.width))
      .attr('stroke', (d) => colorScale(d.source.id))
      .attr('stroke-opacity', 0.5)

    const nodeSelection = d3.select(nodeRef.current)
    nodeSelection.selectAll('*').remove()

    nodeSelection
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .style('fill', (d) => colorScale(d.id))
      .style('stroke', '#000')
      .style('stroke-width', 1)

    nodeSelection
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', (d) => (d.x0 + d.x1) / 2)
      .attr('y', (d) => (d.y0 + d.y1) / 2)
      .attr('text-anchor', 'middle')
      .text((d) => d.id)
      .style('font-size', '12px')
      .style('fill', '#000')
  }, [data, links, nodes, colorScale])

  return (
    <svg
      ref={chartRef}
      style={{
        width: chartLayout.width,
        minWidth: chartLayout.minWidth,
        height: chartLayout.height,
      }}
    >
      <g ref={linkRef} />
      <g ref={nodeRef} />
    </svg>
  )
}
