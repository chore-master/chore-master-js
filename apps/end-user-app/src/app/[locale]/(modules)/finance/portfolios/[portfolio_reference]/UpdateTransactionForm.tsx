import AutoLoadingButton from '@/components/AutoLoadingButton'
import WithRef from '@/components/WithRef'
import { UpdateTransactionFormInputs } from '@/types/finance'
import { validateDatetimeField } from '@/utils/validation'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'

export default function UpdateTransactionForm({
  updateTransactionForm,
  timezone,
  handleSubmitUpdateTransactionForm,
}: {
  updateTransactionForm: UseFormReturn<UpdateTransactionFormInputs>
  timezone: any
  handleSubmitUpdateTransactionForm: SubmitHandler<UpdateTransactionFormInputs>
}) {
  return (
    <Box sx={{ minWidth: 320 }}>
      <CardHeader title="編輯交易" />
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
                control={updateTransactionForm.control}
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
                      !!updateTransactionForm.formState.errors.transacted_time
                    }
                    helperText={
                      updateTransactionForm.formState.errors.transacted_time
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
            control={updateTransactionForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="區塊鏈 ID" variant="filled" />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="tx_hash"
            control={updateTransactionForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="區塊鏈交易 Hash" variant="filled" />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="remark"
            control={updateTransactionForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="備註" variant="filled" />
            )}
          />
        </FormControl>
        <AutoLoadingButton
          type="submit"
          variant="contained"
          disabled={!updateTransactionForm.formState.isValid}
          onClick={updateTransactionForm.handleSubmit(
            handleSubmitUpdateTransactionForm
          )}
        >
          更新
        </AutoLoadingButton>
      </Stack>
    </Box>
  )
}
