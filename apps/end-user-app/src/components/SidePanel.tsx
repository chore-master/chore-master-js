'use client'

import React from 'react'
import ReactDOM from 'react-dom'

interface SidePanelContextType {
  activePanelId: string | null
  portalContainer: HTMLElement | null | undefined
  open: (panelId: string) => void
  close: () => void
  setPortalContainer: (ref: HTMLElement | null | undefined) => void
}

const SidePanelContext = React.createContext<SidePanelContextType>({
  activePanelId: null,
  portalContainer: null,
  open: () => {},
  close: () => {},
  setPortalContainer: () => {},
})

export const SidePanelProvider = (props: any) => {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)
  const [activePanelId, setActivePanelId] = React.useState<string | undefined>()

  const open = (panelId: string) => {
    setActivePanelId(panelId)
  }

  const close = () => {
    setActivePanelId(undefined)
  }

  return (
    <SidePanelContext.Provider
      value={{
        activePanelId,
        portalContainer,
        open,
        close,
        setPortalContainer,
      }}
      {...props}
    />
  )
}

export const useSidePanel = () => {
  const ctx = React.useContext(SidePanelContext)
  return {
    activePanelId: ctx.activePanelId,
    portalContainer: ctx.portalContainer,
    open: ctx.open,
    close: ctx.close,
    setPortalContainer: ctx.setPortalContainer,
  }
}

export default function SidePanel({
  id,
  children,
}: Readonly<{
  id: string
  children?: React.ReactNode
}>) {
  const sidePanel = useSidePanel()

  if (!sidePanel.portalContainer) {
    return null
  }

  const isActive = sidePanel.activePanelId === id
  if (!isActive) {
    return null
  }

  return ReactDOM.createPortal(children, sidePanel.portalContainer)
}
