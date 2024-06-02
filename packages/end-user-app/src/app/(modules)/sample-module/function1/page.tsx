import ModuleFunction from '@/components/ModuleFunction'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

export default function Page() {
  return (
    <ModuleFunction>
      <Typography>Function 1</Typography>
      <Link href="/sample-module/function1/function11">Go to function 1-1</Link>
    </ModuleFunction>
  )
}
