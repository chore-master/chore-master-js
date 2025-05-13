import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={0}>
        <Typography variant="h4" gutterBottom color="primary">
          隱私權政策
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Chore
          Master（以下稱「本服務」或「我們」）重視您的隱私。這份隱私權政策旨在告知您我們如何收集、使用、存儲和保護您的個人資料。
        </Typography>

        <Typography variant="h6" gutterBottom color="primary">
          資料收集
        </Typography>
        <Typography variant="body1">
          當您註冊並使用本服務時，我們會收集以下個人資料：
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            基本個人資訊（例如，您的姓名和個人資料）
          </Typography>
          <Typography component="li" variant="body1">
            您在使用服務時提供的財務和資產相關資訊
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom color="primary">
          外部服務整合
        </Typography>
        <Typography variant="body1">
          Chore Master 允許您透過填入敏感資訊（如帳號、密碼、API
          金鑰等）來介接任意外部服務。請注意，當您選擇提供這些資訊時：
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            您有責任確保您有權使用這些外部服務
          </Typography>
          <Typography component="li" variant="body1">
            我們會安全地存儲這些敏感資訊，並僅用於您指定的整合目的
          </Typography>
          <Typography component="li" variant="body1">
            我們不對外部服務的隱私政策或資料處理實踐負責
          </Typography>
          <Typography component="li" variant="body1">
            建議您在提供敏感資訊前，先查閱相關外部服務的隱私政策
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom color="primary">
          資料使用
        </Typography>
        <Typography variant="body1">
          我們收集的個人資料將用於以下目的：
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            驗證您的身份並提供登入服務
          </Typography>
          <Typography component="li" variant="body1">
            提供和改善我們的模組化解決方案
          </Typography>
          <Typography component="li" variant="body1">
            協助您追蹤資產、管理投資組合等財務相關功能
          </Typography>
          <Typography component="li" variant="body1">
            提供個人化的使用體驗
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom color="primary">
          資料共享和披露
        </Typography>
        <Typography variant="body1">
          我們不會與任何第三方共享、出售、出租或以其他方式披露您的個人資料，除非在以下情況下：
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            獲得您的明確同意
          </Typography>
          <Typography component="li" variant="body1">
            為了遵守法律法規或應政府要求
          </Typography>
          <Typography component="li" variant="body1">
            為了保護我們的權利、隱私、安全或財產，或是保護公眾或其他用戶的權利和安全
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom color="primary">
          資料安全
        </Typography>
        <Typography variant="body1">
          我們採取適當的技術和組織措施來保護您的個人資料免受未經授權的訪問、洩露、篡改或毀壞。您的財務資訊和外部服務整合資訊將使用加密技術進行保護，以確保最高級別的安全性。
        </Typography>

        <Typography variant="h6" gutterBottom color="primary">
          用戶權利
        </Typography>
        <Typography variant="body1">
          作為我們服務的用戶，您擁有以下權利：
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1">
            訪問權：您可以要求獲取我們持有的關於您的個人資料副本
          </Typography>
          <Typography component="li" variant="body1">
            更正權：您可以要求更正不準確或不完整的個人資料
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom color="primary">
          Cookie 和類似技術
        </Typography>
        <Typography variant="body1">
          我們使用 Cookie
          和類似技術來提升您的使用體驗、分析網站流量並個人化內容。您可以通過瀏覽器設置控制
          Cookie 的使用，但這可能會影響某些服務功能的可用性。
        </Typography>

        <Typography variant="h6" gutterBottom color="primary">
          政策更新
        </Typography>
        <Typography variant="body1">
          我們可能會不時更新本隱私權政策以反映我們服務的變更或法律規定的變化。任何更新將發布在本頁面上，並且在發布後立即生效。
        </Typography>
      </Paper>
    </Container>
  )
}
