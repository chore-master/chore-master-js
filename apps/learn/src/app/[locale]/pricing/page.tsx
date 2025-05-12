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
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        透明定價方案
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        依據您的使用需求，選擇最適合的儲存格方案
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          什麼是儲存格？
        </Typography>
        <Typography paragraph>
          儲存格是我們用來計算資源使用量的單位。每當您與應用程式互動時，都會佔用一定數量的儲存格。
          當您達到配額上限時，將無法繼續新的寫入操作。您可以選擇購買更多儲存格或刪除現有資源來釋放空間。
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardHeader
              title="免費方案"
              subheader="適合入門使用"
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{ align: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography component="h2" variant="h3" color="text.primary">
                  100
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  儲存格
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="註冊即贈送" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="基本功能完整支援" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="可隨時升級" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
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
              subheader="適合一般使用"
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{ align: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography component="h2" variant="h3" color="text.primary">
                  1
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  元/儲存格
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="最低購買 100 儲存格" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="可隨時擴充" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="無使用期限" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          需要更多儲存格？
        </Typography>
        <Typography paragraph>
          您可以隨時購買更多儲存格來擴充您的使用配額。每次最低購買量為 100
          儲存格， 價格為每儲存格 1 元。購買後立即生效，無使用期限。
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>
          立即購買
        </Button>
      </Box>
    </Container>
  )
}
