import type {
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  OnConnect,
  XYPosition,
} from '@xyflow/react'
import {
  addEdge,
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodes,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React from 'react'
import ClusterNode from './ClusterNode'
import ProtocolNode from './ProtocolNode'

const initialNodes: Node[] = [
  {
    id: 'eth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'ETH',
      grid: { row: 0, col: 0 },
      pairs: [{ lendAssetSymbol: 'ETH' }],
    },
  },
  {
    id: 'beacon_deposit_contract',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Beacon Deposit Contract',
      grid: { row: 0, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'tether',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Tether',
      grid: { row: 0, col: 2 },
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDT' }],
    },
  },
  {
    id: 'circle',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Circle',
      grid: { row: 0, col: 3 },
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDC' }],
    },
  },
  {
    id: 'wrapped_btc',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Wrapped BTC',
      grid: { row: 0, col: 4 },
      pairs: [{ borrowAssetSymbol: 'BTC', lendAssetSymbol: 'WBTC' }],
    },
  },
  {
    id: 'lido',
    type: 'cluster',
    position: { x: 0, y: 0 },
    data: {
      title: 'Lido',
      grid: { row: 1, col: 2 },
      style: {
        backgroundColor: 'rgba(255, 228, 228, 0.8)',
      },
    },
  },
  {
    id: 'steth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    parentId: 'lido',
    extent: 'parent',
    data: {
      title: 'stETH',
      grid: { row: 0, col: 0 },
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'wsteth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    parentId: 'lido',
    extent: 'parent',
    data: {
      title: 'wstETH',
      grid: { row: 0, col: 1 },
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'wstETH' }],
    },
  },
  {
    id: 'eigen_layer',
    type: 'cluster',
    position: { x: 0, y: 0 },
    data: {
      title: 'Eigen Layer',
      grid: { row: 2, col: 3 },
      style: {
        backgroundColor: 'rgba(215, 225, 228, 0.8)',
      },
    },
  },
  {
    id: 'rsteth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    parentId: 'eigen_layer',
    extent: 'parent',
    data: {
      title: 'rstETH',
      grid: { row: 0, col: 0 },
      pairs: [
        { borrowAssetSymbol: 'stETH', lendAssetSymbol: 'rstETH' },
        { borrowAssetSymbol: 'stETH1', lendAssetSymbol: 'rstETH2' },
        { borrowAssetSymbol: 'stETH3', lendAssetSymbol: 'rstETH4' },
      ],
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'eth.ETH->beacon_deposit_contract.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'beacon_deposit_contract',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'beacon_deposit_contract.stETH->steth.stETH',
    type: 'step',
    source: 'beacon_deposit_contract',
    sourceHandle: 'stETH',
    target: 'steth',
    targetHandle: 'stETH',
    zIndex: 1,
  },
  {
    id: 'steth.stETH->wsteth.stETH',
    type: 'step',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'wsteth',
    targetHandle: 'stETH',
    zIndex: 1,
  },
  {
    id: 'steth.stETH->rsteth.stETH',
    type: 'step',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'rsteth',
    targetHandle: 'stETH',
    zIndex: 1,
  },
]

const nodeTypes: NodeTypes = {
  protocol: ProtocolNode,
  cluster: ClusterNode,
}

const edgeTypes: EdgeTypes = {}

function GridLayoutFlow({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[]
  initialEdges: Edge[]
}) {
  const { fitView } = useReactFlow()
  const currentNodes = useNodes()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect: OnConnect = React.useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const handleGridLayout1 = React.useCallback(() => {
    const colGap = 256
    const rowGap = 160
    setNodes(
      initialNodes.map((node: any) => ({
        ...node,
        position: {
          x: node.data.grid.col * colGap,
          y: node.data.grid.row * rowGap,
        },
      }))
    )
    setEdges(initialEdges)
    window.requestAnimationFrame(() => {
      fitView()
    })
  }, [initialNodes])

  const handleGridLayout2 = React.useCallback(() => {
    const colGap = 48
    const rowGap = 48

    const minCol = Math.min(
      ...currentNodes.map((node: any) => node.data.grid.col)
    )
    const maxCol = Math.max(
      ...currentNodes.map((node: any) => node.data.grid.col)
    )
    const minRow = Math.min(
      ...currentNodes.map((node: any) => node.data.grid.row)
    )
    const maxRow = Math.max(
      ...currentNodes.map((node: any) => node.data.grid.row)
    )
    const parentIds = Array.from(
      currentNodes.reduce<Set<string | undefined>>((acc, node) => {
        acc.add(node.parentId)
        return acc
      }, new Set())
    )

    const nodeIdToXYPositionMap: Record<string, XYPosition> = {}
    currentNodes.forEach((node) => {
      nodeIdToXYPositionMap[node.id] = node.position
    })

    parentIds.forEach((parentId) => {
      let currentX = 0
      for (let col = minCol; col <= maxCol; col++) {
        const filteredNodes = currentNodes.filter(
          (node: any) =>
            node.parentId === parentId && node.data.grid.col === col
        )
        console.log('filteredNodes', filteredNodes)
        const maxWidth = Math.max(
          ...filteredNodes.map((node) =>
            node.type === 'protocol' ? node.measured?.width || 0 : 0
          )
        )
        filteredNodes.forEach((node) => {
          nodeIdToXYPositionMap[node.id].x = currentX
        })
        currentX += maxWidth + colGap
      }

      let currentY = 0
      for (let row = minRow; row <= maxRow; row++) {
        const filteredNodes = currentNodes.filter(
          (node: any) =>
            node.parentId === parentId && node.data.grid.row === row
        )
        const maxHeight = Math.max(
          ...filteredNodes.map((node) =>
            node.type === 'protocol' ? node.measured?.height || 0 : 0
          )
        )
        filteredNodes.forEach((node) => {
          nodeIdToXYPositionMap[node.id].y = currentY
        })
        currentY += maxHeight + rowGap
      }
    })

    setNodes(
      initialNodes.map((node) => ({
        ...node,
        position: nodeIdToXYPositionMap[node.id],
      }))
    )
    setEdges(initialEdges)
    window.requestAnimationFrame(() => {
      fitView()
    })
  }, [initialNodes])

  return (
    <div style={{ width: '100%', height: 640, backgroundColor: '#F7F9FB' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable
        proOptions={{ hideAttribution: true }}
      >
        <Panel position="top-right">
          <button onClick={() => handleGridLayout1()}>Grid Layout 1</button>
          <button onClick={() => handleGridLayout2()}>Grid Layout 2</button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default function Graph() {
  return (
    <ReactFlowProvider>
      <GridLayoutFlow initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  )
}
