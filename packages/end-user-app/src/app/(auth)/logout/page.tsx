'use client'

import { iamAPIAgent } from '@/utils/apiAgent'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  React.useEffect(() => {
    iamAPIAgent.post('/v1/identity/user_sessions/logout', null, {
      onFail: (_status: any, data: any) => {
        console.error(data)
      },
      onSuccess: async (data: any) => {
        router.push('/login')
      },
    })
  })

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: 'hsla(215, 15%, 97%, 0.5)',
      }}
    >
      <LinearProgress />
    </Box>
  )
}
