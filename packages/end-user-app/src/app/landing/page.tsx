'use client'

import Link from 'next/link'
import { useState } from 'react'

// Material UI components
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PersonalizeIcon from '@mui/icons-material/Person'
import EfficiencyIcon from '@mui/icons-material/Speed'
import ModuleIcon from '@mui/icons-material/ViewModule'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MobileStepper from '@mui/material/MobileStepper'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Create a custom theme with updated colors
const landingTheme = createTheme({
  palette: {
    primary: {
      main: '#5D8AA8', // Soft blue (keeping as requested)
      light: '#7FA8C9',
      dark: '#3A6B8C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E57373', // Soft coral/pink - more attractive than the green
      light: '#FFB2B2',
      dark: '#AF4448',
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
  // State for hero section carousel
  const [activeStep, setActiveStep] = useState(0)

  // Sample screenshots - replace these with actual paths to your screenshots
  const screenshots = [
    {
      label: '儀表板總覽',
      imgPath: '/images/dashboard-screenshot.png',
      description: '一目了然的儀表板，讓您掌握所有任務和進度',
    },
    {
      label: '任務管理',
      imgPath: '/images/tasks-screenshot.png',
      description: '直覺式的任務管理介面，輕鬆安排您的日常活動',
    },
    {
      label: '模組設定',
      imgPath: '/images/modules-screenshot.png',
      description: '自訂模組，打造專屬於您的個人助理',
    },
    {
      label: '數據分析',
      imgPath: '/images/analytics-screenshot.png',
      description: '詳細的數據分析，幫助您優化日常效率',
    },
  ]

  // Additional usage examples for feature section
  const usageExamples = [
    {
      title: '財務追蹤',
      imgPath: '/images/finance-example.png',
      description: '追蹤您的收入和支出，建立預算並達成財務目標',
    },
    {
      title: '健康管理',
      imgPath: '/images/health-example.png',
      description: '記錄運動、飲食和睡眠數據，維持健康生活方式',
    },
    {
      title: '專案協作',
      imgPath: '/images/project-example.png',
      description: '與團隊成員協作，追蹤專案進度和里程碑',
    },
  ]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % screenshots.length)
  }

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) =>
        (prevActiveStep - 1 + screenshots.length) % screenshots.length
    )
  }

  // Features section data
  const features = [
    {
      icon: (
        <ModuleIcon
          fontSize="large"
          sx={{ color: landingTheme.palette.primary.main }}
        />
      ),
      title: '模組化解決方案',
      description: '透過可自訂的模組，依照您的需求打造專屬助理系統。',
    },
    {
      icon: (
        <EfficiencyIcon
          fontSize="large"
          sx={{ color: landingTheme.palette.primary.main }}
        />
      ),
      title: '提升效率',
      description: '將日常瑣事自動化，讓您專注於更重要的事情。',
    },
    {
      icon: (
        <PersonalizeIcon
          fontSize="large"
          sx={{ color: landingTheme.palette.primary.main }}
        />
      ),
      title: '個人化體驗',
      description: '根據您的使用習慣和偏好，提供量身定制的服務。',
    },
  ]

  return (
    <ThemeProvider theme={landingTheme}>
      {/* Hero Section with Image Carousel */}
      <Box
        sx={{
          bgcolor: landingTheme.palette.primary.main,
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
              {/* Screenshot Carousel */}
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: 500,
                  mx: 'auto',
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: 300,
                    width: '100%',
                    position: 'relative',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Replace with actual images when available */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Placeholder for actual image */}
                    <Typography
                      variant="h6"
                      sx={{ zIndex: 1, color: 'white', textAlign: 'center' }}
                    >
                      {screenshots[activeStep].label}
                    </Typography>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 0,
                        right: 0,
                        px: 2,
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: 'white' }}
                      >
                        {screenshots[activeStep].description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Navigation controls */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    transform: 'translateY(-50%)',
                    px: 1,
                  }}
                >
                  <IconButton
                    onClick={handleBack}
                    sx={{
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                    }}
                    size="small"
                  >
                    <ArrowBackIosIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    sx={{
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                    }}
                    size="small"
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Stepper dots */}
                <MobileStepper
                  steps={screenshots.length}
                  position="static"
                  activeStep={activeStep}
                  sx={{
                    bgcolor: 'transparent',
                    '& .MuiMobileStepper-dot': {
                      bgcolor: 'rgba(255,255,255,0.5)',
                    },
                    '& .MuiMobileStepper-dotActive': {
                      bgcolor: 'white',
                    },
                  }}
                  nextButton={<Box />}
                  backButton={<Box />}
                />
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
                  borderTop: `4px solid ${landingTheme.palette.primary.main}`,
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

      {/* Usage Examples Section with Screenshots */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            實際應用案例
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            探索 Chore Master 如何幫助您管理各種日常任務
          </Typography>

          <Grid container spacing={4}>
            {usageExamples.map((example, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      pt: '56.25%' /* 16:9 aspect ratio */,
                      bgcolor: 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Replace with actual images when available */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body1">
                        {example.title} 截圖
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {example.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {example.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          如何使用 Chore Master
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
          簡單三步驟，開始提升您的生活效率
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              step: '1',
              text: '註冊並登入您的帳戶',
              imgPath: '/images/signup-screenshot.png',
              description: '簡單快速的註冊流程，立即開始使用',
            },
            {
              step: '2',
              text: '選擇並設定您需要的模組',
              imgPath: '/images/setup-screenshot.png',
              description: '依照您的需求自訂各種功能模組',
            },
            {
              step: '3',
              text: '開始享受更有效率的生活',
              imgPath: '/images/using-screenshot.png',
              description: '讓 Chore Master 協助您管理日常瑣事',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: landingTheme.palette.secondary.main,
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

                {/* Step screenshot */}
                <Box
                  sx={{
                    mt: 2,
                    mb: 3,
                    mx: 'auto',
                    maxWidth: 280,
                    height: 180,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Replace with actual images when available */}
                  <Typography variant="body2">步驟 {item.step} 截圖</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Screenshot Gallery Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            功能展示
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            探索 Chore Master 的各種功能和介面
          </Typography>

          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      cursor: 'pointer',
                      boxShadow: 3,
                    },
                  }}
                >
                  {/* Replace with actual images when available */}
                  <Typography variant="body2">功能截圖 {index + 1}</Typography>
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
            bgcolor: landingTheme.palette.secondary.main,
            color: landingTheme.palette.secondary.contrastText,
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
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: 'white',
              color: landingTheme.palette.secondary.main,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
            size="large"
            component={Link}
            href="/login"
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
                    color: landingTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">登入</Typography>
                </Link>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: landingTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">關於我們</Typography>
                </Link>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: landingTheme.palette.text.secondary,
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
                    color: landingTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">隱私政策</Typography>
                </Link>
                <Link
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: landingTheme.palette.text.secondary,
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
    </ThemeProvider>
  )
}
