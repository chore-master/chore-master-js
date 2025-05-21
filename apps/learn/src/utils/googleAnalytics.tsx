'use client'

import { GoogleAnalytics } from 'nextjs-google-analytics'
import React from 'react'

export const GoogleAnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <React.Fragment>
      <GoogleAnalytics trackPageViews />
      {children}
    </React.Fragment>
  )
}
