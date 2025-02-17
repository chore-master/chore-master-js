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
import { Background, Controls, ReactFlow } from '@xyflow/react'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import '@xyflow/react/dist/style.css'

type TxInputs = {
  tx_hash: string
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
  // const initialNodes = [
  //   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  //   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  // ]
  // const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]
  const nodes = Object.entries(tx.address_map || {}).map(
    ([address, addressObj]: [string, any], i: number) => {
      return {
        id: address,
        position: { x: 0, y: i * 100 },
        data: {
          label: addressObj.label,
        },
      }
    }
  )
  const edges = tx.transfers?.map((transfer: any, i: number) => {
    return {
      id: `${transfer.from_address}-${transfer.to_address}-${i}`,
      source: transfer.from_address,
      target: transfer.to_address,
      markerEnd: { type: 'arrow' },
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
        <div style={{ width: '100%', height: 640 }}>
          <ReactFlow nodes={nodes} edges={edges}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
