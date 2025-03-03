'use client'

import React from 'react'

interface TimezoneContextType {
  deviceOffsetInMinutes: number
  offsetInMinutes: number
  setOffsetInMinutes: (offsetInMinutes: number) => void
}

const TimezoneContext = React.createContext<TimezoneContextType>({
  deviceOffsetInMinutes: 0,
  offsetInMinutes: 0,
  setOffsetInMinutes: () => {},
})

export const TimezoneProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const deviceOffsetInMinutes = -new Date().getTimezoneOffset()
  const [offsetInMinutes, setOffsetInMinutes] = React.useState(
    deviceOffsetInMinutes
  )

  return (
    <TimezoneContext.Provider
      value={{
        deviceOffsetInMinutes,
        offsetInMinutes,
        setOffsetInMinutes,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}

export const useTimezone = () => {
  const timezoneContext = React.useContext(TimezoneContext)
  const getLocalDate = (deviceDate: Date) => {
    return new Date(
      deviceDate.getTime() + timezoneContext.offsetInMinutes * 60 * 1000
    )
  }
  const getUTCTimestamp = (localString: string) => {
    return (
      new Date(localString).getTime() +
      (timezoneContext.deviceOffsetInMinutes -
        timezoneContext.offsetInMinutes) *
        60 *
        1000
    )
  }
  const getLocalString = (UTCString: string) => {
    let UTCISOString
    if (!UTCString.endsWith('Z')) {
      UTCISOString = UTCString + 'Z'
    } else {
      UTCISOString = UTCString
    }
    return getLocalDate(new Date(UTCISOString)).toISOString()
  }
  return {
    deviceOffsetInMinutes: timezoneContext.deviceOffsetInMinutes,
    offsetInMinutes: timezoneContext.offsetInMinutes,
    setOffsetInMinutes: timezoneContext.setOffsetInMinutes,
    getLocalDate,
    getUTCTimestamp,
    getLocalString,
  }
}
