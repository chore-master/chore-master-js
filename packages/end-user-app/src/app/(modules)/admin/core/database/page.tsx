'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import CodeBlock from '@/components/CodeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type CoreInputs = {
  relational_database_origin: string
  relational_database_schema_name?: string
}

interface Revision {
  revision: string
}

const rootRevision = {
  revision: 'N/A',
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [allRevisions, setAllRevisions] = React.useState<Revision[]>([])
  const [appliedRevision, setAppliedRevision] = React.useState<Revision>()
  const [focusedRevisionScriptContent, setFocusedRevisionScriptContent] =
    React.useState(null)
  // const { sync: syncEndUser } = useEndUser()

  const coreIntegrationForm = useForm<CoreInputs>()

  React.useEffect(() => {
    fetchCoreIntegration()
  }, [])

  const fetchCoreIntegration = async () => {
    await choreMasterAPIAgent.get('/v1/account_center/integrations/core', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        coreIntegrationForm.reset({
          relational_database_origin: data.relational_database_origin || '',
          relational_database_schema_name:
            data.relational_database_schema_name || '',
        })
        if (data.applied_revision) {
          setAllRevisions(data.all_revisions)
          setAppliedRevision(data.applied_revision)
        } else {
          setAllRevisions([...data.all_revisions, rootRevision])
          setAppliedRevision(rootRevision)
        }
      },
    })
  }

  const onSubmitCoreIntegrationForm: SubmitHandler<CoreInputs> = async (
    data
  ) => {
    await choreMasterAPIAgent.patch(
      '/v1/account_center/integrations/core/relational_database',
      data,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchCoreIntegration()
        },
      }
    )
  }

  const onUpgradeClick = async () => {
    await choreMasterAPIAgent.post(
      '/v1/account_center/integrations/core/relational_database/migrations/upgrade',
      null,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchCoreIntegration()
        },
      }
    )
  }

  const onDowngradeClick = async () => {
    const isConfirmed = confirm('降版可能導致資料遺失，確定要繼續嗎？')
    if (!isConfirmed) {
      return
    }
    await choreMasterAPIAgent.post(
      '/v1/account_center/integrations/core/relational_database/migrations/downgrade',
      null,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchCoreIntegration()
        },
      }
    )
  }

  const onGenerateRevisionClick = async () => {
    await choreMasterAPIAgent.post(
      '/v1/account_center/integrations/core/relational_database/migrations/generate_revision',
      null,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchCoreIntegration()
        },
      }
    )
  }

  const handleDeleteRevision = async (revision: string) => {
    await choreMasterAPIAgent.delete(
      `/v1/account_center/integrations/core/relational_database/migrations/${revision}`,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchCoreIntegration()
        },
      }
    )
  }

  const handleRevisionClick = async (revision: string) => {
    await choreMasterAPIAgent.get(
      `/v1/account_center/integrations/core/relational_database/migrations/${revision}`,
      {
        params: {},
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: any) => {
          await setFocusedRevisionScriptContent(data.script_content)
        },
      }
    )
  }

  const onResetClick = async () => {
    const isConfirmed = confirm('即將重設此資料庫至原始狀態，確定要繼續嗎？')
    if (!isConfirmed) {
      return
    }
    await choreMasterAPIAgent.post(
      `/v1/account_center/integrations/core/relational_database/reset`,
      null,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async ({ data }: any) => {
          await fetchCoreIntegration()
          enqueueNotification('格式化完成。', 'success')
        },
      }
    )
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="資料庫" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography mb={3}>
              Chore Master
              使用關聯式資料庫來儲存此帳戶產生的資料，您必須完成此設定才能使用完整服務。
            </Typography>
            <Stack component="form" spacing={3} autoComplete="off">
              <Controller
                control={coreIntegrationForm.control}
                name="relational_database_origin"
                defaultValue=""
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label="連線字串"
                    variant="standard"
                  />
                )}
              />
              <Controller
                control={coreIntegrationForm.control}
                name="relational_database_schema_name"
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="綱要" variant="standard" />
                )}
              />
              <LoadingButton
                variant="contained"
                onClick={coreIntegrationForm.handleSubmit(
                  onSubmitCoreIntegrationForm
                )}
                loading={coreIntegrationForm.formState.isSubmitting}
              >
                儲存
              </LoadingButton>
            </Stack>
          </Box>
        </ModuleFunctionBody>
        <ModuleFunctionBody>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
              <Stack spacing={1} direction="row" alignItems="center">
                <InfoOutlinedIcon fontSize="small" />
                <Typography>連線範本</Typography>
              </Stack>
            </AccordionSummary>
            <TableContainer component={AccordionDetails}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>資料庫服務</TableCell>
                    <TableCell>範例連線字串</TableCell>
                    <TableCell>範例綱要</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {'SQLite'}
                    </TableCell>
                    <TableCell>
                      <pre>{'sqlite+aiosqlite:///./local.db'}</pre>
                    </TableCell>
                    <TableCell>{'（不支援）'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {'PostgreSQL'}
                    </TableCell>
                    <TableCell>
                      <pre>
                        {'postgresql+asyncpg://user:password@postgresserver/db'}
                      </pre>
                    </TableCell>
                    <TableCell>
                      <pre>{'public'}</pre>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Accordion>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="版本及遷移" />
        <ModuleFunctionBody>
          <List>
            {allRevisions.map((iteratedRevision) => {
              const headRevision = allRevisions[0]
              const isHeadRevision =
                iteratedRevision.revision === headRevision?.revision
              const isRootRevision =
                iteratedRevision.revision === rootRevision.revision
              const isAppliedRevision =
                iteratedRevision.revision === appliedRevision?.revision

              let secondaryAction = undefined
              if (isAppliedRevision) {
                secondaryAction = (
                  <Stack direction="row" spacing={1}>
                    <AutoLoadingButton
                      variant="contained"
                      disabled={isHeadRevision}
                      onClick={onUpgradeClick}
                    >
                      升版至最新
                    </AutoLoadingButton>
                    <AutoLoadingButton
                      disabled={isRootRevision}
                      onClick={onDowngradeClick}
                    >
                      降版
                    </AutoLoadingButton>
                    <AutoLoadingButton
                      disabled={!isHeadRevision}
                      onClick={onGenerateRevisionClick}
                    >
                      建立新版
                    </AutoLoadingButton>
                  </Stack>
                )
              } else if (isHeadRevision) {
                secondaryAction = (
                  <Stack direction="row" spacing={1}>
                    <AutoLoadingButton
                      color="warning"
                      onClick={async () =>
                        await handleDeleteRevision(iteratedRevision.revision)
                      }
                    >
                      刪除
                    </AutoLoadingButton>
                  </Stack>
                )
              }
              return (
                <ListItem
                  key={iteratedRevision.revision}
                  secondaryAction={secondaryAction}
                >
                  <ListItemText>
                    <Chip
                      label={iteratedRevision.revision}
                      color={isAppliedRevision ? 'primary' : undefined}
                      onClick={() =>
                        handleRevisionClick(iteratedRevision.revision)
                      }
                    />
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </ModuleFunctionBody>
      </ModuleFunction>

      <ModuleFunction>
        <ModuleFunctionHeader title="進階操作" />
        <ModuleFunctionBody>
          <Box p={2}>
            <AutoLoadingButton
              variant="contained"
              color="error"
              onClick={onResetClick}
            >
              格式化
            </AutoLoadingButton>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>

      <Dialog
        onClose={() => setFocusedRevisionScriptContent(null)}
        open={Boolean(focusedRevisionScriptContent)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>遷移程式碼</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <CodeBlock
            language="python"
            showLineNumbers
            code={focusedRevisionScriptContent}
            customStyle={{ margin: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFocusedRevisionScriptContent(null)}>
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
