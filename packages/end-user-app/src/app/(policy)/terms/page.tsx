'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

// Create a custom theme with updated colors to match landing page
const policyTheme = createTheme({
  palette: {
    primary: {
      main: '#5D8AA8', // Soft blue
      light: '#7FA8C9',
      dark: '#3A6B8C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E57373', // Soft coral/pink
      light: '#FFB2B2',
      dark: '#AF4448',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
      marginTop: '1.5rem',
    },
  },
})

export default function Page() {
  return (
    <ThemeProvider theme={policyTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#f8f5e6',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 4,
              maxWidth: 800,
              width: '100%',
              background: '#fffdf5',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography variant="h4" gutterBottom color="primary">
              服務條款
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              歡迎使用 Chore Master（以下稱「本服務」或「我們」）。Chore Master
              是一套著重於個人需求的助理，透過模組化的解決方案，將日常瑣事變得更有效率。使用本服務即表示您同意遵守以下服務條款。請仔細閱讀這些條款。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              使用條件
            </Typography>
            <Typography variant="body1">使用本服務，您必須：</Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1">
                註冊帳號並提供準確、完整的個人資訊。
              </Typography>
              <Typography component="li" variant="body1">
                同意我們的隱私權政策中描述的資料收集和使用方式。
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom color="primary">
              外部服務整合
            </Typography>
            <Typography variant="body1">
              Chore Master 允許您透過提供敏感資訊（如帳號、密碼、API
              金鑰等）來介接任意外部服務。使用此功能時，您確認並同意：
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1">
                您有合法權利使用這些外部服務並提供相關資訊
              </Typography>
              <Typography component="li" variant="body1">
                您自行承擔使用外部服務整合功能的風險
              </Typography>
              <Typography component="li" variant="body1">
                我們不對外部服務的可用性、準確性或安全性負責
              </Typography>
              <Typography component="li" variant="body1">
                您將遵守相關外部服務的使用條款
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom color="primary">
              帳戶安全
            </Typography>
            <Typography variant="body1">
              您有責任保護您的帳號安全。您同意選擇強密碼、不向任何第三方透露您的登入資訊，並對您帳號下的所有活動負全部責任。如果發現未經授權使用您的帳號，請立即通知我們。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              服務描述
            </Typography>
            <Typography variant="body1">
              Chore Master
              提供模組化的解決方案，包括但不限於資產負債追蹤、投資組合管理等功能。我們致力於幫助您將日常財務管理變得更有效率。我們保留隨時修改、更新或停止任何服務功能的權利。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              使用規範
            </Typography>
            <Typography variant="body1">您同意不從事以下行為：</Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1">
                以任何非法方式或目的使用本服務。
              </Typography>
              <Typography component="li" variant="body1">
                試圖破壞或干擾本服務的正常運行。
              </Typography>
              <Typography component="li" variant="body1">
                未經授權訪問其他用戶的資料或帳戶。
              </Typography>
              <Typography component="li" variant="body1">
                上傳含有病毒、惡意代碼或其他有害組件的內容。
              </Typography>
              <Typography component="li" variant="body1">
                發布或傳播任何誹謗、淫穢、欺詐或侵犯他人權利的內容。
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom color="primary">
              用戶資料
            </Typography>
            <Typography variant="body1">
              您保留您上傳至本服務的所有資料的所有權。您授予我們非專屬、全球性的許可，允許我們使用、存儲和處理您的資料，以便提供和改進我們的服務。我們將根據我們的隱私權政策保護您的資料。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              知識產權
            </Typography>
            <Typography variant="body1">
              本服務及其所有內容（包括但不限於文字、圖像、標誌、圖表和軟件）的所有權利均屬於我們或其授權人。未經我們事先書面同意，您不得複製、修改、分發或以其他方式使用這些內容。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              責任限制
            </Typography>
            <Typography variant="body1">
              在適用法律允許的最大範圍內，我們不對因使用或無法使用本服務所引起的任何直接、間接、偶然、特殊或後果性損害負責，包括但不限於資料遺失或利潤損失。本服務提供的財務資訊僅供參考，不構成投資建議。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              服務變更和中斷
            </Typography>
            <Typography variant="body1">
              我們保留在任何時候修改、暫停或終止本服務或其任何部分的權利，無需事先通知。我們不對因任何修改、暫停或終止本服務或其任何部分所引起的任何損失或損害負責。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              隱私權
            </Typography>
            <Typography variant="body1">
              您對本服務的使用受我們的隱私權政策約束。請參閱我們的
              <Link
                href="/privacy"
                style={{
                  textDecoration: 'none',
                  color: policyTheme.palette.primary.main,
                  marginLeft: '4px',
                }}
              >
                隱私權政策
              </Link>
              以了解更多有關我們如何收集、使用和保護您的個人資料的信息。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              法律適用
            </Typography>
            <Typography variant="body1">
              本服務條款受中華民國法律管轄並依其解釋。您同意因本服務條款或本服務使用引起的任何爭議應提交中華民國法院管轄。
            </Typography>

            <Typography variant="h6" gutterBottom color="primary">
              變更通知
            </Typography>
            <Typography variant="body1">
              我們可能會不時修改這些服務條款。任何修改將發布在本頁面上，並且在發布後立即生效。請定期查閱本頁面以了解最新的服務條款。
            </Typography>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  color: policyTheme.palette.text.secondary,
                  fontSize: '0.875rem',
                }}
              >
                返回首頁
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
