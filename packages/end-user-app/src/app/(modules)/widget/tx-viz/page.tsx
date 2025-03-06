// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {
  Background,
  BaseEdge,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
} from '@xyflow/react'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import '@xyflow/react/dist/style.css'

type TxInputs = {
  tx_hash: string
}

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

function SineEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const centerX = (targetX - sourceX) / 2 + sourceX
  const centerY = (targetY - sourceY) / 2 + sourceY

  const edgePath = `
  M ${sourceX} ${sourceY} 
  Q ${(targetX - sourceX) * 0.2 + sourceX} ${
    targetY * 1.1
  } ${centerX} ${centerY}
  Q ${(targetX - sourceX) * 0.8 + sourceX} ${
    sourceY * 0.9
  } ${targetX} ${targetY}
  `

  return <BaseEdge id={id} path={edgePath} />
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isFetchingTx, setIsFetchingTx] = React.useState(false)
  const [tx, setTx] = React.useState<any>({})
  const txForm = useForm<TxInputs>({
    defaultValues: {
      tx_hash:
        '0x44cde2cf2d8d50155c6b25c9e9ef99b406682e21064af102ccd2ff2ad9b3d916',
    },
  })

  const nodeTypes = React.useMemo(
    () => ({
      account: AccountNode,
    }),
    []
  )

  const edgeTypes = React.useMemo(
    () => ({
      sine: SineEdge,
    }),
    []
  )

  const onSubmitTxForm: SubmitHandler<TxInputs> = async (data) => {
    setIsFetchingTx(true)
    await choreMasterAPIAgent.get(`/widget/tx_hash/${data.tx_hash}/logs`, {
      params: {},
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setTx(data)
      },
    })
    setIsFetchingTx(false)
  }

  const sortedAddresses: string[] = []
  tx.transfers?.forEach((transfer: any) => {
    if (!sortedAddresses.includes(transfer.from_address)) {
      sortedAddresses.push(transfer.from_address)
    }
    if (!sortedAddresses.includes(transfer.to_address)) {
      sortedAddresses.push(transfer.to_address)
    }
  })

  const positionMap = Object.entries(tx.address_map || {}).reduce(
    (acc: any, [address, addressObj]) => {
      // const positionMap = sortedAddresses.reduce((acc: any, address: string) => {
      if (!acc[address]) {
        const sz = Object.keys(acc).length
        acc[address] = {
          x: (sz % 4) * 400,
          y: Math.floor(sz / 4) * 400,
        }
      }
      return acc
    },
    {}
  )

  const nodes = Object.entries(tx.address_map || {}).map(
    ([address, addressObj]: [string, any]) => {
      return {
        id: address,
        position: positionMap[address],
        data: {
          label: addressObj.label,
        },
        style: {
          minWidth: 144,
          wordBreak: 'break-all',
        },
        type: 'account',
      }
    }
  )
  const edges = tx.transfers?.map((transfer: any, i: number) => {
    const tokenLabel = tx.address_map[transfer.token_address].label
    const valueLabel = transfer.value ? `($${transfer.value})` : ''
    return {
      id: `${transfer.from_address}-${transfer.to_address}-${i}`,
      // type: 'sine',
      // type: 'step',
      // type: 'smoothstep',
      animated: true,
      sourcePosition: 'top',
      targetPosition: 'bottom',
      source: transfer.from_address,
      target: transfer.to_address,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FF0072',
      },
      style: {
        strokeWidth: 2,
        stroke: '#FF0072',
      },
      label: `${transfer.amount} ${tokenLabel}${valueLabel}`,
      // sourceHandle: 'outflow',
      // targetHandle: 'inflow',
    }
  })
  return (
    <ModuleFunction>
      <ModuleFunctionHeader title="Transaction Visualizer" />
      <ModuleFunctionBody loading={isFetchingTx}>
        <Box p={2}>
          <Stack component="form" spacing={3} autoComplete="off">
            <Controller
              control={txForm.control}
              name="tx_hash"
              defaultValue=""
              rules={{ required: '必填' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="Transaction Hash"
                  variant="standard"
                  placeholder="0xabc123"
                />
              )}
            />
            <AutoLoadingButton
              variant="contained"
              onClick={txForm.handleSubmit(onSubmitTxForm)}
            >
              瀏覽
            </AutoLoadingButton>
          </Stack>
        </Box>
      </ModuleFunctionBody>
      <ModuleFunctionBody>
        <div style={{ width: '100%', height: 640, backgroundColor: '#F7F9FB' }}>
          <ReactFlow
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
