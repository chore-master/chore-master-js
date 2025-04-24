'use client'

import React from 'react'

interface ModuleLayoutContextType {
  isSidePanelOpen: boolean
  setIsSidePanelOpen: (isSidePanelOpen: boolean) => void
}

const ModuleLayoutContext = React.createContext<ModuleLayoutContextType>({
  isSidePanelOpen: false,
  setIsSidePanelOpen: () => {},
})

export const ModuleLayoutProvider = (props: any) => {
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false)

  return (
    <ModuleLayoutContext.Provider
      value={{
        isSidePanelOpen,
        setIsSidePanelOpen,
      }}
      {...props}
    />
  )
}

export const useModuleLayout = () => {
  const moduleLayoutContext = React.useContext(ModuleLayoutContext)
  return {
    isSidePanelOpen: moduleLayoutContext.isSidePanelOpen,
    setIsSidePanelOpen: moduleLayoutContext.setIsSidePanelOpen,
  }
}
