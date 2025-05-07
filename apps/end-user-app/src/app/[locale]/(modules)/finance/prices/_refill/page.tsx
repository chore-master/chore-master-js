'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { useTimezone } from '@/components/timezone'
import WithRef from '@/components/WithRef'
import { QueryFeedOperatorFormInputs } from '@/types/finance'
import { Operator } from '@/types/integration'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import { validateDatetimeField } from '@/utils/validation'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MuiLink from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const timezone = useTimezone()

  // Feed operator
  const queryFeedOperatorForm = useForm<QueryFeedOperatorFormInputs>()
  const [feedOperators, setFeedOperators] = React.useState<Operator[]>([])
  const [isFetchingFeedOperators, setIsFetchingFeedOperators] =
    React.useState(false)

  const fetchFeedOperators = React.useCallback(async () => {
    setIsFetchingFeedOperators(true)
    await choreMasterAPIAgent.get('/v1/integration/users/me/operators', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch feed operators now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setFeedOperators(data)
      },
    })
    setIsFetchingFeedOperators(false)
  }, [enqueueNotification])

  const handleSubmitQueryFeedOperatorForm: SubmitHandler<
    QueryFeedOperatorFormInputs
  > = async ({
    operator_reference,
    gte_confirmed_time,
    lt_confirmed_time,
    ...data
  }) => {
    // await choreMasterAPIAgent.post(
    //   '/v1/finance/users/me/prices',
    //   {
    //     ...data,
    //     gte_confirmed_time: new Date(
    //       timezone.getUTCTimestamp(gte_confirmed_time)
    //     ).toISOString(),
    //   },
    //   {
    //     onError: () => {
    //       enqueueNotification(`Unable to create price now.`, 'error')
    //     },
    //     onFail: ({ message }: any) => {
    //       enqueueNotification(message, 'error')
    //     },
    //     onSuccess: () => {
    //       sidePanel.close()
    //       createPriceForm.reset()
    //       fetchPrices()
    //     },
    //   }
    // )
  }

  React.useEffect(() => {
    const values = queryFeedOperatorForm.getValues()
    if (feedOperators.length > 0 && !values.operator_reference) {
      queryFeedOperatorForm.setValue(
        'operator_reference',
        feedOperators[0]?.reference || ''
      )
    }
  }, [feedOperators])

  React.useEffect(() => {
    fetchFeedOperators()
  }, [])

  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/finance/market/prices"
          >
            價格
          </MuiLink>
          <Typography>批次回補</Typography>
        </Breadcrumbs>
      </Box>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="批次回補"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchFeedOperators}
                  disabled={isFetchingFeedOperators}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingFeedOperators}>
          <Stack
            component="form"
            direction="row"
            spacing={2}
            useFlexGap
            sx={{ p: 2, flexWrap: 'wrap' }}
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <FormControl>
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="gte_confirmed_time"
                    control={queryFeedOperatorForm.control}
                    defaultValue={timezone
                      .getLocalDate(new Date())
                      .toISOString()
                      .slice(0, -5)}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        required
                        label="起始時間"
                        type="datetime-local"
                        variant="standard"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={
                          !!queryFeedOperatorForm.formState.errors
                            .gte_confirmed_time
                        }
                        helperText={
                          queryFeedOperatorForm.formState.errors
                            .gte_confirmed_time?.message
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
              <WithRef
                render={(inputRef) => (
                  <Controller
                    name="lt_confirmed_time"
                    control={queryFeedOperatorForm.control}
                    defaultValue={timezone
                      .getLocalDate(new Date())
                      .toISOString()
                      .slice(0, -5)}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputRef={inputRef}
                        required
                        label="結束時間"
                        type="datetime-local"
                        variant="standard"
                        slotProps={{
                          htmlInput: {
                            step: 1,
                          },
                        }}
                        error={
                          !!queryFeedOperatorForm.formState.errors
                            .lt_confirmed_time
                        }
                        helperText={
                          queryFeedOperatorForm.formState.errors
                            .lt_confirmed_time?.message
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
            <Controller
              name="operator_reference"
              control={queryFeedOperatorForm.control}
              defaultValue=""
              render={({ field }) => (
                <FormControl required variant="standard">
                  <InputLabel>報價來源</InputLabel>
                  <Select
                    {...field}
                    onChange={(event: SelectChangeEvent) => {
                      const value = event.target.value
                      field.onChange(value)
                    }}
                    autoWidth
                  >
                    {feedOperators.map((operator) => (
                      <MenuItem
                        key={operator.reference}
                        value={operator.reference}
                      >
                        {operator.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              rules={{ required: '必填' }}
            />
            <AutoLoadingButton
              type="submit"
              disabled={!queryFeedOperatorForm.formState.isValid}
              onClick={queryFeedOperatorForm.handleSubmit(
                handleSubmitQueryFeedOperatorForm
              )}
              startIcon={<SearchIcon />}
            >
              查詢
            </AutoLoadingButton>
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
