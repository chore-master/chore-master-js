import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography variant="h3" color="primary" align="center" gutterBottom>
        定價方案
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        選擇最適合您的訂閱方案，享受彈性與專業的服務
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          什麼是 Slots（儲存格）？
        </Typography>
        <Typography paragraph>
          Slots（儲存格）是我們用來計算資源使用量的單位。每當您與應用程式互動時，都會佔用一定數量的儲存格。
          當您達到配額上限時，將無法繼續新的寫入操作。您可以升級方案來獲得更多儲存格。
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardHeader
              title="免費方案"
              subheader="適合想要嚐鮮體驗、了解功能與操作的使用者"
              slotProps={{
                title: { align: 'center' },
                subheader: { align: 'center' },
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography component="h2" variant="h3" color="text.primary">
                  NT$0
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  /月
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="註冊即享有 100 Slots 使用額度" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="完整體驗基本功能" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #1976d2',
            }}
          >
            <CardHeader
              title="彈性方案"
              subheader="適合穩定使用特定功能的使用者"
              slotProps={{
                title: { align: 'center' },
                subheader: { align: 'center' },
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography component="h2" variant="h3" color="text.primary">
                  NT$99
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  /月
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="5000 Slots 使用額度" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="適合穩定使用" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #ff9800',
            }}
          >
            <CardHeader
              title="專業方案"
              subheader="適合中高度使用量，希望許願特定功能的使用者"
              slotProps={{
                title: { align: 'center' },
                subheader: { align: 'center' },
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography component="h2" variant="h3" color="text.primary">
                  NT$199
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  /月
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="15000 Slots 使用額度" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="優先回饋與功能許願" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mb: 4 }}
          href="https://www.chore-master.app"
          target="_blank"
        >
          立即註冊體驗
        </Button>
        <Typography variant="h6" gutterBottom>
          有更多需求嗎？
        </Typography>
        <Typography paragraph>
          若您有更高的使用需求或特殊合作意願，歡迎聯絡我們取得專屬方案！
        </Typography>
        <Button variant="outlined" size="large" sx={{ mt: 2 }} href="/">
          聯絡我們
        </Button>
      </Box>
    </Container>
  )
}
