import AutoLoadingButton from '@/components/AutoLoadingButton'
import ReferenceBlock from '@/components/ReferenceBlock'
import { financeTransferFlowTypes } from '@/constants'
import { Asset, CreateTransferFormInputs, Portfolio } from '@/types/finance'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'

export default function CreateTransferForm({
  portfolio,
  createTransferForm,
  assetInputValue,
  isFetchingAssets,
  assets,
  assetReferenceToAssetMap,
  setAssetInputValue,
  fetchAssets,
  handleSubmitCreateTransferForm,
}: {
  portfolio: Portfolio | null
  createTransferForm: UseFormReturn<CreateTransferFormInputs>
  assetInputValue: string
  isFetchingAssets: boolean
  assets: Asset[]
  assetReferenceToAssetMap: Record<string, Asset>
  setAssetInputValue: (value: string) => void
  fetchAssets: (params: { search: string }) => void
  handleSubmitCreateTransferForm: SubmitHandler<CreateTransferFormInputs>
}) {
  const settlementAsset =
    assetReferenceToAssetMap[portfolio?.settlement_asset_reference as string]
  return (
    <Box sx={{ minWidth: 320 }}>
      <CardHeader title="新增流量" />
      <Stack
        component="form"
        spacing={3}
        p={2}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Controller
          name="flow_type"
          control={createTransferForm.control}
          render={({ field }) => (
            <FormControl required fullWidth variant="filled">
              <InputLabel>流量類型</InputLabel>
              <Select
                {...field}
                onChange={(event: SelectChangeEvent) => {
                  const value = event.target.value
                  if (value === 'UPDATE_POSITION') {
                    createTransferForm.setValue(
                      'settlement_asset_amount_change',
                      '0'
                    )
                  }
                  field.onChange(value)
                }}
              >
                {financeTransferFlowTypes.map((flowType) => (
                  <MenuItem key={flowType.value} value={flowType.value}>
                    {flowType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          rules={{ required: '必填' }}
        />
        <FormControl>
          <Controller
            name="asset_amount_change"
            control={createTransferForm.control}
            defaultValue="0"
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="資產變動量"
                variant="filled"
                type="number"
              />
            )}
            rules={{ required: '必填' }}
          />
        </FormControl>
        <FormControl fullWidth>
          <Controller
            name="asset_reference"
            control={createTransferForm.control}
            defaultValue=""
            render={({ field }) => (
              <Autocomplete
                {...field}
                value={
                  field.value ? assetReferenceToAssetMap[field.value] : null
                }
                onChange={(_event, value: Asset | null) => {
                  field.onChange(value?.reference ?? '')
                  setAssetInputValue('')
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason !== 'reset') {
                    setAssetInputValue(newInputValue)
                  }
                }}
                onOpen={() => {
                  if (assetInputValue.length === 0 && assets.length === 0) {
                    fetchAssets({ search: assetInputValue })
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.reference === value.reference
                }
                getOptionLabel={(option) => option.name}
                filterOptions={(assets) => {
                  const lowerCaseAssetInputValue = assetInputValue.toLowerCase()
                  return assets.filter(
                    (asset) =>
                      asset.name
                        .toLowerCase()
                        .includes(lowerCaseAssetInputValue) ||
                      asset.symbol
                        .toLowerCase()
                        .includes(lowerCaseAssetInputValue)
                  )
                }}
                options={assets}
                autoHighlight
                loading={isFetchingAssets}
                loadingText="載入中..."
                noOptionsText="沒有符合的選項"
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props as {
                    key: React.Key
                  }
                  return (
                    <Box key={key} component="li" {...optionProps}>
                      <ReferenceBlock label={option.name} foreignValue />
                    </Box>
                  )
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="變動資產"
                    variant="filled"
                    required
                  />
                )}
              />
            )}
            rules={{ required: '必填' }}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="settlement_asset_amount_change"
            control={createTransferForm.control}
            defaultValue="0"
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="結算資產變動量"
                variant="filled"
                type="number"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <ReferenceBlock
                          label={settlementAsset.name}
                          foreignValue
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                disabled={
                  createTransferForm.watch('flow_type') === 'UPDATE_POSITION'
                }
              />
            )}
            rules={{ required: '必填' }}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="remark"
            control={createTransferForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="備註" variant="filled" />
            )}
          />
        </FormControl>
        <AutoLoadingButton
          type="submit"
          variant="contained"
          disabled={!createTransferForm.formState.isValid}
          onClick={createTransferForm.handleSubmit(
            handleSubmitCreateTransferForm
          )}
        >
          新增
        </AutoLoadingButton>
      </Stack>
    </Box>
  )
}
