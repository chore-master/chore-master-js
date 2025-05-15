'use client'

import { Link } from '@/i18n/navigation'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Image from 'next/image'

import getConfig from '@/utils/config'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const { CHORE_MASTER_LEARN_HOST } = getConfig()

const landingTheme = createTheme({
  palette: {
    primary: {
      main: '#5D8AA8', // Soft blue (keeping as requested)
      light: '#7FA8C9',
      dark: '#3A6B8C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D2B48C', // Beige/tan color instead of coral/pink
      light: '#E6D2B8',
      dark: '#B29066',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

export default function Page() {
  return (
    <ThemeProvider theme={landingTheme}>
      <Box
        sx={{
          bgcolor: landingTheme.palette.primary.main,
          color: 'white',
          py: 10,
          minHeight: '60vh',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Image
              src="/images/logo.svg"
              alt="Chore Master Logo"
              width={56}
              height={56}
              style={{ marginRight: '12px' }}
            />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom>
            Chore Master
          </Typography>
          <Typography variant="h5" paragraph>
            您的個人專屬儀表板
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Chore Master
            致力於將繁瑣的事務與流程模組化、結構化、標準化與自動化，讓您能以更有條理的方式解決各種疑難雜症。透過視覺化的呈現，協助您快速追蹤、跟進並洞察細節。目前我們從生活金融功能切入，未來也將持續推出更多元、跨領域的實用工具，陪您一起打造高效有序的生活。
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              href="/login"
            >
              前往 App
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component="a"
              href={CHORE_MASTER_LEARN_HOST}
              target="_blank"
              rel="noopener"
              endIcon={<OpenInNewIcon fontSize="small" />}
            >
              了解更多
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              <Link
                href={`${CHORE_MASTER_LEARN_HOST}/privacy`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                target="_blank"
              >
                隱私權政策
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link
                href={`${CHORE_MASTER_LEARN_HOST}/terms`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                target="_blank"
              >
                服務條款
              </Link>
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} Chore Master. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
