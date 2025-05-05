'use client'

import React from 'react'
import ReactDOM from 'react-dom'

interface SidePanelContextType {
  activeId: string | null
  portalContainer: HTMLElement | null | undefined
  isActive: boolean
  open: (panelId: string) => void
  close: () => void
  setPortalContainer: (ref: HTMLElement | null | undefined) => void
}

const SidePanelContext = React.createContext<SidePanelContextType>({
  activeId: null,
  portalContainer: null,
  isActive: false,
  open: () => {},
  close: () => {},
  setPortalContainer: () => {},
})

export const SidePanelProvider = (props: any) => {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const open = (panelId: string) => {
    setActiveId(panelId)
  }

  const close = () => {
    setActiveId(null)
  }

  return (
    <SidePanelContext.Provider
      value={{
        activeId,
        portalContainer,
        isActive: activeId !== null,
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
  return ctx
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

  const isActive = sidePanel.activeId === id
  if (!isActive) {
    return null
  }

  return ReactDOM.createPortal(children, sidePanel.portalContainer)
}
