'use client'

import { useRouter } from '@/i18n/navigation'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useAuth } from '@/utils/auth'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import React from 'react'

export default function Page() {
  const router = useRouter()
  const auth = useAuth()

  React.useEffect(() => {
    choreMasterAPIAgent.post('/v1/identity/user_sessions/logout', null, {
      onFail: (_status: any, data: any) => {
        console.error(data)
      },
      onSuccess: async (data: any) => {
        auth.reset()
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
