'use client'

import choreMasterAPIAgent from '@/utils/apiAgent'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export interface LoginForm {
  username: string
  password: string
}

// Create a custom theme with updated colors to match landing page
const loginTheme = createTheme({
  palette: {
    primary: {
      main: '#5D8AA8', // Soft blue
      light: '#7FA8C9',
      dark: '#3A6B8C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E57373', // Soft coral/pink
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
  const { HOST, IAM_API_HOST } = getConfig()
  const errorRedirectURI = encodeURI(`${HOST}/login`)
  const successRedirectURI = encodeURI(`${HOST}/financial-management`)
  const router = useRouter()
  const loginForm = useForm<LoginForm>()
  const { enqueueNotification } = useNotification()

  const handleSubmitLoginForm: SubmitHandler<LoginForm> = async (data) => {
    await choreMasterAPIAgent.post('/v1/identity/user_sessions/login', data, {
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'warning')
      },
      onSuccess: () => {
        loginForm.reset()
        router.push('/finance')
      },
    })
  }

  return (
    <ThemeProvider theme={loginTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={6}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                bgcolor: loginTheme.palette.primary.main,
                color: 'white',
                p: 3,
                textAlign: 'center',
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="h1" gutterBottom>
                登入 Chore Master
              </Typography>
              <Typography variant="body2">
                登入您的帳戶，開始管理您的財務
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Stack
                component="form"
                spacing={3}
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault()
                  void loginForm.handleSubmit(handleSubmitLoginForm)()
                }}
              >
                <FormControl fullWidth>
                  <Controller
                    name="username"
                    control={loginForm.control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        label="使用者名稱"
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    rules={{ required: '請輸入使用者名稱' }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name="password"
                    control={loginForm.control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        label="密碼"
                        variant="outlined"
                        type="password"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    rules={{ required: '請輸入密碼' }}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  fullWidth
                  loading={loginForm.formState.isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  登入
                </Button>

                <Divider sx={{ my: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    或
                  </Typography>
                </Divider>

                <Button
                  component={Link}
                  href={`${IAM_API_HOST}/v1/admin/auth/google/authorize?success_redirect_uri=${successRedirectURI}&error_redirect_uri=${errorRedirectURI}`}
                  variant="outlined"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  sx={{ py: 1.5 }}
                >
                  使用 Google 帳號登入
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    還沒有帳號？{' '}
                    <Link
                      href="/signup"
                      style={{
                        textDecoration: 'none',
                        color: loginTheme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    >
                      立即註冊
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    href="/landing"
                    style={{
                      textDecoration: 'none',
                      color: loginTheme.palette.text.secondary,
                      fontSize: '0.875rem',
                    }}
                  >
                    返回首頁
                  </Link>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
