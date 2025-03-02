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
import ProtocolNode from './ProtocolNode'

const xGap = 256
const yGap = 160

const initialNodes: Node[] = [
  {
    id: 'eth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: { title: 'ETH', pairs: [{ lendAssetSymbol: 'ETH' }] },
  },
  {
    id: 'beacon_deposit_contract',
    type: 'protocol',
    position: { x: xGap * 1, y: yGap * 0 },
    data: {
      title: 'Beacon Deposit Contract',
      pairs: [{ borrowAssetSymbol: 'ETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'tether',
    type: 'protocol',
    position: { x: xGap * 2, y: yGap * 0 },
    data: {
      title: 'Tether',
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDT' }],
    },
  },
  {
    id: 'circle',
    type: 'protocol',
    position: { x: xGap * 3, y: yGap * 0 },
    data: {
      title: 'Circle',
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDC' }],
    },
  },
  {
    id: 'wrapped_btc',
    type: 'protocol',
    position: { x: xGap * 4, y: yGap * 0 },
    data: {
      title: 'Wrapped BTC',
      pairs: [{ borrowAssetSymbol: 'BTC', lendAssetSymbol: 'WBTC' }],
    },
  },
  {
    id: 'lido',
    type: 'group',
    data: { label: 'Lido' },
    position: { x: xGap * 2 - 10, y: yGap * 1 - 10 },
    style: {
      width: xGap * 2 - 10,
      height: yGap * 1 - 10,
    },
  },
  {
    id: 'steth',
    type: 'protocol',
    position: { x: xGap * 0 + 10, y: yGap * 0 + 10 },
    parentId: 'lido',
    extent: 'parent',
    data: {
      title: 'stETH',
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'wsteth',
    type: 'protocol',
    position: { x: xGap * 1 + 10, y: yGap * 0 + 10 },
    parentId: 'lido',
    extent: 'parent',
    data: {
      title: 'wstETH',
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'wstETH' }],
    },
  },
  {
    id: 'eigen_layer',
    type: 'group',
    data: { label: 'Eigen Layer' },
    position: { x: xGap * 3 - 10, y: yGap * 2 - 10 },
    style: {
      width: xGap * 1 - 10,
      height: yGap * 1 - 10,
    },
  },
  {
    id: 'rsteth',
    type: 'protocol',
    position: { x: xGap * 0 + 10, y: yGap * 0 + 10 },
    parentId: 'eigen_layer',
    extent: 'parent',
    data: {
      title: 'rstETH',
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'rstETH' }],
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
  {
    id: 'beacon_deposit_contract.stETH->steth.stETH',
    source: 'beacon_deposit_contract',
    sourceHandle: 'stETH',
    target: 'steth',
    targetHandle: 'stETH',
  },
  {
    id: 'steth.stETH->wsteth.stETH',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'wsteth',
    targetHandle: 'stETH',
  },
  {
    id: 'steth.stETH->rsteth.stETH',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'rsteth',
    targetHandle: 'stETH',
  },
]

function Flow() {
  const nodeTypes = React.useMemo<NodeTypes>(
    () => ({
      protocol: ProtocolNode,
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
