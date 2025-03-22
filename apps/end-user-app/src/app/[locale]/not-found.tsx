import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Box p={1}>
      <Container>
        <Alert severity="warning">
          <AlertTitle>404</AlertTitle>
          <Typography variant="inherit" gutterBottom>
            抱歉，您訪問的頁面不存在。
          </Typography>
          <Typography variant="inherit">可能是因為以下原因：</Typography>
          <ul>
            <li>
              <Typography variant="inherit">
                頁面已被移除或更改了位置。
              </Typography>
            </li>
            <li>
              <Typography variant="inherit">您輸入的網址有誤。</Typography>
            </li>
            <li>
              <Typography variant="inherit">該頁面暫時不可用。</Typography>
            </li>
          </ul>
          <Typography variant="inherit" gutterBottom>
            請您檢查輸入的網址是否正確，或返回<Link href="/">首頁</Link>
            重新尋找您需要的內容。
          </Typography>
        </Alert>
      </Container>
    </Box>
  )
}
