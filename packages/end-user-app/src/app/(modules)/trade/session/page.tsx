'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import SessionChart from '@/components/charts/SessionChart'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Papa, { ParseResult } from 'papaparse'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type UploadSessionInputs = {
  session_file: FileList
}

export default function Page() {
  const uploadSessionForm = useForm<UploadSessionInputs>()
  const [datapoints, setDatapoints] = React.useState<any>([])

  const onSubmitUploadSessionForm: SubmitHandler<UploadSessionInputs> = async (
    data
  ) => {
    const file = data.session_file[0]

    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (event) => {
        const csvText = event.target?.result as string
        Papa.parse(csvText, {
          header: true,
          complete: (result: ParseResult<any>) => {
            setDatapoints(
              result.data
                .filter((row) => {
                  if (!row.context) {
                    return false
                  }
                  if (
                    row.operation === 'take' &&
                    row.symbol !== 'ETH/USDT:USDT-240927'
                  ) {
                    return false
                  }
                  return true
                })
                .map((row) => {
                  const context = JSON.parse(row.context)
                  return {
                    timeUTC: row.datetime_utc,
                    value: context.order_perp_implied_term_ir
                      ? context.order_perp_implied_term_ir
                      : null,
                    side: row.side,
                  }
                })
            )
          },
          error: (error: any) => {
            alert(`Error parsing CSV: ${error}`)
          },
        })
      }
      reader.readAsText(file)
    } else {
      alert('此檔案不是 csv 格式。')
    }
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="階段" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={uploadSessionForm.control}
                name="session_file"
                defaultValue={new DataTransfer().files}
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <React.Fragment>
                    <Typography>匯入 session.csv 檔案</Typography>
                    <input
                      type="file"
                      name={field.name}
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </React.Fragment>
                )}
              />
              <LoadingButton
                variant="contained"
                onClick={uploadSessionForm.handleSubmit(
                  onSubmitUploadSessionForm
                )}
                loading={uploadSessionForm.formState.isSubmitting}
              >
                分析
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>

        <ModuleFunctionBody>
          <SessionChart
            layout={{
              width: '100%',
              height: 600,
              marginTop: 48,
              marginLeft: 48,
              marginRight: 48,
              minWidth: 480,
            }}
            datapoints={datapoints}
          />
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
