'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
  ModuleSplitter,
  ModuleSplitterPanel,
} from '@/components/ModuleFunction'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <ModuleSplitter layout="vertical" style={{ height: 'calc(100dvh - 65px)' }}>
      <ModuleSplitterPanel size={75} style={{ overflow: 'auto' }}>
        <ModuleFunction>
          <ModuleFunctionHeader title="主要標題" />
          <ModuleFunctionBody>
            <Typography style={{ height: '600px' }}>主要內容</Typography>
          </ModuleFunctionBody>
        </ModuleFunction>
      </ModuleSplitterPanel>
      <ModuleSplitterPanel size={25} style={{ overflow: 'auto' }}>
        <Paper elevation={0} sx={{ flexGrow: 1 }}>
          <Typography style={{ height: '600px' }}>次要內容</Typography>
        </Paper>
      </ModuleSplitterPanel>
    </ModuleSplitter>
  )
}
