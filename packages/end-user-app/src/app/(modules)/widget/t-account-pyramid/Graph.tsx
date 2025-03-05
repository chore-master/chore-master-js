import type {
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
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

function GridLayoutFlow({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const [layoutedNodes, setLayoutedNodes] = React.useState(nodes)
  const [layoutedEdges, setLayoutedEdges] = React.useState(edges)

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setLayoutedNodes((nds) => applyNodeChanges(changes, nds)),
    [setLayoutedNodes]
  )
  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setLayoutedEdges((eds) => applyEdgeChanges(changes, eds)),
    [setLayoutedEdges]
  )
  const onConnect: OnConnect = React.useCallback(
    (connection) => setLayoutedEdges((eds) => addEdge(connection, eds)),
    [setLayoutedEdges]
  )

  React.useEffect(() => {
    const colGap = 256
    const rowGap = 160
    setLayoutedNodes(
      nodes.map((node: any) => ({
        ...node,
        position: {
          x: node.data.grid.col * colGap,
          y: node.data.grid.row * rowGap,
        },
      }))
    )
  }, [nodes])

  return (
    <div style={{ width: '100%', height: 640, backgroundColor: '#F7F9FB' }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default function Graph() {
  return (
    <ReactFlowProvider>
      <GridLayoutFlow nodes={initialNodes} edges={initialEdges} />
    </ReactFlowProvider>
  )
}
