/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { iamAPIAgent } from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const { enqueueNotification } = useNotification()
  const router = useRouter()

  const fetchEndUser = async () => {
    iamAPIAgent.get('/v1/admin/end_users/me', {
      params: {},
      onError: () => {
        enqueueNotification(
          'Something wrong happened. Service may be unavailable now.',
          'error'
        )
      },
      onFail: ({ res }: any) => {},
      onSuccess: async ({ res, data }: any) => {
        router.push('/finance')
      },
    })
  }

  React.useEffect(() => {
    fetchEndUser()
  }, [])

  return (
    <Container>
      <Stack>
        <Typography>Welcome to Chore Master!</Typography>
        <Link href="/login">Login</Link>
      </Stack>
    </Container>
  )
}
