'use client'

import Alert, { AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import React from 'react'

type Notification = {
  id: number
  message: string
  severity: AlertColor
}

type NotificationContextType = {
  enqueueNotification: (message: string, severity?: AlertColor) => void
}

const NotificationContext = React.createContext<
  NotificationContextType | undefined
>(undefined)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const enqueueNotification = React.useCallback(
    (message: string, severity: AlertColor = 'info') => {
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), message, severity },
      ])
    },
    []
  )

  const handleClose = (id: number) => () => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  return (
    <NotificationContext.Provider value={{ enqueueNotification }}>
      {children}
      {notifications.map((notification, i) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={6000}
          onClose={handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleClose(notification.id)}
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}
