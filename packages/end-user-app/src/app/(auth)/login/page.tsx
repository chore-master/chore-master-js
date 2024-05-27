'use client'

import apiAgent from '@/utils/apiAgent'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  React.useEffect(() => {
    apiAgent.get(`/openapi.json`, {
      onFail: (_status: any, data: any) => {
        console.log(data)
        // console.error(data)
      },
      onSuccess: async (data: any) => {
        try {
          console.log(data)
        } catch (e) {
          console.error(e)
        }
      },
    } as any)
  })
  return <Link href="/login">Login with Google</Link>
}
