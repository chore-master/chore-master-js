import { useNodes, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React from 'react'

export type ClusterNodeProps = Node<
  {
    title?: string
    style?: React.CSSProperties
  },
  'cluster'
>

export default function ClusterNode({ id, data }: NodeProps<ClusterNodeProps>) {
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const nodes = useNodes()
  const childNodes = nodes.filter((node) => node.parentId === id)
  const rightmostNode = childNodes.reduce((max, node) => {
    const maxX = max.position.x + (max.measured?.width || 0)
    const nodeX = node.position.x + (node.measured?.width || 0)
    return nodeX > maxX ? node : max
  }, childNodes[0])

  const bottommostNode = childNodes.reduce((max, node) => {
    const maxY = max.position.y + (max.measured?.height || 0)
    const nodeY = node.position.y + (node.measured?.height || 0)
    return nodeY > maxY ? node : max
  }, childNodes[0])

  const padding = 20

  React.useEffect(() => {
    setWidth(
      rightmostNode.position.x +
        (rightmostNode.measured?.width || 0) +
        padding * 2
    )
  }, [rightmostNode])

  React.useEffect(() => {
    setHeight(
      bottommostNode.position.y +
        (bottommostNode.measured?.height || 0) +
        padding * 2
    )
  }, [bottommostNode])

  return (
    <div
      style={{
        transform: `translate(-${padding}px, -${padding}px)`,
        width,
        height,
        ...data.style,
      }}
    >
      <div>
        <span>{data.title}</span>
      </div>
    </div>
  )
}
