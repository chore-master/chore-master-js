'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function Page() {
  const [tabValue, setTabValue] = React.useState<string>('tab1')
  return (
    <TabContext value={tabValue}>
      <ModuleFunction sx={{ pb: 0 }}>
        <ModuleFunctionHeader title="頁籤" />
        <Box sx={{ mx: 2, mt: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            variant="scrollable"
            scrollButtons={false}
            onChange={(event: React.SyntheticEvent, newValue: string) => {
              setTabValue(newValue)
            }}
          >
            <Tab label="Tab 1" value="tab1" />
            <Tab label="Tab 2" value="tab2" />
            <Tab label="Tab 3" value="tab3" />
          </TabList>
        </Box>
      </ModuleFunction>

      <TabPanel value="tab1" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader
            title={<Typography variant="h6">Tab 1 標題一</Typography>}
          />
          <ModuleFunctionBody>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">Tab 1 內容一</Typography>
            </Box>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="tab2" sx={{ p: 0 }}>
        <ModuleFunction>
          <ModuleFunctionHeader
            title={<Typography variant="h6">Tab 2 標題一</Typography>}
          />
          <ModuleFunctionBody>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">Tab 2 內容一</Typography>
            </Box>
          </ModuleFunctionBody>
        </ModuleFunction>
        <ModuleFunction>
          <ModuleFunctionHeader
            title={<Typography variant="h6">Tab 2 標題二</Typography>}
          />
          <ModuleFunctionBody>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">Tab 2 內容二</Typography>
            </Box>
          </ModuleFunctionBody>
        </ModuleFunction>
      </TabPanel>

      <TabPanel value="tab3" sx={{ p: 0 }}>
        <Typography>滿版寬度，可自由運用</Typography>
      </TabPanel>
    </TabContext>
  )
}
