'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
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
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom color="primary">
                服務條款
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                歡迎使用 Chore
                Master（以下稱「本網站」或「我們」）。使用本網站即表示您同意遵守以下服務條款。請仔細閱讀這些條款。
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                使用條件
              </Typography>
              <Typography variant="body1">使用本網站，您必須：</Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body1">
                  使用 Google
                  帳號登入並授權我們存取您的電子郵件地址及基本個人資訊。
                </Typography>
                <Typography component="li" variant="body1">
                  授權我們存取您的 Google Drive 和 Spreadsheet
                  以提供完整的應用程式功能。
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom color="primary">
                帳戶安全
              </Typography>
              <Typography variant="body1" paragraph>
                您有責任保護您的 Google
                帳號安全。您同意不向任何第三方透露您的登入資訊，並對您帳號下的所有活動負全部責任。如果發現未經授權使用您的帳號，請立即通知我們。
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                使用規範
              </Typography>
              <Typography variant="body1">您同意不從事以下行為：</Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body1">
                  以任何非法方式或目的使用本網站。
                </Typography>
                <Typography component="li" variant="body1">
                  試圖破壞或干擾本網站的正常運行。
                </Typography>
                <Typography component="li" variant="body1">
                  未經授權訪問其他用戶的資料或帳戶。
                </Typography>
                <Typography component="li" variant="body1">
                  發布或傳播任何誹謗、淫穢、欺詐或侵犯他人權利的內容。
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom color="primary">
                知識產權
              </Typography>
              <Typography variant="body1" paragraph>
                本網站及其所有內容（包括但不限於文字、圖像、標誌、圖表和軟件）的所有權利均屬於我們或其授權人。未經我們事先書面同意，您不得複製、修改、分發或以其他方式使用這些內容。
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                責任限制
              </Typography>
              <Typography variant="body1" paragraph>
                在適用法律允許的最大範圍內，我們不對因使用或無法使用本網站所引起的任何直接、間接、偶然、特殊或後果性損害負責，包括但不限於資料遺失或利潤損失。
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                服務變更和中斷
              </Typography>
              <Typography variant="body1" paragraph>
                我們保留在任何時候修改、暫停或終止本網站或其任何部分的權利，無需事先通知。我們不對因任何修改、暫停或終止本網站或其任何部分所引起的任何損失或損害負責。
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                隱私權
              </Typography>
              <Typography variant="body1" paragraph>
                您對本網站的使用受我們的隱私權政策約束。請參閱我們的
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
              <Typography variant="body1" paragraph>
                本服務條款受中華民國法律管轄並依其解釋。您同意因本服務條款或本網站使用引起的任何爭議應提交中華民國法院管轄。
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                變更通知
              </Typography>
              <Typography variant="body1" paragraph>
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
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
