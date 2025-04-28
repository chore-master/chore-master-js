'use client'

import React from 'react'
import { usePrevious } from 'react-use'

export interface SidePanel {
  id: string
  content: React.ReactNode
}

interface ModuleLayoutContextType {
  isSidePanelOpen: boolean
  activeSidePanel: SidePanel | null
  registerSidePanel: (panel: SidePanel) => void
  openSidePanel: (panelId: string) => void
  closeSidePanel: () => void
}

const ModuleLayoutContext = React.createContext<ModuleLayoutContextType>({
  isSidePanelOpen: false,
  activeSidePanel: null,
  registerSidePanel: () => {},
  openSidePanel: () => {},
  closeSidePanel: () => {},
})

export const ModuleLayoutProvider = (props: any) => {
  const [activePanelId, setActivePanelId] = React.useState<string | undefined>()
  // 為了避免關閉 Drawer 時畫面閃爍且無法流暢動畫，必須保留關閉前的 content
  const previousActivePanelId = usePrevious(activePanelId)
  const [panelIdToPanelMap, setPanelIdToPanelMap] = React.useState<{
    [key: string]: SidePanel
  }>({})

  const registerSidePanel = (panel: SidePanel) => {
    setPanelIdToPanelMap((prev) => ({ ...prev, [panel.id]: panel }))
  }

  const openSidePanel = (panelId: string) => {
    setActivePanelId(panelId)
  }

  const closeSidePanel = () => {
    setActivePanelId(undefined)
  }

  return (
    <ModuleLayoutContext.Provider
      value={{
        isSidePanelOpen: activePanelId !== undefined,
        activeSidePanel:
          activePanelId || previousActivePanelId
            ? panelIdToPanelMap[activePanelId ?? previousActivePanelId ?? '']
            : null,
        registerSidePanel,
        openSidePanel,
        closeSidePanel,
      }}
      {...props}
    />
  )
}

export const useModuleLayout = () => {
  const moduleLayoutContext = React.useContext(ModuleLayoutContext)
  return {
    isSidePanelOpen: moduleLayoutContext.isSidePanelOpen,
    activeSidePanel: moduleLayoutContext.activeSidePanel,
    registerSidePanel: moduleLayoutContext.registerSidePanel,
    openSidePanel: moduleLayoutContext.openSidePanel,
    closeSidePanel: moduleLayoutContext.closeSidePanel,
  }
}
