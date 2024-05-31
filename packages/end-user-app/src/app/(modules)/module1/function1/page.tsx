import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

export default function Page() {
  return (
    <Container>
      <Stack>
        <Typography>Function 1</Typography>
        <Link href="/module1/function1/function11">Go to function 1-1</Link>
      </Stack>
    </Container>
  )
}
