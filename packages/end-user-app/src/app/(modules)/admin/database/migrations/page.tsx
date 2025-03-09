'use client'

import AutoLoadingButton from '@/components/AutoLoadingButton'
import CodeBlock from '@/components/CodeBlock'
import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import React from 'react'

interface Revision {
  revision: string
}

const rootRevision = {
  revision: 'N/A',
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isFetchingDatabaseRevisions, setIsFetchingDatabaseRevisions] =
    React.useState(true)
  const [allRevisions, setAllRevisions] = React.useState<Revision[]>([])
  const [appliedRevision, setAppliedRevision] = React.useState<Revision>()
  const [focusedRevisionScriptContent, setFocusedRevisionScriptContent] =
    React.useState(null)

  const fetchDatabaseRevisions = async () => {
    setIsFetchingDatabaseRevisions(true)
    await choreMasterAPIAgent.get('/v1/admin/user_database/connection', {
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
        if (data.applied_revision) {
          setAllRevisions(data.all_revisions)
          setAppliedRevision(data.applied_revision)
        } else {
          setAllRevisions([...data.all_revisions, rootRevision])
          setAppliedRevision(rootRevision)
        }
      },
    })
    setIsFetchingDatabaseRevisions(false)
  }

  const onUpgradeClick = async () => {
    await choreMasterAPIAgent.post(
      '/v1/admin/user_database/migrations/upgrade',
      null,
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
          await fetchDatabaseRevisions()
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
      '/v1/admin/user_database/migrations/downgrade',
      null,
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
          await fetchDatabaseRevisions()
        },
      }
    )
  }

  const onGenerateRevisionClick = async () => {
    await choreMasterAPIAgent.post(
      '/v1/admin/user_database/migrations/generate_revision',
      null,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchDatabaseRevisions()
        },
      }
    )
  }

  const handleDeleteRevision = async (revision: string) => {
    await choreMasterAPIAgent.delete(
      `/v1/admin/user_database/migrations/${revision}`,
      {
        onFail: ({ message }: any) => {
          enqueueNotification(message, 'error')
        },
        onSuccess: async () => {
          await fetchDatabaseRevisions()
        },
      }
    )
  }

  const handleRevisionClick = async (revision: string) => {
    await choreMasterAPIAgent.get(
      `/v1/admin/user_database/migrations/${revision}`,
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
    await choreMasterAPIAgent.post(`/v1/admin/user_database/reset`, null, {
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        await fetchDatabaseRevisions()
        enqueueNotification('格式化完成。', 'success')
      },
    })
  }

  React.useEffect(() => {
    fetchDatabaseRevisions()
  }, [])

  if (isFetchingDatabaseRevisions && allRevisions.length === 0) {
    return <LinearProgress />
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="遷徙管理" />
        <ModuleFunctionBody loading={isFetchingDatabaseRevisions}>
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
        closeAfterTransition={false}
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
