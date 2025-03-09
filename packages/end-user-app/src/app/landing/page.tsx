'use client'

import Link from 'next/link'

// Material UI components
import PersonalizeIcon from '@mui/icons-material/Person'
import EfficiencyIcon from '@mui/icons-material/Speed'
import ModuleIcon from '@mui/icons-material/ViewModule'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export default function Page() {
  const theme = useTheme()

  // Features section data
  const features = [
    {
      icon: <ModuleIcon fontSize="large" color="primary" />,
      title: '模組化解決方案',
      description: '透過可自訂的模組，依照您的需求打造專屬助理系統。',
    },
    {
      icon: <EfficiencyIcon fontSize="large" color="primary" />,
      title: '提升效率',
      description: '將日常瑣事自動化，讓您專注於更重要的事情。',
    },
    {
      icon: <PersonalizeIcon fontSize="large" color="primary" />,
      title: '個人化體驗',
      description: '根據您的使用習慣和偏好，提供量身定制的服務。',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Chore Master
              </Typography>
              <Typography variant="h5" paragraph>
                讓日常瑣事變得更有效率
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Chore Master
                是一套著重於個人需求的助理，透過模組化的解決方案，將日常瑣事變得更有效率。
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  href="/login"
                >
                  立即登入
                </Button>
                <Button variant="outlined" color="inherit" size="large">
                  了解更多
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                {/* Placeholder for hero image */}
                <Box
                  sx={{
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">Chore Master 應用介面</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          為什麼選擇 Chore Master？
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
          我們提供的不只是一個工具，而是一個能夠適應您生活方式的智能助理
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            如何使用 Chore Master
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            簡單三步驟，開始提升您的生活效率
          </Typography>

          <Grid container spacing={3}>
            {[
              { step: '1', text: '註冊並登入您的帳戶' },
              { step: '2', text: '選擇並設定您需要的模組' },
              { step: '3', text: '開始享受更有效率的生活' },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {item.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            準備好開始使用 Chore Master 了嗎？
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            立即註冊，體驗如何讓日常瑣事變得更有效率
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            href="/login"
            sx={{ px: 4, py: 1.5 }}
          >
            立即開始
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Chore Master
              </Typography>
              <Typography variant="body2" color="text.secondary">
                讓日常瑣事變得更有效率
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                連結
              </Typography>
              <Stack spacing={1}>
                <Link
                  href="/login"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">登入</Typography>
                </Link>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">關於我們</Typography>
                </Link>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">聯絡我們</Typography>
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                法律資訊
              </Typography>
              <Stack spacing={1}>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">隱私政策</Typography>
                </Link>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">使用條款</Typography>
                </Link>
              </Stack>
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            © {new Date().getFullYear()} Chore Master. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  )
}
