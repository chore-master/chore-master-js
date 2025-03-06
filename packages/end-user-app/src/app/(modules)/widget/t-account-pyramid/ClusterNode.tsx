import { useNodes, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React from 'react'

export type ClusterNodeProps = Node<
  {
    title?: string
    grid: {
      row: number
      col: number
    }
    style?: React.CSSProperties
    inset?: number
  },
  'cluster'
>

export default function ClusterNode({ id, data }: NodeProps<ClusterNodeProps>) {
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const nodes = useNodes()
  const childNodes = nodes.filter((node) => node.parentId === id)
  const rightMostNode = childNodes.reduce((max, node) => {
    const maxX = max.position.x + (max.measured?.width || 0)
    const nodeX = node.position.x + (node.measured?.width || 0)
    return nodeX > maxX ? node : max
  }, childNodes[0])

  const bottomMostNode = childNodes.reduce((max, node) => {
    const maxY = max.position.y + (max.measured?.height || 0)
    const nodeY = node.position.y + (node.measured?.height || 0)
    return nodeY > maxY ? node : max
  }, childNodes[0])

  const padding = data.inset ?? 32

  React.useEffect(() => {
    setWidth(
      rightMostNode.position.x +
        (rightMostNode.measured?.width || 0) +
        padding * 2
    )
  }, [rightMostNode, padding])

  React.useEffect(() => {
    setHeight(
      bottomMostNode.position.y +
        (bottomMostNode.measured?.height || 0) +
        padding * 2
    )
  }, [bottomMostNode, padding])

  return (
    <div
      style={{
        transform: `translate(-${padding}px, -${padding}px)`,
        width,
        height,
        ...data.style,
      }}
    >
      <div style={{ width: '100%', textAlign: 'center' }}>{data.title}</div>
    </div>
  )
}
