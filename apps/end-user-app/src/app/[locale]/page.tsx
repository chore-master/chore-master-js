'use client'

import { Link } from '@/i18n/navigation'
import getConfig from '@/utils/config'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

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
  const t = useTranslations('global.pages.landing')

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
            {t('titles.hero')}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {t('subtitles.slogan')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {t('paragraphs.1')}
            <br />
            {t('paragraphs.2')}
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
              {t('buttons.getStarted')}
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
              {t('buttons.learnMore')}
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
                {t('links.privacy')}
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link
                href={`${CHORE_MASTER_LEARN_HOST}/terms`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                target="_blank"
              >
                {t('links.terms')}
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
