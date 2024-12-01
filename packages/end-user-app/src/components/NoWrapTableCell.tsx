import TableCell, { TableCellProps } from '@mui/material/TableCell';

export default function NoWrapTableCell(props: TableCellProps) {
  return <TableCell sx={{ whiteSpace: 'nowrap' }} {...props} />;
}
