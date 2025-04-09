import AutoLoadingButton from '@/components/AutoLoadingButton'
import ReferenceBlock from '@/components/ReferenceBlock'
import WithRef from '@/components/WithRef'
import { financeLedgerEntryEntryTypes } from '@/constants'
import { Asset, Instrument, UpdateLedgerEntryFormInputs } from '@/types/finance'
import { validateDatetimeField } from '@/utils/validation'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'

export default function UpdateLedgerEntryForm({
  updateLedgerEntryForm,
  timezone,
  assetReferenceToAssetMap,
  instrumentReferenceToInstrumentMap,
  assets,
  instruments,
  fetchAssets,
  fetchInstruments,
  isFetchingAssets,
  isFetchingInstruments,
  setAssetInputValue,
  setInstrumentInputValue,
  assetInputValue,
  instrumentInputValue,
  handleSubmitUpdateLedgerEntryForm,
}: {
  updateLedgerEntryForm: UseFormReturn<UpdateLedgerEntryFormInputs>
  timezone: any
  assetReferenceToAssetMap: Record<string, Asset>
  instrumentReferenceToInstrumentMap: Record<string, Instrument>
  assets: Asset[]
  instruments: Instrument[]
  fetchAssets: (params: { search: string }) => void
  fetchInstruments: (params: { search: string }) => void
  isFetchingAssets: boolean
  isFetchingInstruments: boolean
  setAssetInputValue: (value: string) => void
  setInstrumentInputValue: (value: string) => void
  assetInputValue: string
  instrumentInputValue: string
  handleSubmitUpdateLedgerEntryForm: SubmitHandler<UpdateLedgerEntryFormInputs>
}) {
  const isParentLedgerEntryExisted = !!updateLedgerEntryForm.watch(
    'parent_ledger_entry_reference'
  )
  const entryTypes = financeLedgerEntryEntryTypes.filter((entryType) =>
    isParentLedgerEntryExisted
      ? entryType.isAvailableForChildLedgerEntry
      : entryType.isAvailableForParentLedgerEntry
  )
  return (
    <Box sx={{ minWidth: 320 }}>
      <CardHeader
        title={isParentLedgerEntryExisted ? '編輯子帳目' : '編輯帳目'}
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
                name="entry_time"
                control={updateLedgerEntryForm.control}
                defaultValue={timezone
                  .getLocalDate(new Date())
                  .toISOString()
                  .slice(0, -5)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={inputRef}
                    required
                    label="帳務時間"
                    variant="filled"
                    type="datetime-local"
                    slotProps={{
                      htmlInput: {
                        step: 1,
                      },
                    }}
                    error={!!updateLedgerEntryForm.formState.errors.entry_time}
                    helperText={
                      updateLedgerEntryForm.formState.errors.entry_time?.message
                    }
                    disabled={isParentLedgerEntryExisted}
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
        <Controller
          name="entry_type"
          control={updateLedgerEntryForm.control}
          defaultValue={entryTypes[0].value}
          render={({ field }) => (
            <FormControl required fullWidth size="small" variant="filled">
              <InputLabel>條目類型</InputLabel>
              <Select {...field}>
                {entryTypes.map((entryType) => (
                  <MenuItem key={entryType.value} value={entryType.value}>
                    {entryType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          rules={{ required: '必填' }}
        />
        <FormControl>
          <Controller
            name="settlement_amount_change"
            control={updateLedgerEntryForm.control}
            defaultValue={0}
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
            name="settlement_asset_reference"
            control={updateLedgerEntryForm.control}
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
                onInputChange={(event, newInputValue) => {
                  setAssetInputValue(newInputValue)
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
                    size="small"
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
            name="quantity_change"
            control={updateLedgerEntryForm.control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                label="部位變動量"
                variant="filled"
                type="number"
                disabled={isParentLedgerEntryExisted}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <Controller
            name="instrument_reference"
            control={updateLedgerEntryForm.control}
            defaultValue=""
            render={({ field }) => (
              <Autocomplete
                {...field}
                value={
                  field.value
                    ? instrumentReferenceToInstrumentMap[field.value]
                    : null
                }
                onChange={(_event, value: Instrument | null) => {
                  field.onChange(value?.reference ?? '')
                  setInstrumentInputValue('')
                }}
                onInputChange={(event, newInputValue) => {
                  setInstrumentInputValue(newInputValue)
                }}
                onOpen={() => {
                  if (
                    instrumentInputValue.length === 0 &&
                    instruments.length === 0
                  ) {
                    fetchInstruments({ search: instrumentInputValue })
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.reference === value.reference
                }
                getOptionLabel={(option) => option.name}
                filterOptions={(instruments) => {
                  const lowerCaseInstrumentInputValue =
                    instrumentInputValue.toLowerCase()
                  return instruments.filter((instrument) =>
                    instrument.name
                      .toLowerCase()
                      .includes(lowerCaseInstrumentInputValue)
                  )
                }}
                options={instruments}
                autoHighlight
                loading={isFetchingInstruments}
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
                    label="交易品種"
                    variant="filled"
                    size="small"
                  />
                )}
                disabled={isParentLedgerEntryExisted}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="fill_px"
            control={updateLedgerEntryForm.control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                label="成交價格/費率"
                variant="filled"
                type="number"
                disabled={isParentLedgerEntryExisted}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            name="remark"
            control={updateLedgerEntryForm.control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="備註"
                variant="filled"
                multiline
                rows={5}
              />
            )}
          />
        </FormControl>
        <AutoLoadingButton
          type="submit"
          variant="contained"
          disabled={!updateLedgerEntryForm.formState.isValid}
          onClick={updateLedgerEntryForm.handleSubmit(
            handleSubmitUpdateLedgerEntryForm
          )}
        >
          更新
        </AutoLoadingButton>
      </Stack>
    </Box>
  )
}
