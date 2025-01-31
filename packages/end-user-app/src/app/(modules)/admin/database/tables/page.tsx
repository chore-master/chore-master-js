'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
import * as datetimeUtils from '@/utils/datetime'
import { humanReadableFileSize } from '@/utils/size'
import FolderIcon from '@mui/icons-material/Folder'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
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
    console.log(tableFiles)
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
      </ModuleFunction>
    </React.Fragment>
  )
}
