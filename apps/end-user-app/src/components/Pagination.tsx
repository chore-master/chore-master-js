import TablePaginationActions from '@/components/TablePaginationActions'
import { OffsetPagination } from '@/types/global'
import MuiTablePagination from '@mui/material/TablePagination'

export const TablePagination = ({
  offsetPagination,
  ...props
}: {
  offsetPagination: OffsetPagination
}) => {
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
      labelRowsPerPage="每頁數量："
      labelDisplayedRows={({ from, to, count }: any) =>
        `第 ${from} 筆至第 ${to} 筆／共 ${
          count !== -1 ? count : `超過 ${to}`
        } 筆`
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
