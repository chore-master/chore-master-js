// 'use client'

// import apiAgent from '@/utils/apiAgent'
import getConfig from '@/utils/config'
import Link from 'next/link'

export default function Page() {
  const { HOST, IAM_API_HOST } = getConfig()
  const nextURI = encodeURI(`${HOST}/`)

  // React.useEffect(() => {
  //   apiAgent.get(`/openapi.json`, {
  //     onFail: (_status: any, data: any) => {
  //       console.log(data)
  //       // console.error(data)
  //     },
  //     onSuccess: async (data: any) => {
  //       try {
  //         console.log(data)
  //       } catch (e) {
  //         console.error(e)
  //       }
  //     },
  //   } as any)
  // })
  return (
    <Link href={`${IAM_API_HOST}/api/auth/google/authorize?nextURI=${nextURI}`}>
      Login with Google
    </Link>
  )
}
