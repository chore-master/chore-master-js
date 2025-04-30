import { useModuleLayout } from '@/utils/moduleLayout'
import React from 'react'
import ReactDOM from 'react-dom'

export default function SidePanel({
  id,
  children,
}: Readonly<{
  id: string
  children?: React.ReactNode
}>) {
  const moduleLayout = useModuleLayout()

  if (!moduleLayout.portalContainerRef?.current) {
    return null
  }

  const isActive = moduleLayout.activePanelId === id
  if (!isActive) {
    return null
  }

  //   React.useEffect(() => {
  //     const isActive = moduleLayout.activeSidePanel?.id === id
  //     if (isActive) {
  //       moduleLayout.registerSidePanel({
  //         id,
  //         content: children,
  //       })
  //     }
  //   }, [moduleLayout.activeSidePanel])

  //   const getContent = React.useCallback(() => {
  //     return <React.Fragment key={random(1, 1000000)}>{children}</React.Fragment>
  //   }, [children])

  //   React.useEffect(() => {
  //     setKey(key + 1)
  //   }, [children])

  //   React.useEffect(() => {
  //     moduleLayout.registerSidePanel({
  //       id,
  //       content: (
  //         <React.Fragment key={random(1, 1000000)}>{children}</React.Fragment>
  //       ),
  //     })
  //   }, [])

  //   return null
  return ReactDOM.createPortal(
    children,
    moduleLayout.portalContainerRef?.current as HTMLDivElement
  )
}
