import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function Page() {
  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="儀表板" />
        <ModuleFunctionBody>
          <Box p={2}>
            <Typography>無內容。</Typography>
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
