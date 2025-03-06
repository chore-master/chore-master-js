/* eslint-disable react-hooks/exhaustive-deps */
import { colors } from '@/utils/chart'
import * as d3 from 'd3'
import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey'
import React from 'react'
import { useMeasure } from 'react-use'

export default function SankeyChart({
  layout,
  nodeDatapoints,
  linkDatapoints,
  accessNodeId,
  accessLinkSource,
  accessLinkTarget,
  accessLinkValue,
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
  const [nodesData, setNodesData] = React.useState(nodeDatapoints)
  const [linksData, setLinksData] = React.useState(linkDatapoints)
  const linksGroupRef = React.useRef()
  const nodesGroupRef = React.useRef()

  if (nodesData.length === 0 || linksData.length === 0) {
    return null
  }

  const colorScale = d3.scaleOrdinal().domain(nodesData).range(colors)
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

  let nodes = [{ id: '' }]
  let links = [{ source: '', target: '', value: 0 }]
  if (nodesData.length > 0) {
    const generated = sankeyGenerator({
      nodes: nodesData.map((d) => ({ id: accessNodeId(d) })),
      links: linksData.map((d) => ({
        source: accessLinkSource(d),
        target: accessLinkTarget(d),
        value: accessLinkValue(d),
      })),
    })
    nodes = generated.nodes
    links = generated.links
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setNodesData(nodeDatapoints)
  }, [nodeDatapoints])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setLinksData(linkDatapoints)
  }, [linkDatapoints])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    const linksGroup = d3.select(linksGroupRef.current)
    linksGroup.selectAll('*').remove()
    linksGroup
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke-width', (d) => Math.max(0.5, d.width))
      .attr('stroke', (d) => colorScale(d.source.id))
      .attr('stroke-opacity', 0.5)

    const nodesGroup = d3.select(nodesGroupRef.current)
    nodesGroup.selectAll('*').remove()
    nodesGroup
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

    nodesGroup
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
  }, [links, nodes, colorScale])

  return (
    <svg
      ref={chartRef}
      style={{
        width: chartLayout.width,
        minWidth: chartLayout.minWidth,
        height: chartLayout.height,
      }}
    >
      <g ref={linksGroupRef} />
      <g ref={nodesGroupRef} />
    </svg>
  )
}
