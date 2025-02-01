'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import CodeBlock from '@/components/CodeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
import choreMasterAPIAgent from '@/utils/apiAgent'
import * as datetimeUtils from '@/utils/datetime'
import { useNotification } from '@/utils/notification'
import { humanReadableFileSize } from '@/utils/size'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FolderIcon from '@mui/icons-material/Folder'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface UploadTablesInputs {
  table_files: FileList
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const uploadTablesForm = useForm<UploadTablesInputs>()
  const [isDirectorySelected, setIsDirectorySelected] =
    React.useState<boolean>(false)
  const [directoryPath, setDirectoryPath] = React.useState<string | undefined>()
  const [allTableFiles, setAllTableFiles] = React.useState<File[]>([])
  const [selectedTableFileIndices, setSelectedTableFileIndices] =
    React.useState<number[]>([])

  const onSubmitUploadTablesForm: SubmitHandler<UploadTablesInputs> = async (
    data
  ) => {
    const files = Array.from(data.table_files || [])
    setAllTableFiles(files)
    setSelectedTableFileIndices(files.map((file, index) => index))
    if (files.length > 0) {
      setDirectoryPath(files[0].webkitRelativePath.split('/').at(0))
    } else {
      setDirectoryPath(undefined)
    }
    setIsDirectorySelected(true)
  }

  const handleUploadTableFiles = async () => {
    const tableFiles = selectedTableFileIndices.map(
      (index) => allTableFiles[index]
    )
    const formData = new FormData()
    tableFiles.forEach((file) => {
      formData.append('upload_files', file)
    })
    await choreMasterAPIAgent.patch(
      '/v1/admin/database/tables/data/import_files',
      formData,
      {
        onError: () => {
          enqueueNotification(
            'Something wrong happened. Service may be unavailable now.',
            'error'
          )
        },
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          enqueueNotification('匯入成功', 'success')
          setSelectedTableFileIndices([])
        },
      }
    )
  }

  const baseDateTime = new Date()

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="匯入資料表" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Stack
              component="form"
              spacing={3}
              autoComplete="off"
              direction="row"
            >
              <Controller
                control={uploadTablesForm.control}
                name="table_files"
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    startIcon={<FolderIcon />}
                  >
                    {directoryPath ? '重新選擇資料夾' : '選擇資料夾'}{' '}
                    <input
                      multiple
                      type="file"
                      {...{ webkitdirectory: '' }}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      name={field.name}
                      onChange={(e) => {
                        field.onChange(e.target.files)
                        void uploadTablesForm.handleSubmit(
                          onSubmitUploadTablesForm
                        )()
                      }}
                      style={{
                        clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',
                        height: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        whiteSpace: 'nowrap',
                        width: 1,
                      }}
                    />
                  </Button>
                )}
              />
              <Button
                onClick={() => {
                  uploadTablesForm.reset()
                  setIsDirectorySelected(false)
                  setDirectoryPath(undefined)
                  setAllTableFiles([])
                  setSelectedTableFileIndices([])
                }}
                disabled={!isDirectorySelected}
              >
                重設
              </Button>
            </Stack>
          </Box>
        </ModuleFunctionBody>

        {isDirectorySelected && (
          <ModuleFunctionBody>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              justifyItems="space-between"
              sx={{ p: 2 }}
            >
              {allTableFiles.length === 0 ? (
                <Typography variant="body2">資料夾中沒有任何檔案</Typography>
              ) : (
                <Chip label={directoryPath} />
              )}

              <AutoLoadingButton
                variant="contained"
                onClick={() => handleUploadTableFiles()}
                disabled={selectedTableFileIndices.length === 0}
              >
                匯入 {selectedTableFileIndices.length} 個檔案
              </AutoLoadingButton>
            </Stack>
            {allTableFiles.length > 0 && (
              <React.Fragment>
                <Divider />
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <NoWrapTableCell />
                        <NoWrapTableCell>
                          <Checkbox
                            size="small"
                            checked={
                              selectedTableFileIndices.length ===
                              allTableFiles.length
                            }
                            indeterminate={
                              selectedTableFileIndices.length > 0 &&
                              selectedTableFileIndices.length <
                                allTableFiles.length
                            }
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedTableFileIndices(
                                  allTableFiles.map((file, index) => index)
                                )
                              } else {
                                setSelectedTableFileIndices([])
                              }
                            }}
                          />
                        </NoWrapTableCell>
                        <NoWrapTableCell>檔案路徑</NoWrapTableCell>
                        <NoWrapTableCell>大小</NoWrapTableCell>
                        <NoWrapTableCell>
                          最後修改時間（瀏覽器時區）
                        </NoWrapTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allTableFiles.map((file, index) => {
                        const isSelected =
                          selectedTableFileIndices.includes(index)
                        const lastModifiedDate = new Date(file.lastModified)
                        return (
                          <TableRow
                            key={file.webkitRelativePath}
                            hover
                            selected={isSelected}
                          >
                            <NoWrapTableCell>#{index + 1}</NoWrapTableCell>
                            <NoWrapTableCell>
                              <Checkbox
                                size="small"
                                checked={isSelected}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setSelectedTableFileIndices([
                                      ...selectedTableFileIndices,
                                      index,
                                    ])
                                  } else {
                                    setSelectedTableFileIndices(
                                      selectedTableFileIndices.filter(
                                        (i) => i !== index
                                      )
                                    )
                                  }
                                }}
                              />
                            </NoWrapTableCell>
                            <NoWrapTableCell>
                              <Chip
                                icon={
                                  <Tooltip title={file.webkitRelativePath}>
                                    <MoreHorizIcon />
                                  </Tooltip>
                                }
                                label={file.webkitRelativePath
                                  .split('/')
                                  .slice(1)
                                  .join('/')}
                                size="small"
                              />
                            </NoWrapTableCell>
                            <NoWrapTableCell>
                              {humanReadableFileSize(file.size)}
                            </NoWrapTableCell>
                            <NoWrapTableCell>
                              {datetimeUtils.dateToLocalString(
                                lastModifiedDate
                              )}
                              {` (${datetimeUtils.humanReadableRelativeDateTime(
                                datetimeUtils.localStringToUTCString(
                                  datetimeUtils.dateToLocalString(
                                    lastModifiedDate
                                  )
                                ),
                                baseDateTime
                              )})`}
                            </NoWrapTableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </ModuleFunctionBody>
        )}

        <ModuleFunctionBody>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Stack spacing={1} direction="row" alignItems="center">
                <InfoOutlinedIcon fontSize="small" />
                <Typography>範本</Typography>
              </Stack>
            </AccordionSummary>
            <TableContainer component={AccordionDetails}>
              <Table>
                <TableHead>
                  <TableRow>
                    <NoWrapTableCell>檔案路徑</NoWrapTableCell>
                    <NoWrapTableCell>CSV 內容</NoWrapTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <NoWrapTableCell>insert/table_1.csv</NoWrapTableCell>
                    <NoWrapTableCell>
                      <CodeBlock
                        language="csv"
                        code={`OP,reference,column_1,column_2,column_3,column_4,column_5,column_6
INSERT,dkb3t,False,123,0.3,456.78,hello,2025-01-01T00:00:00.000Z`}
                      />
                    </NoWrapTableCell>
                  </TableRow>
                  <TableRow>
                    <NoWrapTableCell>update/table_1.csv</NoWrapTableCell>
                    <NoWrapTableCell>
                      <CodeBlock
                        language="csv"
                        code={`OP,reference,column_1,column_6
UPDATE,dkb3t,True,2025-12-31T23:59:59.999Z`}
                      />
                    </NoWrapTableCell>
                  </TableRow>
                  <TableRow>
                    <NoWrapTableCell>delete/table_1.csv</NoWrapTableCell>
                    <NoWrapTableCell>
                      <CodeBlock
                        language="csv"
                        code={`OP,reference
DELETE,dkb3t`}
                      />
                    </NoWrapTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Accordion>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
