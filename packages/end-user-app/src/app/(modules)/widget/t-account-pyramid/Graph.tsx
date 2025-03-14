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
    id: 'beacon_deposit',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Beacon Deposit',
      grid: { row: 0, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH', lendAssetSymbol: 'staked ETH' }],
    },
  },
  {
    id: 'wrapped_eth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Wrapped ETH',
      grid: { row: 1, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH', lendAssetSymbol: 'WETH' }],
    },
  },
  {
    id: 'cexs',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'CEXS',
      grid: { row: 2, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH' }],
    },
  },
  {
    id: 'bridges',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Bridges',
      grid: { row: 3, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH', lendAssetSymbol: 'bridged ETH' }],
    },
  },
  {
    id: 'active_eth_holders',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Active ETH Holders',
      grid: { row: 4, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH' }],
    },
  },
  {
    id: 'inactive_eth_holders',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Inactive ETH Holders',
      grid: { row: 5, col: 1 },
      pairs: [{ borrowAssetSymbol: 'ETH' }],
    },
  },
  {
    id: 'lst',
    type: 'cluster',
    position: { x: 0, y: 0 },
    data: {
      title: 'LSTs',
      grid: { row: 0, col: 2 },
      style: {
        backgroundColor: 'rgba(255, 228, 228, 0.8)',
      },
    },
  },
  {
    id: 'native_staked_eth_holder',
    type: 'protocol',
    position: { x: 0, y: 0 },
    parentId: 'lst',
    extent: 'parent',
    data: {
      title: 'Native Staked ETH Holder',
      grid: { row: 0, col: 0 },
      pairs: [{ borrowAssetSymbol: 'staked ETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'steth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    parentId: 'lst',
    extent: 'parent',
    data: {
      title: 'stETH',
      grid: { row: 1, col: 0 },
      pairs: [{ borrowAssetSymbol: 'staked ETH', lendAssetSymbol: 'stETH' }],
    },
  },
  {
    id: 'arbitrum',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Arbitrum',
      grid: { row: 3, col: 2 },
      pairs: [{ borrowAssetSymbol: 'bridged ETH' }],
    },
  },
  {
    id: 'wsteth',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'wstETH',
      grid: { row: 1, col: 3 },
      pairs: [{ borrowAssetSymbol: 'stETH', lendAssetSymbol: 'wstETH' }],
    },
  },
  {
    id: 'eth_restaking',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'ETH Restaking',
      grid: { row: 2, col: 3 },
      pairs: [
        { borrowAssetSymbol: 'staked ETH', lendAssetSymbol: 'restaked ETH' },
      ],
    },
  },
  // {
  //   id: 'eigen_layer',
  //   type: 'cluster',
  //   position: { x: 0, y: 0 },
  //   data: {
  //     title: 'Eigen Layer',
  //     grid: { row: 2, col: 3 },
  //     style: {
  //       backgroundColor: 'rgba(215, 225, 228, 0.8)',
  //     },
  //   },
  // },
  {
    id: 'tether',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Tether',
      grid: { row: 1, col: 0 },
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDT' }],
    },
  },
  {
    id: 'circle',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Circle',
      grid: { row: 2, col: 0 },
      pairs: [{ borrowAssetSymbol: 'USD', lendAssetSymbol: 'USDC' }],
    },
  },
  {
    id: 'wrapped_btc',
    type: 'protocol',
    position: { x: 0, y: 0 },
    data: {
      title: 'Wrapped BTC',
      grid: { row: 3, col: 0 },
      pairs: [{ borrowAssetSymbol: 'BTC', lendAssetSymbol: 'WBTC' }],
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'eth.ETH->beacon_deposit.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'beacon_deposit',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'eth.ETH->wrapped_eth.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'wrapped_eth',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'eth.ETH->cexs.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'cexs',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'eth.ETH->bridges.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'bridges',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'eth.ETH->active_eth_holders.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'active_eth_holders',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'eth.ETH->inactive_eth_holders.ETH',
    type: 'step',
    source: 'eth',
    sourceHandle: 'ETH',
    target: 'inactive_eth_holders',
    targetHandle: 'ETH',
    zIndex: 1,
  },
  {
    id: 'beacon_deposit.staked ETH->native_staked_eth_holder.staked ETH',
    type: 'step',
    source: 'beacon_deposit',
    sourceHandle: 'staked ETH',
    target: 'native_staked_eth_holder',
    targetHandle: 'staked ETH',
    zIndex: 1,
  },
  {
    id: 'beacon_deposit.staked ETH->steth.staked ETH',
    type: 'step',
    source: 'beacon_deposit',
    sourceHandle: 'staked ETH',
    target: 'steth',
    targetHandle: 'staked ETH',
    zIndex: 1,
  },
  {
    id: 'beacon_deposit.staked ETH->eth_restaking.staked ETH',
    type: 'step',
    source: 'beacon_deposit',
    sourceHandle: 'staked ETH',
    target: 'eth_restaking',
    targetHandle: 'staked ETH',
    zIndex: 1,
  },
  {
    id: 'bridges.bridged ETH->arbitrum.bridged ETH',
    type: 'step',
    source: 'bridges',
    sourceHandle: 'bridged ETH',
    target: 'arbitrum',
    targetHandle: 'bridged ETH',
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
    id: 'steth.stETH->eth_restaking.staked ETH',
    type: 'step',
    source: 'steth',
    sourceHandle: 'stETH',
    target: 'eth_restaking',
    targetHandle: 'staked ETH',
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
    // window.requestAnimationFrame(() => {
    //   fitView()
    // })
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
    // window.requestAnimationFrame(() => {
    //   fitView()
    // })
  }, [initialNodes])

  const handleGridLayout3 = React.useCallback(() => {
    const colGap = 84
    const rowGap = 84

    const nodeIdToAbsoluteGridPositionMap: Record<
      string,
      { col: number; row: number }
    > = {}
    currentNodes
      .filter((node) => node.parentId === undefined)
      .forEach((node: any) => {
        nodeIdToAbsoluteGridPositionMap[node.id] = {
          col: node.data.grid.col,
          row: node.data.grid.row,
        }
      })
    currentNodes
      .filter((node) => node.parentId !== undefined)
      .forEach((node: any) => {
        const parentNodeAbsoluteGridPosition =
          nodeIdToAbsoluteGridPositionMap[node.parentId]
        nodeIdToAbsoluteGridPositionMap[node.id] = {
          col: parentNodeAbsoluteGridPosition.col + node.data.grid.col,
          row: parentNodeAbsoluteGridPosition.row + node.data.grid.row,
        }
      })

    const sortedAbsoluteCols = Array.from(
      new Set(
        Object.values(nodeIdToAbsoluteGridPositionMap).map(
          (position) => position.col
        )
      )
    ).sort((a, b) => a - b)
    const sortedAbsoluteRows = Array.from(
      new Set(
        Object.values(nodeIdToAbsoluteGridPositionMap).map(
          (position) => position.row
        )
      )
    ).sort((a, b) => a - b)

    const absoluteColToAbsoluteXMap: Record<number, number> = {}
    let absoluteX = 0
    sortedAbsoluteCols.forEach((absoluteCol) => {
      const filteredNodes = currentNodes.filter(
        (node: any) =>
          node.type === 'protocol' &&
          nodeIdToAbsoluteGridPositionMap[node.id].col === absoluteCol
      )
      let width = 128
      if (filteredNodes.length > 0) {
        width = Math.max(
          ...filteredNodes.map((node) => node.measured?.width || 0)
        )
      }
      absoluteColToAbsoluteXMap[absoluteCol] = absoluteX
      absoluteX += width + colGap
    })

    const absoluteRowToAbsoluteYMap: Record<number, number> = {}
    let absoluteY = 0
    sortedAbsoluteRows.forEach((absoluteRow) => {
      const filteredNodes = currentNodes.filter(
        (node: any) =>
          node.type === 'protocol' &&
          nodeIdToAbsoluteGridPositionMap[node.id].row === absoluteRow
      )
      let height = 128
      if (filteredNodes.length > 0) {
        height = Math.max(
          ...filteredNodes.map((node) => node.measured?.height || 0)
        )
      }
      absoluteRowToAbsoluteYMap[absoluteRow] = absoluteY
      absoluteY += height + rowGap
    })

    const layoutedNodes = currentNodes.map((node) => {
      let parentNodeAbsoluteX = 0
      let parentNodeAbsoluteY = 0
      if (node.parentId) {
        const parentNodeAbsoluteCol =
          nodeIdToAbsoluteGridPositionMap[node.parentId].col
        parentNodeAbsoluteX = absoluteColToAbsoluteXMap[parentNodeAbsoluteCol]
        const parentNodeAbsoluteRow =
          nodeIdToAbsoluteGridPositionMap[node.parentId].row
        parentNodeAbsoluteY = absoluteRowToAbsoluteYMap[parentNodeAbsoluteRow]
      }
      const nodeAbsoluteCol = nodeIdToAbsoluteGridPositionMap[node.id].col
      const nodeAbsoluteX = absoluteColToAbsoluteXMap[nodeAbsoluteCol]
      const nodeAbsoluteRow = nodeIdToAbsoluteGridPositionMap[node.id].row
      const nodeAbsoluteY = absoluteRowToAbsoluteYMap[nodeAbsoluteRow]

      return {
        ...node,
        position: {
          x: -parentNodeAbsoluteX + nodeAbsoluteX,
          y: -parentNodeAbsoluteY + nodeAbsoluteY,
        },
      }
    })
    setNodes(layoutedNodes)
    setEdges(initialEdges)
    // window.requestAnimationFrame(() => {
    //   fitView()
    // })
  }, [initialNodes, currentNodes])

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
          <button onClick={() => handleGridLayout3()}>Grid Layout 3</button>
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
