import { useModuleLayout } from '@/utils/moduleLayout'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React from 'react'

export default function SidePanelWrapper() {
  const theme = useTheme()
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'))
  const moduleLayout = useModuleLayout()
  const splitterPanelRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (isUpMd) {
      moduleLayout.setPortalContainerRef(splitterPanelRef)
    }
  }, [isUpMd])

  //   if (!moduleLayout.isSidePanelOpen) {
  //     return null
  //   }
  return (
    <>
      <Divider orientation="vertical" flexItem />
      <Stack
        ref={splitterPanelRef}
        sx={(theme) => ({
          // minWidth: sideNavWidth,
          backgroundColor: theme.palette.background.default,
          overflowX: 'auto',
          // position: 'sticky',
          // top: 0,
          // height: 'calc(100vh - var(--scrollbar-width))',
          height: '100vh',
          // flexGrow: 1,
        })}
      >
        {moduleLayout.activeSidePanel?.content}
      </Stack>
    </>
  )
}
