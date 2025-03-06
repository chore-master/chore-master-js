import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        服務條款
      </Typography>

      <Typography>
        歡迎使用 Chore
        Master（以下稱「本網站」或「我們」）。使用本網站即表示您同意遵守以下服務條款。請仔細閱讀這些條款。
      </Typography>

      <Typography variant="h6" gutterBottom>
        使用條件
      </Typography>
      <Typography>使用本網站，您必須：</Typography>
      <Typography component="ul" gutterBottom>
        <Typography component="li">
          使用 Google 帳號登入並授權我們存取您的電子郵件地址及基本個人資訊。
        </Typography>
        <Typography component="li">
          授權我們存取您的 Google Drive 和 Spreadsheet
          以提供完整的應用程式功能。
        </Typography>
      </Typography>

      <Typography variant="h6" gutterBottom>
        帳戶安全
      </Typography>
      <Typography>
        您有責任保護您的 Google
        帳號安全。您同意不向任何第三方透露您的登入資訊，並對您帳號下的所有活動負全部責任。如果發現未經授權使用您的帳號，請立即通知我們。
      </Typography>

      <Typography variant="h6" gutterBottom>
        使用規範
      </Typography>
      <Typography>您同意不從事以下行為：</Typography>
      <Typography component="ul" gutterBottom>
        <Typography component="li">以任何非法方式或目的使用本網站。</Typography>
        <Typography component="li">試圖破壞或干擾本網站的正常運行。</Typography>
        <Typography component="li">
          未經授權訪問其他用戶的資料或帳戶。
        </Typography>
        <Typography component="li">
          發布或傳播任何誹謗、淫穢、欺詐或侵犯他人權利的內容。
        </Typography>
      </Typography>

      <Typography variant="h6" gutterBottom>
        知識產權
      </Typography>
      <Typography>
        本網站及其所有內容（包括但不限於文字、圖像、標誌、圖表和軟件）的所有權利均屬於我們或其授權人。未經我們事先書面同意，您不得複製、修改、分發或以其他方式使用這些內容。
      </Typography>

      <Typography variant="h6" gutterBottom>
        責任限制
      </Typography>
      <Typography>
        在適用法律允許的最大範圍內，我們不對因使用或無法使用本網站所引起的任何直接、間接、偶然、特殊或後果性損害負責，包括但不限於資料遺失或利潤損失。
      </Typography>

      <Typography variant="h6" gutterBottom>
        服務變更和中斷
      </Typography>
      <Typography>
        我們保留在任何時候修改、暫停或終止本網站或其任何部分的權利，無需事先通知。我們不對因任何修改、暫停或終止本網站或其任何部分所引起的任何損失或損害負責。
      </Typography>

      <Typography variant="h6" gutterBottom>
        隱私權
      </Typography>
      <Typography>
        您對本網站的使用受我們的隱私權政策約束。請參閱我們的隱私權政策以了解更多有關我們如何收集、使用和保護您的個人資料的信息。
      </Typography>

      <Typography variant="h6" gutterBottom>
        法律適用
      </Typography>
      <Typography>
        本服務條款受中華民國法律管轄並依其解釋。您同意因本服務條款或本網站使用引起的任何爭議應提交中華民國法院管轄。
      </Typography>

      <Typography variant="h6" gutterBottom>
        變更通知
      </Typography>
      <Typography>
        我們可能會不時修改這些服務條款。任何修改將發布在本頁面上，並且在發布後立即生效。請定期查閱本頁面以了解最新的服務條款。
      </Typography>

      <Typography variant="h6" gutterBottom>
        聯繫我們
      </Typography>
      <Typography>
        目前，您無法直接聯繫我們。如果您有任何疑問或問題，請參閱我們的常見問題頁面或使用應用程式內的幫助功能尋求支持。
      </Typography>
    </Container>
  )
}
