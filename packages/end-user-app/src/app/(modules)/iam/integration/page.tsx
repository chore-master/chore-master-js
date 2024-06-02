'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function Page() {
  const { endUser, sync: syncEndUser } = useEndUser()
  const initializeGoogleIntegrations = async () => {
    choreMasterAPIAgent.post('/v1/integrations/google/initialize', null, {
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async () => {
        syncEndUser()
      },
    })
  }

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="Google 整合" />
        <ModuleFunctionBody>
          <Box p={2}>
            {endUser?.root_folder_id ? (
              <React.Fragment>
                <Typography>Drive 根目錄：</Typography>
                <Typography color="secondary">
                  {endUser.root_folder_id}
                </Typography>
              </React.Fragment>
            ) : (
              <Button
                variant="contained"
                onClick={() => initializeGoogleIntegrations()}
              >
                啟用 Drive 根目錄
              </Button>
            )}
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
