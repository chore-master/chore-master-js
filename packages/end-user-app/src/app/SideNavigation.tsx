import AppsIcon from '@mui/icons-material/Apps'
import StarIcon from '@mui/icons-material/Star'
import {
  AppBar,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export default function SideNavigation() {
  return (
    <Stack sx={{ width: 240, height: '100vh' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar disableGutters>
          <IconButton size="large" color="inherit">
            <AppsIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Finance
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider />
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Chelsea Otakan" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText inset primary="Eric Hoffman" />
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  )
}
