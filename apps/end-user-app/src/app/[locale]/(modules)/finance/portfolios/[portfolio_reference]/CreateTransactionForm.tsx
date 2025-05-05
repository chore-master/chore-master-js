import AutoLoadingButton from '@/components/AutoLoadingButton'
import { useSidePanel } from '@/components/SidePanel'
import WithRef from '@/components/WithRef'
import { CreateTransactionFormInputs } from '@/types/finance'
import { validateDatetimeField } from '@/utils/validation'
import CloseIcon from '@mui/icons-material/Close'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'

export default function CreateTransactionForm({
  createTransactionForm,
  timezone,
  handleSubmitCreateTransactionForm,
}: {
  createTransactionForm: UseFormReturn<CreateTransactionFormInputs>
  timezone: any
  handleSubmitCreateTransactionForm: SubmitHandler<CreateTransactionFormInputs>
}) {
  const sidePanel = useSidePanel()
  return (
    <React.Fragment>
      <CardHeader
        title="新增交易"
        action={
          <IconButton onClick={() => sidePanel.close()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Stack
        component="form"
        spacing={3}
        p={2}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <FormControl>
          <WithRef
            render={(inputRef) => (
              <Controller
                name="transacted_time"
                control={createTransactionForm.control}
                defaultValue={timezone
                  .getLocalDate(new Date())
                  .toISOString()
                  .slice(0, -5)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={inputRef}
                    required
                    label="交易時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                    error={
                      !!createTransactionForm.formState.errors.transacted_time
                    }
                    helperText={
                      createTransactionForm.formState.errors.transacted_time
                        ?.message
                    }
                  />
                )}
                rules={{
                  validate: (value) =>
                    validateDatetimeField(value, inputRef, true),
                }}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="chain_id"
            control={createTransactionForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="區塊鏈 ID" variant="filled" />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="tx_hash"
            control={createTransactionForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="區塊鏈交易 Hash" variant="filled" />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="remark"
            control={createTransactionForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="備註" variant="filled" />
            )}
          />
        </FormControl>
        <AutoLoadingButton
          type="submit"
          variant="contained"
          disabled={!createTransactionForm.formState.isValid}
          onClick={createTransactionForm.handleSubmit(
            handleSubmitCreateTransactionForm
          )}
        >
          新增
        </AutoLoadingButton>
      </Stack>
    </React.Fragment>
  )
}
