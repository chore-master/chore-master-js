'use client'

import { LoginForm } from '@/types/global'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useAuth } from '@/utils/auth'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile } from '@marsidev/react-turnstile'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

const { CLOUDFLARE_TURNSTILE_SITE_KEY } = getConfig()

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

const logingRedirectPath = '/finance'

export default function Page() {
  const router = useRouter()
  const loginForm = useForm<LoginForm>()
  const loginFormTokenTurnstileRef = useRef<TurnstileInstance | null>(null)
  const { enqueueNotification } = useNotification()
  const auth = useAuth()

  const handleSubmitLoginForm: SubmitHandler<LoginForm> = async (data) => {
    await choreMasterAPIAgent.post('/v1/identity/user_sessions/login', data, {
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
        loginFormTokenTurnstileRef.current?.reset()
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'warning')
        loginFormTokenTurnstileRef.current?.reset()
      },
      onSuccess: () => {
        loginForm.reset()
        router.push(logingRedirectPath)
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
          background: '#f8f5e6',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={6}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              background: '#fffdf5',
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
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Image
                  src="/icon.svg"
                  alt="Chore Master Logo"
                  width={40}
                  height={40}
                />
              </Box>
              <Typography variant="h5" component="h1" gutterBottom>
                登入 Chore Master
              </Typography>
              <Typography variant="body2">
                登入您的帳戶，開始使用個人化助理服務
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
                <Controller
                  name="turnstile_token"
                  control={loginForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <Turnstile
                      ref={loginFormTokenTurnstileRef}
                      siteKey={CLOUDFLARE_TURNSTILE_SITE_KEY}
                      options={{
                        theme: 'light',
                        size: 'flexible',
                        appearance: 'execute',
                        language: 'zh-tw',
                      }}
                      onSuccess={(token) => {
                        field.onChange(token)
                      }}
                    />
                  )}
                  rules={{ required: true }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  fullWidth
                  disabled={!loginForm.formState.isValid}
                  loading={loginForm.formState.isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  登入
                </Button>

                {!auth.isLoadingCurrentUser && auth.currentUser && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Box
                        sx={{ flex: 1, borderBottom: '1px solid #e0e0e0' }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mx: 1 }}
                      >
                        或
                      </Typography>
                      <Box
                        sx={{ flex: 1, borderBottom: '1px solid #e0e0e0' }}
                      />
                    </Box>

                    <Button
                      variant="outlined"
                      onClick={() => router.push(logingRedirectPath)}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      以 {auth.currentUser.name} 身份繼續
                    </Button>
                  </>
                )}

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                    href="/"
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
