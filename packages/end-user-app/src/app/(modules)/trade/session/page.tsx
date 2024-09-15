'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Papa, { ParseResult } from 'papaparse'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type UploadSessionInputs = {
  session_file: FileList
}

export default function Page() {
  const uploadSessionForm = useForm<UploadSessionInputs>()

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
            console.log(result.data)
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
        <ModuleFunctionHeader title="Session" />
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
                    <label>選擇 session.csv 檔案：</label>
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
                處理
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
