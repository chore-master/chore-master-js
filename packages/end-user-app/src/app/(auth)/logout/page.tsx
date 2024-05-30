'use client'

import { iamAPIAgent } from '@/utils/apiAgent'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  React.useEffect(() => {
    iamAPIAgent.post('/v1/auth/logout', null, {
      onFail: (_status: any, data: any) => {
        console.error(data)
      },
      onSuccess: async (data: any) => {
        router.push('/login')
      },
    })
  })

  return <React.Fragment>Loggining out...</React.Fragment>
}
