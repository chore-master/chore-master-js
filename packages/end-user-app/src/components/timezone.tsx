'use client'

import React from 'react'

interface TimezoneContextType {
  deviceOffsetInMinutes: number
  baseTimestampInSeconds: number
  offsetInMinutes: number
  offsetText: string
  setOffsetInMinutes: (offsetInMinutes: number) => void
}

const TimezoneContext = React.createContext<TimezoneContextType>({
  deviceOffsetInMinutes: 0,
  baseTimestampInSeconds: 0,
  offsetInMinutes: 0,
  offsetText: '+00:00',
  setOffsetInMinutes: () => {},
})

export const TimezoneProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const deviceOffsetInMinutes = -new Date().getTimezoneOffset()
  const [offsetInMinutes, setOffsetInMinutes] = React.useState(
    deviceOffsetInMinutes
  )
  const [offsetText, setOffsetText] = React.useState('+00:00')
  const [baseTimestampInSeconds, setBaseTimestampInSeconds] = React.useState(
    new Date().getTime() / 1000
  )

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBaseTimestampInSeconds(new Date().getTime() / 1000)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  React.useEffect(() => {
    const sign = offsetInMinutes >= 0 ? '+' : '-'
    const hours = Math.floor(Math.abs(offsetInMinutes) / 60)
    const minutes = Math.abs(offsetInMinutes) % 60
    setOffsetText(
      `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
      )}`
    )
  }, [offsetInMinutes])

  return (
    <TimezoneContext.Provider
      value={{
        deviceOffsetInMinutes,
        baseTimestampInSeconds,
        offsetInMinutes,
        setOffsetInMinutes,
        offsetText,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}

export const useTimezone = () => {
  const timezoneContext = React.useContext(TimezoneContext)
  const getCustomDate = (date: Date) => {
    return new Date(
      date.getTime() + timezoneContext.offsetInMinutes * 60 * 1000
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
  return {
    deviceOffsetInMinutes: timezoneContext.deviceOffsetInMinutes,
    baseTimestampInSeconds: timezoneContext.baseTimestampInSeconds,
    offsetInMinutes: timezoneContext.offsetInMinutes,
    offsetText: timezoneContext.offsetText,
    setOffsetInMinutes: timezoneContext.setOffsetInMinutes,
    getCustomDate,
    getUTCTimestamp,
  }
}
