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
import GroupNode from './GroupNode'

const initialNodes: Node[] = [
  {
    id: 'eth',
    type: 'group',
    position: { x: 0, y: 0 },
    data: { title: 'ETH', pairs: [{ lendAssetSymbol: 'ETH' }] },
  },
  {
    id: 'beacon_deposit_contract',
    type: 'group',
    position: { x: 200, y: 0 },
    data: {
      title: 'Beacon Deposit Contract',
      pairs: [{ borrowAssetSymbol: 'ETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'tether',
    type: 'group',
    position: { x: 400, y: 0 },
    data: {
      title: 'Tether',
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDT' }],
    },
  },
  {
    id: 'circle',
    type: 'group',
    position: { x: 600, y: 0 },
    data: {
      title: 'Circle',
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDC' }],
    },
  },
  {
    id: 'wrapped_btc',
    type: 'group',
    position: { x: 800, y: 0 },
    data: {
      title: 'Wrapped BTC',
      pairs: [{ borrowAssetSymbol: 'BTC', lendAssetSymbol: 'WBTC' }],
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'eth.ETH->beacon_deposit_contract.ETH',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'beacon_deposit_contract',
    targetHandle: 'ETH',
  },
]

function Flow() {
  const nodeTypes = React.useMemo<NodeTypes>(
    () => ({
      group: GroupNode,
    }),
    []
  )

  const edgeTypes = React.useMemo<EdgeTypes>(() => ({}), [])

  const [nodes, setNodes] = React.useState(initialNodes)
  const [edges, setEdges] = React.useState(initialEdges)

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect: OnConnect = React.useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

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
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default function Graph() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}
