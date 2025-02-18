import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React from 'react'

function AccountNode({ data }: { data: any }) {
  return (
    <div>
      <Handle type="target" id="inflow" position={Position.Top} isConnectable />
      <div
        style={{
          wordBreak: 'break-all',
          padding: 12,
          background: 'white',
          border: '1px solid black',
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        {data.label}
      </div>
      <Handle
        type="source"
        id="outflow"
        position={Position.Bottom}
        isConnectable
      />
    </div>
  )
}

export default function Flow({ transaction }: { transaction: any }) {
  const nodeTypes = React.useMemo(
    () => ({
      account: AccountNode,
    }),
    []
  )

  const edgeTypes = React.useMemo(() => ({}), [])

  return (
    <div style={{ width: '100%', height: 640, backgroundColor: '#F7F9FB' }}>
      <ReactFlow
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodes={[]}
        edges={[]}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
