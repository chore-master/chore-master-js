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
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type TxInputs = {
  tx_hash: string
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isFetchingTxEvents, setIsFetchingTxEvents] = React.useState(false)
  const [txEvents, setTxEvents] = React.useState<any[]>([])
  const txForm = useForm<TxInputs>({
    defaultValues: {
      tx_hash:
        '0x44cde2cf2d8d50155c6b25c9e9ef99b406682e21064af102ccd2ff2ad9b3d916',
    },
  })

  const onSubmitTxForm: SubmitHandler<TxInputs> = async (data) => {
    setIsFetchingTxEvents(true)
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
        setTxEvents(data)
      },
    })
    setIsFetchingTxEvents(false)
  }

  return (
    <ModuleFunction>
      <ModuleFunctionHeader title="Transaction Visualizer" />
      <ModuleFunctionBody loading={isFetchingTxEvents}>
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
      <ModuleFunctionBody>TBD</ModuleFunctionBody>
    </ModuleFunction>
  )
}
