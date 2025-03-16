import PlaceholderTypography from '@/components/PlaceholderTypography'
import TableBody, { TableBodyProps } from '@mui/material/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

export function StatefulTableBody({
  isLoading,
  isEmpty,
  loadingText = '載入中...',
  emptyText = '目前沒有任何資料。',
  children,
  ...props
}: TableBodyProps & {
  isLoading: boolean
  isEmpty: boolean
  loadingText?: string
  emptyText?: string
}) {
  return (
    <TableBody {...props}>
      {isLoading && isEmpty && (
        <TableRow>
          <NoWrapTableCell colSpan={999}>
            <PlaceholderTypography>{loadingText}</PlaceholderTypography>
          </NoWrapTableCell>
        </TableRow>
      )}
      {!isLoading && isEmpty && (
        <TableRow>
          <NoWrapTableCell colSpan={999}>
            <Typography variant="body2" color="text.secondary">
              {emptyText}
            </Typography>
          </NoWrapTableCell>
        </TableRow>
      )}
      {children}
    </TableBody>
  )
}

export function NoWrapTableCell(props: TableCellProps) {
  return <TableCell sx={{ whiteSpace: 'nowrap' }} {...props} />
}
