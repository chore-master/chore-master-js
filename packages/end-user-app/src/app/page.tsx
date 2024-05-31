import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

export default function Page() {
  return (
    <Container>
      <Stack>
        <Typography>Welcome to Chore Master!</Typography>
        <Link href="/login">Login</Link>
      </Stack>
    </Container>
  )
}
