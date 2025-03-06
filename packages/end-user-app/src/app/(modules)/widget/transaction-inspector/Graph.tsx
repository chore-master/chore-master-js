// import {
//   SmartBezierEdge,
//   SmartStepEdge,
//   SmartStraightEdge,
// } from '@tisoap/react-flow-smart-edge'
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import React from 'react'
// import type { Edge, Node } from 'reactflow'
// import {
//   Background,
//   Controls,
//   MarkerType,
//   ReactFlow,
//   ReactFlowProvider,
//   useEdgesState,
//   useNodesInitialized,
//   useNodesState,
//   useReactFlow,
// } from 'reactflow'
// import 'reactflow/dist/style.css'
import { collide } from './collide.js'

function getNodesAndEdges(transaction: any) {
  const nodeIdMap = (transaction?.transfers || []).reduce(
    (acc: any, transfer: any) => {
      let address
      let label

      address = transfer.from
      label = transfer.from_label
      if (!acc[address]) {
        const sz = Object.keys(acc).length
        acc[address] = {
          id: address,
          // position: { x: 0, y: Object.keys(acc).length * 100 },
          position: { x: (sz % 4) * 250, y: Math.floor(sz / 4) * 250 },
          data: {
            label,
          },
          style: {
            borderColor: [
              transaction.from,
              transaction.interacted_with.address,
            ].includes(address)
              ? 'blue'
              : undefined,
          },
        }
      }

      address = transfer.to
      label = transfer.to_label
      if (!acc[address]) {
        const sz = Object.keys(acc).length
        acc[address] = {
          id: address,
          // position: { x: 0, y: Object.keys(acc).length * 100 },
          position: { x: (sz % 4) * 250, y: Math.floor(sz / 4) * 250 },
          data: {
            label,
          },
          style: {
            borderColor: [
              transaction.from,
              transaction.interacted_with.address,
            ].includes(address)
              ? 'blue'
              : undefined,
          },
        }
      }

      return acc
    },
    {
      // [transaction.from]: {
      //   id: transaction.from,
      //   position: { x: 0, y: 0 },
      //   data: {
      //     label: transaction.from,
      //   },
      //   style: {
      //     borderColor: 'blue',
      //   },
      // },
    }
  )
  const nodes = Object.values(nodeIdMap)

  const edges = (transaction?.transfers || []).map(
    (transfer: any, i: number) => {
      return {
        id: `${transfer.from}->${transfer.to}-${i}`,
        // type: 'smartBezier',
        // type: 'smartStep',
        // type: 'smartStraight',
        // animated: true,
        // sourcePosition: 'left',
        // targetPosition: 'right',
        source: transfer.from,
        target: transfer.to,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          // width: 8,
          // height: 8,
          //   color: '#FF0072',
        },
        style: {
          strokeWidth: 2,
          //   stroke: '#FF0072',
        },
        label: `${parseFloat(transfer.amount).toFixed(0)} ${transfer.token}`,
      }
    }
  )

  return {
    nodes,
    edges,
  }
}

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1000))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .force('collide', collide())
  .alphaTarget(0.05)
  .stop()

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow()
  const initialized = useNodesInitialized()

  // You can use these events if you want the flow to remain interactive while
  // the simulation is running. The simulation is typically responsible for setting
  // the position of nodes, but if we have a reference to the node being dragged,
  // we use that position instead.
  const draggingNodeRef = React.useRef(null)
  const dragEvents = React.useMemo(
    () => ({
      start: (_event, node) => (draggingNodeRef.current = node),
      drag: (_event, node) => (draggingNodeRef.current = node),
      stop: () => (draggingNodeRef.current = null),
    }),
    []
  )

  return React.useMemo(() => {
    let nodes = getNodes().map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }))
    let edges = getEdges().map((edge) => edge)
    let running = false

    // If React Flow hasn't initialized our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialized || nodes.length === 0) return [false, {}, dragEvents]

    simulation.nodes(nodes).force(
      'link',
      forceLink(edges)
        .id((d) => d.id)
        .strength(0.01)
        .distance(300)
    )

    // The tick function is called every animation frame while the simulation is
    // running and progresses the simulation one step forward each time.
    const tick = () => {
      getNodes().forEach((node, i) => {
        const dragging = draggingNodeRef.current?.id === node.id

        // Setting the fx/fy properties of a node tells the simulation to "fix"
        // the node at that position and ignore any forces that would normally
        // cause it to move.
        if (dragging) {
          nodes[i].fx = draggingNodeRef.current.position.x
          nodes[i].fy = draggingNodeRef.current.position.y
        } else {
          delete nodes[i].fx
          delete nodes[i].fy
        }
      })

      simulation.tick()
      setNodes(
        nodes.map((node) => ({
          ...node,
          position: { x: node.fx ?? node.x, y: node.fy ?? node.y },
        }))
      )

      window.requestAnimationFrame(() => {
        // Give React and React Flow a chance to update and render the new node
        // positions before we fit the viewport to the new layout.
        fitView()

        // If the simulation hasn't been stopped, schedule another tick.
        if (running) tick()
      })
    }

    const toggle = () => {
      if (!running) {
        getNodes().forEach((node, index) => {
          let simNode = nodes[index]
          Object.assign(simNode, node)
          simNode.x = node.position.x
          simNode.y = node.position.y
        })
      }
      running = !running
      running && window.requestAnimationFrame(tick)
    }

    const isRunning = () => running

    return [true, { toggle, isRunning }, dragEvents]
  }, [initialized, dragEvents, getNodes, getEdges, setNodes, fitView])
}

function LayoutFlow({ transaction }: { transaction: any }) {
  const nodeTypes = React.useMemo(() => ({}), [])

  const edgeTypes = React.useMemo(
    () => ({
      // smartBezier: SmartBezierEdge,
      // smartStep: SmartStepEdge,
      // smartStraight: SmartStraightEdge,
    }),
    []
  )

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [initialized, { toggle, isRunning }, dragEvents] = useLayoutedElements()

  React.useEffect(() => {
    if (isRunning) {
      if (initialized) {
        toggle()
      }
    }
    const { nodes, edges } = getNodesAndEdges(transaction)
    setEdges(edges)
    setNodes(nodes)
    if (!isRunning) {
      if (initialized) {
        if (edges.length > 0) {
          toggle()
        }
      }
    }
  }, [transaction])

  // React.useEffect(() => {
  //   if (initialized) {
  //     toggle()
  //   }
  // }, [initialized, toggle])

  return (
    <div style={{ width: '100%', height: 640, backgroundColor: '#F7F9FB' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable
        proOptions={{ hideAttribution: true }}
        onNodeDragStart={dragEvents.start}
        onNodeDrag={dragEvents.drag}
        onNodeDragStop={dragEvents.stop}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default function Graph({ transaction }: { transaction: any }) {
  return (
    <ReactFlowProvider>
      <LayoutFlow transaction={transaction} />
    </ReactFlowProvider>
  )
}
