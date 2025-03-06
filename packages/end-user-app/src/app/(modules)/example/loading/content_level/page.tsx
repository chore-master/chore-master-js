'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <ModuleFunction>
      <ModuleFunctionHeader title="某實體" />
      <ModuleFunctionBody loading>
        <Typography sx={{ p: 2 }}>實體詳細內容</Typography>
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
