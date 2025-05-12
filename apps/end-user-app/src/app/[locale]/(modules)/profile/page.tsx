'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  React.useEffect(() => {
    router.replace('/profile/quota')
  }, [router])
}
