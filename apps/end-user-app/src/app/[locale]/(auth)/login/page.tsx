'use client'

import {
  defaultLoginFailureRedirectPath,
  defaultLoginSuccessRedirectPath,
} from '@/constants'
import { Link, useRouter } from '@/i18n/navigation'
import { LoginForm } from '@/types/global'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useAuth } from '@/utils/auth'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile } from '@marsidev/react-turnstile'
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
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

const { CLOUDFLARE_TURNSTILE_SITE_KEY, CHORE_MASTER_API_HOST, HOST } =
  getConfig()

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
  const router = useRouter()
  const locale = useLocale()
  const loginForm = useForm<LoginForm>()
  const loginFormTokenTurnstileRef = useRef<TurnstileInstance | null>(null)
  const { enqueueNotification } = useNotification()
  const [loginSuccessRedirectURI, setLoginSuccessRedirectURI] = useState(
    `${HOST}${defaultLoginSuccessRedirectPath}`
  )
  const [loginErrorRedirectURI, setLoginErrorRedirectURI] = useState(
    `${HOST}${defaultLoginFailureRedirectPath}`
  )
  const searchParams = useSearchParams()
  const auth = useAuth()
  const t = useTranslations('global.pages.login')

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
        router.push(loginSuccessRedirectURI)
      },
    })
  }

  useEffect(() => {
    if (searchParams.get('success_redirect_uri') !== null) {
      setLoginSuccessRedirectURI(`${searchParams.get('success_redirect_uri')}`)
    }
    if (searchParams.get('error_redirect_uri') !== null) {
      setLoginErrorRedirectURI(`${searchParams.get('error_redirect_uri')}`)
    }
  }, [searchParams])

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
                  src="/images/logo.svg"
                  alt="Chore Master Logo"
                  width={40}
                  height={40}
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </Box>
              <Typography variant="h5" component="h1" gutterBottom>
                {t('titles.login')}
              </Typography>
              <Typography variant="body2">{t('subtitles.slogan')}</Typography>
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
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 2,
                    bgcolor: '#ffffff',
                  }}
                  startIcon={
                    <GoogleIcon
                      sx={(theme) => ({ color: theme.palette.primary.main })}
                    />
                  }
                  href={`${CHORE_MASTER_API_HOST}/v1/identity/google/authorize?success_redirect_uri=${encodeURIComponent(
                    loginSuccessRedirectURI
                  )}&error_redirect_uri=${encodeURIComponent(
                    loginErrorRedirectURI
                  )}`}
                >
                  {t('buttons.googleLogin')}
                </Button>

                <Divider>
                  <Typography variant="body2" color="text.secondary">
                    {t('dividers.or')}
                  </Typography>
                </Divider>

                <FormControl fullWidth>
                  <Controller
                    name="username"
                    control={loginForm.control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        label={t('labels.username')}
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        slotProps={{
                          input: {
                            autoComplete: 'off',
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonOutlineIcon color="primary" />
                              </InputAdornment>
                            ),
                          },
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
                        label={t('labels.password')}
                        variant="outlined"
                        type="password"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        slotProps={{
                          input: {
                            autoComplete: 'off',
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon color="primary" />
                              </InputAdornment>
                            ),
                          },
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
                        // https://developers.cloudflare.com/turnstile/reference/supported-languages/
                        language:
                          { zh: 'zh-tw', en: 'en-us' }[locale] || 'auto',
                      }}
                      onSuccess={(token) => {
                        field.onChange(token)
                      }}
                    />
                  )}
                  rules={{ required: true }}
                />
                <Button
                  variant="outlined"
                  type="submit"
                  size="large"
                  fullWidth
                  disabled={!loginForm.formState.isValid}
                  loading={loginForm.formState.isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  {t('buttons.credentialLogin')}
                </Button>

                {!auth.isLoadingCurrentUser && auth.currentUser && (
                  <>
                    <Divider>
                      <Typography variant="body2" color="text.secondary">
                        {t('dividers.or')}
                      </Typography>
                    </Divider>
                    <Button
                      variant="outlined"
                      onClick={() => router.push(loginSuccessRedirectURI)}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      {t('buttons.continueAs', {
                        name: auth.currentUser.name,
                      })}
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
                    {t('buttons.backToHome')}
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
