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
    type: 'cluster',
    data: { title: 'Lido' },
    position: { x: xGap * 2, y: yGap * 1 },
  },
  {
    id: 'steth',
    type: 'protocol',
    position: { x: xGap * 0, y: yGap * 0 },
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
    position: { x: xGap * 1, y: yGap * 0 },
    parentId: 'lido',
    extent: 'parent',
    data: {
      title: 'wstETH',
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'wstETH' }],
    },
  },
  {
    id: 'eigen_layer',
    type: 'cluster',
    data: { title: 'Eigen Layer' },
    position: { x: xGap * 3, y: yGap * 2 },
  },
  {
    id: 'rsteth',
    type: 'protocol',
    position: { x: xGap * 0, y: yGap * 0 },
    parentId: 'eigen_layer',
    extent: 'parent',
    data: {
      title: 'rstETH',
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
  },
  {
    id: 'beacon_deposit_contract.stETH->steth.stETH',
    type: 'step',
    source: 'beacon_deposit_contract',
    sourceHandle: 'stETH',
    target: 'steth',
    targetHandle: 'stETH',
  },
  {
    id: 'steth.stETH->wsteth.stETH',
    type: 'step',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'wsteth',
    targetHandle: 'stETH',
  },
  {
    id: 'steth.stETH->rsteth.stETH',
    type: 'step',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'rsteth',
    targetHandle: 'stETH',
  },
]

const nodeTypes: NodeTypes = {
  protocol: ProtocolNode,
  cluster: ClusterNode,
}

const edgeTypes: EdgeTypes = {}

function Flow() {
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
