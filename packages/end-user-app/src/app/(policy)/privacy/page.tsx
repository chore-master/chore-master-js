import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        隱私權政策
      </Typography>

      <Typography variant="h6" gutterBottom>
        資料收集
      </Typography>
      <Typography paragraph>
        當您使用 Google 帳號登入本網站時，我們會收集以下個人資料：
      </Typography>
      <Typography component="ul">
        <Typography component="li">您的電子郵件地址</Typography>
        <Typography component="li">
          基本個人資訊（例如，您的姓名和個人資料圖片）
        </Typography>
      </Typography>
      <Typography paragraph>
        此外，我們會索取以下 Google Drive 和 Spreadsheet
        的存取權限，以便提供完整的應用程式功能：
      </Typography>
      <Typography component="ul">
        <Typography component="li">存取您的 Google Drive</Typography>
        <Typography component="li">
          存取和管理您的 Google Spreadsheet
        </Typography>
      </Typography>

      <Typography variant="h6" gutterBottom>
        資料使用
      </Typography>
      <Typography paragraph>我們收集的個人資料將用於以下目的：</Typography>
      <Typography component="ul">
        <Typography component="li">驗證您的身份並提供登入服務</Typography>
        <Typography component="li">提供和改善我們的服務</Typography>
        <Typography component="li">
          允許您使用 Google Drive 和 Spreadsheet 的相關功能
        </Typography>
      </Typography>

      <Typography variant="h6" gutterBottom>
        資料共享和披露
      </Typography>
      <Typography paragraph>
        我們不會與任何第三方共享、出售、出租或以其他方式披露您的個人資料，除非在以下情況下：
      </Typography>
      <Typography component="ul">
        <Typography component="li">獲得您的明確同意</Typography>
        <Typography component="li">為了遵守法律法規或應政府要求</Typography>
        <Typography component="li">
          為了保護我們的權利、隱私、安全或財產，或是保護公眾或其他用戶的權利和安全
        </Typography>
      </Typography>

      <Typography variant="h6" gutterBottom>
        資料安全
      </Typography>
      <Typography paragraph>
        我們採取適當的技術和組織措施來保護您的個人資料免受未經授權的訪問、洩露、篡改或毀壞。
      </Typography>

      <Typography variant="h6" gutterBottom>
        用戶權利
      </Typography>
      <Typography paragraph>
        由於我們的應用程式特性，用戶不具備以下權利：
      </Typography>
      <Typography component="ul">
        <Typography component="li">
          刪除權：用戶無法要求刪除我們所持有的個人資料
        </Typography>
        <Typography component="li">
          限制處理權：用戶無法要求限制處理個人資料
        </Typography>
        <Typography component="li">
          資料可攜權：用戶無法要求將個人資料轉移給第三方
        </Typography>
      </Typography>

      <Typography variant="h6" gutterBottom>
        聯繫我們
      </Typography>
      <Typography paragraph>
        目前，用戶無法直接聯繫我們。如果您有任何疑問或問題，請參閱我們的常見問題頁面或使用應用程式內的幫助功能尋求支持。
      </Typography>

      <Typography variant="h6" gutterBottom>
        政策更新
      </Typography>
      <Typography paragraph>
        我們可能會不時更新本隱私權政策以反映我們服務的變更或法律規定的變化。任何更新將發布在本頁面上，並且在發布後立即生效。
      </Typography>
    </Container>
  )
}
