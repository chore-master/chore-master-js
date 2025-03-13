'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Material UI components
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AssessmentIcon from '@mui/icons-material/Assessment'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import ShowChartIcon from '@mui/icons-material/ShowChart'
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
  // State for hero section carousel
  const [activeStep, setActiveStep] = useState(0)

  // Sample screenshots - replace these with actual paths to your screenshots
  const screenshots = [
    {
      label: '資產負債總覽',
      imgPath: '/images/dashboard-screenshot.png',
      description: '一目了然的儀表板，讓您掌握所有資產、負債和淨值變化',
    },
    {
      label: '資產分佈分析',
      imgPath: '/images/asset-distribution-screenshot.png',
      description: '視覺化的資產分佈圖表，幫助您優化資產配置',
    },
    {
      label: '投資組合管理',
      imgPath: '/images/portfolio-screenshot.png',
      description: '全面的投資組合追蹤與管理功能',
    },
    {
      label: '財務報表',
      imgPath: '/images/financial-reports-screenshot.png',
      description: '詳細的財務報表，幫助您掌握財務健康狀況',
    },
  ]

  // Financial module features
  const financialFeatures = [
    {
      title: '資產負債追蹤',
      imgPath: '/images/asset-tracking.png',
      description: '定期追蹤您的資產、負債和淨值變化，掌握財務全貌',
    },
    {
      title: '投資組合管理',
      imgPath: '/images/portfolio-management.png',
      description: '追蹤您的投資組合表現，分析收益與風險',
    },
    {
      title: '財務記帳功能',
      imgPath: '/images/financial-journal.png',
      description: '即將推出的記帳功能，幫助您記錄日常收支',
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
        <AccountBalanceIcon
          fontSize="large"
          sx={{ color: landingTheme.palette.primary.main }}
        />
      ),
      title: '資產負債追蹤',
      description:
        '定期追蹤資產、負債、淨值，檢視資產負債分佈狀況，掌握您的財務健康。',
    },
    {
      icon: (
        <ShowChartIcon
          fontSize="large"
          sx={{ color: landingTheme.palette.primary.main }}
        />
      ),
      title: '投資組合管理',
      description: '全面管理您的投資組合，追蹤績效，分析風險，優化投資策略。',
    },
    {
      icon: (
        <AutoGraphIcon
          fontSize="large"
          sx={{ color: landingTheme.palette.primary.main }}
        />
      ),
      title: '託管式交易策略',
      description:
        '即將推出的功能，讓您為投資組合建立託管式交易策略，自動追蹤餘額、部位和損益。',
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
                讓財務管理變得更有效率
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Chore Master
                是一套著重於個人財務需求的助理，透過模組化的解決方案，幫助您追蹤資產、管理投資組合，讓財務管理變得更有效率。
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
          我們提供的不只是一個工具，而是一個能夠幫助您掌握財務狀況的智能助理
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

      {/* Financial Module Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            金融模組功能
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            探索 Chore Master 如何幫助您管理財務和投資
          </Typography>

          <Grid container spacing={4}>
            {financialFeatures.map((feature, index) => (
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
                        {feature.title} 截圖
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Roadmap Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          功能發展路線圖
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
          我們不斷優化和擴充 Chore Master 的功能
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              step: '1',
              text: '資產負債追蹤',
              icon: (
                <AssessmentIcon
                  sx={{
                    fontSize: 40,
                    color: landingTheme.palette.primary.main,
                  }}
                />
              ),
              description: '追蹤資產、負債、淨值，檢視資產負債分佈狀況',
              status: '已推出',
              statusColor: 'primary',
            },
            {
              step: '2',
              text: '投資組合管理',
              icon: (
                <ShowChartIcon
                  sx={{
                    fontSize: 40,
                    color: landingTheme.palette.primary.main,
                  }}
                />
              ),
              description: '追蹤您的投資組合表現，分析收益與風險',
              status: '即將推出',
              statusColor: 'secondary',
            },
            {
              step: '3',
              text: '託管式交易策略',
              icon: (
                <AutoGraphIcon
                  sx={{
                    fontSize: 40,
                    color: landingTheme.palette.primary.main,
                  }}
                />
              ),
              description:
                '為投資組合建立託管式交易策略，自動追蹤餘額、部位和損益',
              status: '開發中',
              statusColor: 'default',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(93, 138, 168, 0.1)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.text}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 'medium',
                    ...(item.statusColor === 'primary' && {
                      backgroundColor: 'rgba(93, 138, 168, 0.1)',
                      color: landingTheme.palette.primary.dark,
                      border: '1px solid rgba(93, 138, 168, 0.2)',
                    }),
                    ...(item.statusColor === 'secondary' && {
                      backgroundColor: 'rgba(210, 180, 140, 0.1)',
                      color: landingTheme.palette.secondary.dark,
                      border: '1px solid rgba(210, 180, 140, 0.2)',
                    }),
                    ...(item.statusColor === 'default' && {
                      backgroundColor: 'rgba(158, 158, 158, 0.1)',
                      color: '#616161',
                      border: '1px solid rgba(158, 158, 158, 0.2)',
                    }),
                  }}
                >
                  {item.status}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Investment Portfolio Management Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                投資組合管理
              </Typography>
              <Typography variant="body1" paragraph>
                Chore Master 的投資組合管理功能讓您能夠：
              </Typography>
              <Stack spacing={2}>
                {[
                  '追蹤多個投資組合的表現',
                  '分析投資收益與風險',
                  '檢視資產配置和多元化程度',
                  '設定投資目標並追蹤進度',
                  '即將推出：託管式交易策略，自動追蹤餘額、部位和損益',
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Box
                      sx={{
                        minWidth: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: landingTheme.palette.primary.main,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: 14,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body1">{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 350,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  bgcolor: 'rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Replace with actual image */}
                <Typography variant="h6" color="text.secondary">
                  投資組合管理介面截圖
                </Typography>
              </Box>
            </Grid>
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
            準備好開始管理您的財務了嗎？
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            立即註冊，體驗 Chore Master 如何幫助您追蹤資產、管理投資組合
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Image
                  src="/icon.svg"
                  alt="Chore Master Logo"
                  width={40}
                  height={40}
                  style={{ marginRight: '12px' }}
                />
                <Typography variant="h6">Chore Master</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                讓財務管理變得更有效率
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
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                法律資訊
              </Typography>
              <Stack spacing={1}>
                <Link
                  href="/privacy"
                  style={{
                    textDecoration: 'none',
                    color: landingTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">隱私權政策</Typography>
                </Link>
                <Link
                  href="/terms"
                  style={{
                    textDecoration: 'none',
                    color: landingTheme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">服務條款</Typography>
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
