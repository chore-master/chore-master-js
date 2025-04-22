import { usePathname, useRouter } from '@/i18n/navigation'
import { OffsetPagination } from '@/types/global'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export function useOffsetPagination({
  pageKey = 'page',
  rowsPerPageKey = 'rowsPerPage',
  defaultRowsPerPage = 10,
  defaultPage = 0,
  rowsPerPageOptions = [10, 20, 50, 100],
}: {
  pageKey?: string
  rowsPerPageKey?: string
  defaultRowsPerPage?: number
  defaultPage?: number
  rowsPerPageOptions?: number[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [_count, _setCount] = React.useState(0)
  const [_pagination, _setPagination] = React.useState({
    page:
      searchParams.get(pageKey) === null
        ? defaultPage
        : parseInt(`${searchParams.get(pageKey)}`),
    rowsPerPage:
      searchParams.get(rowsPerPageKey) === null
        ? defaultRowsPerPage
        : parseInt(`${searchParams.get(rowsPerPageKey)}`),
  })

  React.useEffect(() => {
    _setPagination({
      page:
        searchParams.get(pageKey) === null
          ? defaultPage
          : parseInt(`${searchParams.get(pageKey)}`),
      rowsPerPage:
        searchParams.get(rowsPerPageKey) === null
          ? defaultRowsPerPage
          : parseInt(`${searchParams.get(rowsPerPageKey)}`),
    })
  }, [searchParams])

  const setPage = React.useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(pageKey, `${page}`)
      const url = `${pathname}?${params.toString()}`
      router.replace(url, { scroll: false })
    },
    [searchParams, pageKey, pathname, router]
  )

  const setRowsPerPage = React.useCallback(
    (rowsPerPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(rowsPerPageKey, `${rowsPerPage}`)
      const url = `${pathname}?${params.toString()}`
      router.replace(url, { scroll: false })
    },
    [searchParams, rowsPerPageKey, pathname, router]
  )

  const setPagination = React.useCallback(
    (pagination: { page: number; rowsPerPage: number }) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(pageKey, `${pagination.page}`)
      params.set(rowsPerPageKey, `${pagination.rowsPerPage}`)
      const url = `${pathname}?${params.toString()}`
      router.replace(url, { scroll: false })
    },
    [searchParams, pageKey, rowsPerPageKey, pathname, router]
  )

  return {
    page: _pagination.page,
    rowsPerPage: _pagination.rowsPerPage,
    count: _count,
    rowsPerPageOptions,
    offset: _pagination.page * _pagination.rowsPerPage,
    setCount: _setCount,
    setPage,
    setRowsPerPage,
    setPagination,
  } as OffsetPagination
}
