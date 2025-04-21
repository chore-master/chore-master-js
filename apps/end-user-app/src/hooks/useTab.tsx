import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export function useTab({
  defaultValue,
  valueKey = 'tab',
}: {
  defaultValue: string
  valueKey?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [_value, _setValue] = React.useState(
    searchParams.get(valueKey) === null
      ? defaultValue
      : `${searchParams.get(valueKey)}`
  )

  React.useEffect(() => {
    _setValue(
      searchParams.get(valueKey) === null
        ? defaultValue
        : `${searchParams.get(valueKey)}`
    )
  }, [searchParams])

  const setValue = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(valueKey, `${value}`)
      const url = `${pathname}?${params.toString()}`
      router.replace(url, { scroll: false })
    },
    [searchParams, valueKey, pathname, router]
  )

  return {
    value: _value,
    setValue,
  }
}
