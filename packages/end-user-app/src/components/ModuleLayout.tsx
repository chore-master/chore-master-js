'use client'

import { useEndUser } from '@/utils/auth'
import { Logout } from '@mui/icons-material'
import AppsIcon from '@mui/icons-material/Apps'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import MuiLink from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function ModuleLayout({
  moduleName,
  navigations,
  children,
}: Readonly<{
  moduleName: string
  navigations: any[]
  children: React.ReactNode
}>) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false)
  const [isSideNavOpen, setIsSideNavOpen] = React.useState<boolean>(true)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const {
    endUser,
    successLoadedCount: endUserSuccessLoadedCount,
    res: endUserRes,
  } = useEndUser()
  const isMenuOpen = Boolean(anchorEl)

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen)
  }

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  React.useEffect(() => {
    if (endUserRes?.status === 401) {
      router.push('/login')
    }
  }, [endUserRes])

  React.useEffect(() => {
    if (endUserRes?.status === 403) {
      router.push('/login')
    }
  }, [endUserRes])

  React.useEffect(() => {
    if (endUser?.is_onboarded === false) {
      router.push('/iam')
    }
  }, [endUser])

  if (!endUser || endUserSuccessLoadedCount === 0) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          background: 'hsla(215, 15%, 97%, 0.5)',
        }}
      >
        <LinearProgress />
      </Box>
    )
  }

  return (
    <React.Fragment>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <List disablePadding sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <Link href="/treasury" passHref legacyBehavior>
              <ListItemButton component="a">
                <ListItemText primary="財務管理" />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href="/sample-module" passHref legacyBehavior>
              <ListItemButton component="a">
                <ListItemText primary="範例模組" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Stack direction="row" spacing={1} p={1}>
          <MuiLink color="inherit" variant="body2" href="/privacy">
            隱私權
          </MuiLink>
          <MuiLink color="inherit" variant="body2" href="/terms">
            服務條款
          </MuiLink>
        </Stack>
      </Drawer>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Collapse
          orientation="horizontal"
          in={isSideNavOpen}
          sx={{
            overflowX: 'hidden',
            position: 'sticky',
            top: 0,
            height: '100vh',
          }}
        >
          <Stack
            sx={{
              width: 240,
              height: '100%',
            }}
          >
            <AppBar position="sticky" elevation={0}>
              <Toolbar disableGutters>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={toggleDrawer(true)}
                >
                  <AppsIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                  {moduleName}
                </Typography>
              </Toolbar>
              <Divider />
            </AppBar>
            <List
              disablePadding
              sx={{
                flexGrow: 1,
                overflowY: 'hidden',
                '&:hover': { overflowY: 'auto' },
              }}
            >
              {navigations.map((nav) => {
                if (nav.header) {
                  return (
                    <ListSubheader key={nav.header}>{nav.header}</ListSubheader>
                  )
                } else {
                  return (
                    <ListItem key={nav.title} disablePadding>
                      <Link href={nav.href} passHref legacyBehavior>
                        <ListItemButton
                          component="a"
                          selected={
                            (nav.selectedWhenExactlyMatched &&
                              pathname === nav.href) ||
                            (nav.selectedWhenPartiallyMatched &&
                              pathname.startsWith(nav.href))
                          }
                        >
                          <ListItemText primary={nav.title} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  )
                }
              })}
            </List>
          </Stack>
        </Collapse>

        <Stack
          sx={{
            flex: '1 0 0px',
            background: 'hsla(215, 15%, 97%, 0.5)',
            minWidth: 320,
          }}
        >
          <AppBar position="sticky" elevation={0}>
            <Toolbar disableGutters>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setIsSideNavOpen((open) => !open)}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              {/* <IconButton size="large" color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton> */}
              <Tooltip title={endUser.email}>
                <IconButton
                  onClick={handleAvatarClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={isMenuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {(endUser as any).email.substring(0, 1).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isMenuOpen}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link href="/iam" passHref legacyBehavior>
                  <MenuItem component="a" onClick={handleCloseMenu}>
                    <Avatar /> 帳戶中心
                  </MenuItem>
                </Link>
                {/* <MenuItem onClick={handleCloseMenu}>
                  <Avatar /> My account
                </MenuItem> */}
                <Divider />
                {/* <MenuItem onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Add another account
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem> */}
                <Link href="/logout" passHref legacyBehavior>
                  <MenuItem component="a" onClick={handleCloseMenu}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    登出目前裝置
                  </MenuItem>
                </Link>
              </Menu>
              {/* <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
              </Menu> */}
            </Toolbar>
            <Divider />
          </AppBar>
          {children}
        </Stack>
      </Stack>
    </React.Fragment>
  )
}
