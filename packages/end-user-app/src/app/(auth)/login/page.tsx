'use client'

import choreMasterAPIAgent from '@/utils/apiAgent'
import getConfig from '@/utils/config'
import { useNotification } from '@/utils/notification'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export interface LoginForm {
  email: string
  password: string
}

export default function Page() {
  const { HOST, IAM_API_HOST } = getConfig()
  const errorRedirectURI = encodeURI(`${HOST}/login`)
  const successRedirectURI = encodeURI(`${HOST}/financial-management`)
  const router = useRouter()
  const loginForm = useForm<LoginForm>()
  const { enqueueNotification } = useNotification()

  const handleSubmitLoginForm: SubmitHandler<LoginForm> = async (data) => {
    await choreMasterAPIAgent.post('/v1/auth/login', data, {
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message)
      },
      onSuccess: () => {
        loginForm.reset()
        router.push('/finance')
      },
    })
  }

  return (
    <Container component={Paper} elevation={0} sx={{ p: 2 }}>
      <Stack spacing={2} divider={<Divider />}>
        <Stack
          component="form"
          spacing={3}
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault()
            void loginForm.handleSubmit(handleSubmitLoginForm)()
          }}
        >
          <FormControl>
            <Controller
              name="email"
              control={loginForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="Email"
                  variant="standard"
                />
              )}
              rules={{ required: 'Required' }}
            />
          </FormControl>
          <FormControl>
            <Controller
              name="password"
              control={loginForm.control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  label="Password"
                  variant="standard"
                  type="password"
                />
              )}
              rules={{ required: 'Required' }}
            />
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            loading={loginForm.formState.isSubmitting}
          >
            Login with Credentials
          </Button>
        </Stack>
        <Link
          href={`${IAM_API_HOST}/v1/auth/google/authorize?success_redirect_uri=${successRedirectURI}&error_redirect_uri=${errorRedirectURI}`}
        >
          Login with Google
        </Link>
      </Stack>
    </Container>
  )
}
