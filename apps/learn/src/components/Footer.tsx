import { Link } from '@/i18n/navigation'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function Footer() {
  return (
    <Container
      maxWidth="lg"
      sx={{ my: 4, display: 'flex', justifyContent: 'center' }}
    >
      <Stack>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            <Link
              href="/privacy"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              隱私權政策
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Link
              href="/terms"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              服務條款
            </Link>
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          &copy; {new Date().getFullYear()} Chore Master. All rights reserved.
        </Typography>
      </Stack>
    </Container>
  )
}
