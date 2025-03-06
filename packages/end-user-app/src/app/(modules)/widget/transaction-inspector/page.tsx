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
import Graph from './Graph'

type InspectTransactionInputs = {
  tx_hash: string
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isFetchingTransaction, setIsFetchingTransaction] =
    React.useState(false)
  const [transaction, setTransaction] = React.useState<any>()
  const inspectTransactionForm = useForm<InspectTransactionInputs>({
    defaultValues: {
      tx_hash:
        '0x593fa3f2a232d1799225baf7d2ac7e33c5051cbe6ff55b8b6e3ada41bc7ef581',
    },
  })

  const onSubmitInspectTransactionForm: SubmitHandler<
    InspectTransactionInputs
  > = async (data) => {
    setIsFetchingTransaction(true)
    await choreMasterAPIAgent.get(
      `/widget/transaction-inspector/transactions/${data.tx_hash}`,
      {
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
          setTransaction(data)
        },
      }
    )
    setIsFetchingTransaction(false)
  }

  return (
    <ModuleFunction>
      <ModuleFunctionHeader title="Transaction Inspector" />
      <ModuleFunctionBody>
        <Box p={2}>
          <Stack component="form" spacing={3} autoComplete="off">
            <Controller
              control={inspectTransactionForm.control}
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
              onClick={inspectTransactionForm.handleSubmit(
                onSubmitInspectTransactionForm
              )}
            >
              檢視
            </AutoLoadingButton>
          </Stack>
        </Box>
      </ModuleFunctionBody>
      <ModuleFunctionBody loading={isFetchingTransaction}>
        <Graph transaction={transaction} />
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
