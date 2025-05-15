'use client'

import ButtonBase from '@mui/material/ButtonBase'
import Container from '@mui/material/Container'
import MuiLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        聯絡我們
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        歡迎透過以下方式與我們聯繫
      </Typography>

      <Stack spacing={3}>
        <Paper elevation={0}>
          <Stack spacing={1} sx={{ width: 'fit-content' }}>
            <Typography variant="subtitle1" gutterBottom>
              LINE 好友
            </Typography>
            <ButtonBase href="https://lin.ee/9zFIxUt" target="_blank">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
                alt="加入好友"
                height="36"
              />
            </ButtonBase>
          </Stack>
        </Paper>

        <Paper elevation={0}>
          <Stack spacing={1} sx={{ width: 'fit-content' }}>
            <Typography variant="subtitle1" gutterBottom>
              LINE QR Code
            </Typography>
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
        </Paper>

        <Paper elevation={0}>
          <Stack spacing={1} sx={{ width: 'fit-content' }}>
            <Typography variant="subtitle1" gutterBottom>
              Github
            </Typography>
            <ButtonBase href="https://github.com/chore-master" target="_blank">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"
                alt="Github"
              />
            </ButtonBase>
          </Stack>
        </Paper>

        <Paper elevation={0}>
          <Stack spacing={1} sx={{ width: 'fit-content' }}>
            <Typography variant="subtitle1" gutterBottom>
              電子郵件
            </Typography>
            <MuiLink href="mailto:choremaster.app@gmail.com" color="primary">
              choremaster.app@gmail.com
            </MuiLink>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
