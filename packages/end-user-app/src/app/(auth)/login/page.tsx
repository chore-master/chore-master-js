import getConfig from '@/utils/config'
import Container from '@mui/material/Container'
import Link from 'next/link'

export default function Page() {
  const { HOST, IAM_API_HOST } = getConfig()
  const errorRedirectURI = encodeURI(`${HOST}/login`)
  const successRedirectURI = encodeURI(`${HOST}/financial-management`)

  return (
    <Container>
      <Link
        href={`${IAM_API_HOST}/v1/auth/google/authorize?success_redirect_uri=${successRedirectURI}&error_redirect_uri=${errorRedirectURI}`}
      >
        Login with Google
      </Link>
    </Container>
  )
}
