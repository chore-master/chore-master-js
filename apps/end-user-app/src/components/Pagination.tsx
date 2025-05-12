import TablePaginationActions from '@/components/TablePaginationActions'
import { OffsetPagination } from '@/types/global'
import MuiTablePagination from '@mui/material/TablePagination'
import { useTranslations } from 'next-intl'

export const TablePagination = ({
  offsetPagination,
  ...props
}: {
  offsetPagination: OffsetPagination
}) => {
  const t = useTranslations('components.TablePagination')
  const rowsPerPageOptions = offsetPagination.rowsPerPageOptions.includes(
    offsetPagination.rowsPerPage
  )
    ? offsetPagination.rowsPerPageOptions
    : [
        ...offsetPagination.rowsPerPageOptions,
        offsetPagination.rowsPerPage,
      ].sort((a, b) => a - b)
  return (
    <MuiTablePagination
      component="div"
      labelRowsPerPage={t('rowsPerPage')}
      labelDisplayedRows={({ from, to, count }: any) =>
        t('displayedRows', { from, to, count })
      }
      rowsPerPageOptions={rowsPerPageOptions}
      count={offsetPagination.count}
      rowsPerPage={offsetPagination.rowsPerPage}
      page={offsetPagination.page}
      onPageChange={(
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
      ) => {
        offsetPagination.setPage(newPage)
      }}
      onRowsPerPageChange={(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const newRowsPerPage = parseInt(event.target.value, 10)
        offsetPagination.setPagination({
          page: Math.floor(
            Math.max(
              Math.min(offsetPagination.offset, offsetPagination.count - 2),
              0
            ) / newRowsPerPage
          ),
          rowsPerPage: newRowsPerPage,
        })
      }}
      ActionsComponent={TablePaginationActions}
      {...props}
    />
  )
}
