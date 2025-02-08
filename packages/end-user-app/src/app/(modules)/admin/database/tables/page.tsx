'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import CodeBlock from '@/components/CodeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
  ModuleSplitter,
  ModuleSplitterPanel,
} from '@/components/ModuleFunction'
import NoWrapTableCell from '@/components/NoWrapTableCell'
import choreMasterAPIAgent from '@/utils/apiAgent'
import * as blobUtils from '@/utils/blob'
import * as datetimeUtils from '@/utils/datetime'
import { useNotification } from '@/utils/notification'
import * as sizeUtils from '@/utils/size'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FolderIcon from '@mui/icons-material/Folder'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import RefreshIcon from '@mui/icons-material/Refresh'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
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

interface AdminDatabaseTable {
  name: string
  columns: AdminDatabaseColumn[]
}

interface AdminDatabaseColumn {
  name: string
  type: string
}

interface AdminDatabaseSchema {
  name: string | null
  tables: AdminDatabaseTable[]
}

interface UploadTablesInputs {
  table_files: FileList
}

export default function Page() {
  const { enqueueNotification } = useNotification()

  // Database schema
  const [isLoadingDatabaseSchema, setIsLoadingDatabaseSchema] =
    React.useState<boolean>(true)
  const [databaseSchema, setDatabaseSchema] =
    React.useState<AdminDatabaseSchema>({
      name: null,
      tables: [],
    })
  const [viewingTableIndex, setViewingTableIndex] = React.useState<
    number | undefined
  >()
  const [tableNameToSelectedColumnNames, setTableNameToSelectedColumnNames] =
    React.useState<Record<string, string[]>>({})

  // Import table files
  const uploadTablesForm = useForm<UploadTablesInputs>()
  const [isDirectorySelected, setIsDirectorySelected] =
    React.useState<boolean>(false)
  const [directoryPath, setDirectoryPath] = React.useState<string | undefined>()
  const [allTableFiles, setAllTableFiles] = React.useState<File[]>([])
  const [selectedTableFileIndices, setSelectedTableFileIndices] =
    React.useState<number[]>([])

  const fetchDatabaseSchema = React.useCallback(async () => {
    setIsLoadingDatabaseSchema(true)
    await choreMasterAPIAgent.get('/v1/admin/database/schema', {
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
        setDatabaseSchema(data)
      },
    })
    setIsLoadingDatabaseSchema(false)
  }, [enqueueNotification])

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

  const handleImportTableFiles = async () => {
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

  const handleExportTableFiles = async () => {
    await choreMasterAPIAgent.post(
      '/v1/admin/database/tables/data/export_files',
      {
        table_name_to_selected_column_names: tableNameToSelectedColumnNames,
      },
      {
        onError: () => {
          enqueueNotification(
            'Something wrong happened. Service may be unavailable now.',
            'error'
          )
        },
        onSuccess: async ({ blob }: { blob: Blob }) => {
          blobUtils.downloadBlobAsFile(blob, 'download.zip')
        },
      }
    )
  }

  const selectAllColumns = React.useCallback(() => {
    setTableNameToSelectedColumnNames(
      databaseSchema?.tables?.reduce(
        (acc: Record<string, string[]>, table: any) => {
          acc[table.name] = table.columns.map((column: any) => column.name)
          return acc
        },
        {}
      ) ?? {}
    )
  }, [databaseSchema])

  React.useEffect(() => {
    fetchDatabaseSchema()
  }, [fetchDatabaseSchema])

  React.useEffect(() => {
    selectAllColumns()
  }, [databaseSchema, selectAllColumns])

  const baseDateTime = new Date()

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="匯出"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton onClick={() => void fetchDatabaseSchema()}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />

        <ModuleFunctionBody loading={isLoadingDatabaseSchema}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <AutoLoadingButton
              variant="contained"
              onClick={() => handleExportTableFiles()}
              disabled={Object.values(tableNameToSelectedColumnNames).every(
                (selectedColumnNames) => selectedColumnNames.length === 0
              )}
            >
              匯出{' '}
              {Object.values(tableNameToSelectedColumnNames).reduce(
                (acc, selectedColumnNames) => acc + selectedColumnNames.length,
                0
              )}{' '}
              個欄位
            </AutoLoadingButton>
          </Stack>
          <Divider />
          <ModuleSplitter layout="horizontal">
            <ModuleSplitterPanel size={25} style={{ overflow: 'auto' }}>
              <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <List sx={{ flexGrow: 1 }}>
                  <ListSubheader>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      checked={Object.entries(
                        tableNameToSelectedColumnNames
                      ).every(
                        ([tableName, selectedColumnNames]) =>
                          selectedColumnNames.length ===
                          databaseSchema.tables.find(
                            (table) => table.name === tableName
                          )?.columns.length
                      )}
                      indeterminate={
                        Object.values(tableNameToSelectedColumnNames).some(
                          (selectedColumnNames) =>
                            selectedColumnNames.length > 0
                        ) &&
                        !Object.entries(tableNameToSelectedColumnNames).every(
                          ([tableName, selectedColumnNames]) =>
                            selectedColumnNames.length ===
                            databaseSchema.tables.find(
                              (table) => table.name === tableName
                            )?.columns.length
                        )
                      }
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectAllColumns()
                        } else {
                          setTableNameToSelectedColumnNames(
                            databaseSchema.tables.reduce(
                              (acc: Record<string, string[]>, table) => {
                                acc[table.name] = []
                                return acc
                              },
                              {}
                            )
                          )
                        }
                      }}
                    />
                    {databaseSchema.name ?? '（綱要）'}
                  </ListSubheader>
                  {databaseSchema.tables.map((table, index) => {
                    const selectedColumnNames =
                      tableNameToSelectedColumnNames[table.name] ?? []
                    return (
                      <ListItem key={table.name} disablePadding>
                        <ListItemButton
                          dense
                          onClick={() => {
                            setViewingTableIndex(index)
                          }}
                          selected={viewingTableIndex === index}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="end"
                              tabIndex={-1}
                              disableRipple
                              checked={
                                selectedColumnNames.length ===
                                table.columns.length
                              }
                              indeterminate={
                                selectedColumnNames.length > 0 &&
                                selectedColumnNames.length <
                                  table.columns.length
                              }
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setTableNameToSelectedColumnNames({
                                    ...tableNameToSelectedColumnNames,
                                    [table.name]: table.columns.map(
                                      (column) => column.name
                                    ),
                                  })
                                } else {
                                  setTableNameToSelectedColumnNames({
                                    ...tableNameToSelectedColumnNames,
                                    [table.name]: [],
                                  })
                                }
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={table.name} />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </Box>
            </ModuleSplitterPanel>
            <ModuleSplitterPanel size={75} style={{ overflow: 'auto' }}>
              {viewingTableIndex !== undefined && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <NoWrapTableCell />
                        <NoWrapTableCell />
                        <NoWrapTableCell>欄位名稱</NoWrapTableCell>
                        <NoWrapTableCell>欄位型別</NoWrapTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {databaseSchema.tables[viewingTableIndex].columns.map(
                        (column, index) => {
                          const viewingTable =
                            databaseSchema.tables[viewingTableIndex]
                          const isSelected = tableNameToSelectedColumnNames[
                            viewingTable.name
                          ].includes(column.name)
                          return (
                            <TableRow
                              key={`${viewingTable.name}.${column.name}`}
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
                                      setTableNameToSelectedColumnNames({
                                        ...tableNameToSelectedColumnNames,
                                        [viewingTable.name]: [
                                          ...tableNameToSelectedColumnNames[
                                            viewingTable.name
                                          ],
                                          column.name,
                                        ],
                                      })
                                    } else {
                                      setTableNameToSelectedColumnNames({
                                        ...tableNameToSelectedColumnNames,
                                        [viewingTable.name]:
                                          tableNameToSelectedColumnNames[
                                            viewingTable.name
                                          ].filter(
                                            (name) => name !== column.name
                                          ),
                                      })
                                    }
                                  }}
                                />
                              </NoWrapTableCell>
                              <NoWrapTableCell>{column.name}</NoWrapTableCell>
                              <NoWrapTableCell>{column.type}</NoWrapTableCell>
                            </TableRow>
                          )
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </ModuleSplitterPanel>
          </ModuleSplitter>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="匯入" />
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
              sx={{ p: 2 }}
            >
              {allTableFiles.length === 0 ? (
                <Typography variant="body2">資料夾中沒有任何檔案</Typography>
              ) : (
                <Chip label={directoryPath} />
              )}

              <AutoLoadingButton
                variant="contained"
                onClick={() => handleImportTableFiles()}
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
                              {sizeUtils.humanReadableFileSize(file.size)}
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
                        code={`OP,OP_REFERENCE,reference,column_1,column_6
UPDATE,dkb3t,d8g47,True,2025-12-31T23:59:59.999Z`}
                      />
                    </NoWrapTableCell>
                  </TableRow>
                  <TableRow>
                    <NoWrapTableCell>delete/table_1.csv</NoWrapTableCell>
                    <NoWrapTableCell>
                      <CodeBlock
                        language="csv"
                        code={`OP,OP_REFERENCE
DELETE,d8g47`}
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
