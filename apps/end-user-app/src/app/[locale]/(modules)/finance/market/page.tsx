'use client'

import { useRouter } from '@/i18n/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter()

  React.useEffect(() => {
    router.replace('/finance/market/ecosystem')
  }, [router])
}
