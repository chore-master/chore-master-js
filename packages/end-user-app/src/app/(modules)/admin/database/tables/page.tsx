'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function Page() {
  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="資料表" />
        <ModuleFunctionBody>
          <Typography sx={{ p: 2 }}>資料匯入匯出等功能。</Typography>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
