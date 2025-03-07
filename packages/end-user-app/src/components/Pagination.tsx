import TablePaginationActions from '@/components/TablePaginationActions'
import MuiTablePagination from '@mui/material/TablePagination'

export const TablePagination = ({
  count,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  rowsPerPageOptions = [10, 50, 100],
  ...props
}: {
  count: number
  page: number
  rowsPerPage: number
  setPage: (page: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
  rowsPerPageOptions?: number[]
}) => {
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
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
      ) => {
        setPage(newPage)
      }}
      onRowsPerPageChange={(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
      }}
      ActionsComponent={TablePaginationActions}
      {...props}
    />
  )
}
