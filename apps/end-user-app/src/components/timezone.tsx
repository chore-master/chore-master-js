'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const [_offsetInMinutes, _setOffsetInMinutes] = React.useState(
    searchParams.get('tz_offset')
      ? parseInt(searchParams.get('tz_offset')!)
      : deviceOffsetInMinutes
  )
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    const tzOffset = searchParams.get('tz_offset')
    if (tzOffset) {
      _setOffsetInMinutes(parseInt(tzOffset))
    }
  }, [searchParams])

  const setOffsetInMinutes = React.useCallback(
    (tzOffset: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('tz_offset', `${tzOffset}`)
      const url = `${pathname}?${params.toString()}`
      router.replace(url, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  return (
    <TimezoneContext.Provider
      value={{
        deviceOffsetInMinutes,
        offsetInMinutes: _offsetInMinutes,
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
