import { Link } from '@/i18n/navigation'
import ButtonBase from '@mui/material/ButtonBase'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

export default function Page() {
  return (
    <Container sx={{ mt: 3 }}>
      <Stack useFlexGap spacing={1}>
        <Link href="https://lin.ee/9zFIxUt" target="_blank">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
            alt="加入好友"
            height="36"
          />
        </Link>
        <ButtonBase
          href="https://lin.ee/9zFIxUt"
          target="_blank"
          sx={{ width: 128, height: 128 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://qr-official.line.me/gs/M_860fvpii_GW.png?oat_content=qr"
            alt="Line QR Code"
            width={128}
            height={128}
          />
        </ButtonBase>
      </Stack>
    </Container>
  )
}
