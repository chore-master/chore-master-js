'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React from 'react'

interface CoreData {
  relational_database_origin?: string
  relational_database_schema_name?: string
  applied_revision?: {
    revision?: string
  }
}

export default function Page() {
  const [coreData, setCoreData] = React.useState<CoreData>({})

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
        setCoreData((d) => ({
          ...d,
          relational_database_origin: data.relational_database_origin,
          relational_database_schema_name: data.relational_database_schema_name,
          applied_revision: data.applied_revision,
        }))
      },
    })
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="基礎設施狀態" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography variant="h6">資料庫</Typography>
            <List>
              <ListItemText>
                連線：{coreData.relational_database_origin || '未設定'}
              </ListItemText>
              <ListItemText>
                綱要：{coreData.relational_database_schema_name || '未設定'}
              </ListItemText>
              <ListItemText>
                目前版本：{coreData?.applied_revision?.revision || '無'}
              </ListItemText>
            </List>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
