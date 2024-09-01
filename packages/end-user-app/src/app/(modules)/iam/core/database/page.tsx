'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
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
  const [allRevisions, setAllRevisions] = React.useState<Revision[]>([])
  const [appliedRevision, setAppliedRevision] = React.useState<Revision>()
  // const { sync: syncEndUser } = useEndUser()

  const coreIntegrationForm = useForm<CoreInputs>()

  React.useEffect(() => {
    fetchCoreIntegration()
  }, [])

  const fetchCoreIntegration = () => {
    choreMasterAPIAgent.get('/v1/account_center/integrations/core', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
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
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
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
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
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
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
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
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
        },
      }
    )
  }

  const handleDeleteRevision = async (revision: string) => {
    await choreMasterAPIAgent.delete(
      `/v1/account_center/integrations/core/relational_database/migrations/${revision}`,
      {
        onFail: ({ message }: any) => {
          alert(message)
        },
        onSuccess: () => {
          fetchCoreIntegration()
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
                    <Button
                      variant="contained"
                      disabled={isHeadRevision}
                      onClick={onUpgradeClick}
                    >
                      升版至最新
                    </Button>
                    <Button
                      disabled={isRootRevision}
                      onClick={onDowngradeClick}
                    >
                      降版
                    </Button>
                    <Button
                      disabled={!isHeadRevision}
                      onClick={onGenerateRevisionClick}
                    >
                      建立新版
                    </Button>
                  </Stack>
                )
              } else if (isHeadRevision) {
                secondaryAction = (
                  <Stack direction="row" spacing={1}>
                    <Button
                      color="warning"
                      onClick={() =>
                        handleDeleteRevision(iteratedRevision.revision)
                      }
                    >
                      刪除
                    </Button>
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
            <Button variant="contained" color="error">
              格式化
            </Button>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
