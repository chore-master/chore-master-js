'use client'

import SideNavigationList, {
  SideNavigation,
} from '@/components/SideNavigationList'
import { useEndUser } from '@/utils/auth'
import { Logout } from '@mui/icons-material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HelpIcon from '@mui/icons-material/Help'
import LanIcon from '@mui/icons-material/Lan'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import WidgetsIcon from '@mui/icons-material/Widgets'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { useColorScheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import './ModuleLayout.css'

export interface ModuleLayoutProps {
  readonly moduleName: string
  readonly navigations: SideNavigation[]
  readonly loginRequired?: boolean
  readonly children: React.ReactNode
}

const sideNavWidth = 240
const mobileBreakpoint = 320

export default function ModuleLayout({
  moduleName,
  navigations,
  loginRequired = false,
  children,
}: ModuleLayoutProps) {
  const [isModulesDrawerOpen, setIsModulesDrawerOpen] =
    React.useState<boolean>(false)
  const [isNonMobileSideNavOpen, setIsNonMobileSideNavOpen] =
    React.useState<boolean>(true)
  const [isMobileSideNavDrawerOpen, setIsMobileSideNavDrawerOpen] =
    React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { mode, setMode } = useColorScheme()
  const isSideNavInMobileMode = useMediaQuery(
    `(max-width: ${String(sideNavWidth + mobileBreakpoint)}px)`
  )
  const router = useRouter()
  const pathname = usePathname()
  const {
    endUser,
    successLoadedCount: endUserSuccessLoadedCount,
    res: endUserRes,
  } = useEndUser()
  const isMenuOpen = Boolean(anchorEl)

  const toggleModulesDrawer = (newOpen: boolean) => () => {
    setIsModulesDrawerOpen(newOpen)
  }

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  React.useEffect(() => {
    if (loginRequired && endUserRes?.status === 401) {
      router.push('/login')
    }
  }, [loginRequired, endUserRes, router])

  React.useEffect(() => {
    if (endUserRes?.status === 403) {
      router.push('/login')
    }
  }, [endUserRes, router])

  if (loginRequired && (!endUser || endUserSuccessLoadedCount === 0)) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          background: 'hsl(0, 0%, 99%)',
        }}
      >
        <LinearProgress />
      </Box>
    )
  }

  const sideNav = (
    <Stack
      sx={{
        width: sideNavWidth,
        height: '100%',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Toolbar disableGutters>
          <Tooltip title="切換模組">
            <IconButton
              size="large"
              color="default"
              onClick={toggleModulesDrawer(true)}
            >
              <AppsIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" component="div" color="textPrimary">
            {moduleName}
          </Typography>
          {isSideNavInMobileMode && (
            <React.Fragment>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="small"
                sx={{ mx: 1 }}
                onClick={() => {
                  setIsMobileSideNavDrawerOpen(false)
                }}
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          )}
        </Toolbar>
        <Divider />
      </AppBar>
      <SideNavigationList pathname={pathname} navigations={navigations} />
    </Stack>
  )

  return (
    <React.Fragment>
      <Drawer open={isModulesDrawerOpen} onClose={toggleModulesDrawer(false)}>
        <List disablePadding sx={{ flexGrow: 1 }}>
          {endUser && (
            <ListItem disablePadding>
              <Link href="/admin" passHref legacyBehavior>
                <ListItemButton component="a">
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="管理控制台" />
                </ListItemButton>
              </Link>
            </ListItem>
          )}
          {endUser && (
            <ListItem disablePadding>
              <Link href="/finance" passHref legacyBehavior>
                <ListItemButton component="a">
                  <ListItemIcon>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText primary="金融" />
                </ListItemButton>
              </Link>
            </ListItem>
          )}
          {endUser && (
            <ListItem disablePadding>
              <Link href="/integration" passHref legacyBehavior>
                <ListItemButton component="a">
                  <ListItemIcon>
                    <LanIcon />
                  </ListItemIcon>
                  <ListItemText primary="整合" />
                </ListItemButton>
              </Link>
            </ListItem>
          )}
          <ListItem disablePadding>
            <Link href="/widget" passHref legacyBehavior>
              <ListItemButton component="a">
                <ListItemIcon>
                  <WidgetsIcon />
                </ListItemIcon>
                <ListItemText primary="小工具" />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href="/example" passHref legacyBehavior>
              <ListItemButton component="a">
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
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
        divider={
          !isSideNavInMobileMode && <Divider orientation="vertical" flexItem />
        }
        sx={{
          height: '100%',
        }}
      >
        {isSideNavInMobileMode ? (
          <Drawer
            open={isMobileSideNavDrawerOpen}
            onClose={() => {
              setIsMobileSideNavDrawerOpen(false)
            }}
          >
            {sideNav}
          </Drawer>
        ) : (
          <Collapse
            orientation="horizontal"
            in={isNonMobileSideNavOpen}
            sx={{
              overflowX: 'hidden',
              position: 'sticky',
              top: 0,
              height: '100vh',
            }}
          >
            {sideNav}
          </Collapse>
        )}

        <Stack
          sx={{
            flex: '1 0 0px',
            background: mode === 'dark' ? 'black' : 'hsl(0, 0%, 99%)',
            minWidth: 320,
          }}
        >
          <AppBar
            position="sticky"
            elevation={0}
            sx={(theme) => ({
              backgroundColor: theme.palette.background.default,
            })}
          >
            <Toolbar disableGutters>
              <Tooltip title="切換側邊欄">
                <IconButton
                  size="large"
                  color="default"
                  onClick={() => {
                    if (isSideNavInMobileMode) {
                      setIsMobileSideNavDrawerOpen((open) => !open)
                    } else {
                      setIsNonMobileSideNavOpen((open) => !open)
                    }
                  }}
                >
                  {isSideNavInMobileMode && <MenuIcon />}
                  {!isSideNavInMobileMode &&
                    (isNonMobileSideNavOpen ? <MenuOpenIcon /> : <MenuIcon />)}
                </IconButton>
              </Tooltip>
              <Box sx={{ flexGrow: 1 }} />
              {/* <IconButton size="large" color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton> */}
              {mode === 'dark' ? (
                <Tooltip title="切換至淺色模式">
                  <IconButton onClick={() => setMode('light')}>
                    <LightModeIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="切換至深色模式">
                  <IconButton onClick={() => setMode('dark')}>
                    <DarkModeIcon />
                  </IconButton>
                </Tooltip>
              )}
              {endUser ? (
                <Tooltip
                  title={
                    <React.Fragment>
                      <span>管理員帳戶</span>
                      <br />
                      <span>{endUser.email}</span>
                    </React.Fragment>
                  }
                >
                  <IconButton
                    onClick={handleAvatarClick}
                    size="small"
                    sx={{ mx: 1 }}
                    aria-controls={isMenuOpen ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {endUser.email.substring(0, 1).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  onClick={() => {
                    router.push('/login')
                  }}
                  sx={{ mx: 1 }}
                >
                  登入
                </Button>
              )}

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
                {/* <Link href="/iam" passHref legacyBehavior>
                  <MenuItem component="a" onClick={handleCloseMenu}>
                    <Avatar /> 帳戶中心
                  </MenuItem>
                </Link>
                <Divider /> */}
                <Link href="/logout" passHref legacyBehavior>
                  <MenuItem component="a" onClick={handleCloseMenu}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    登出目前裝置
                  </MenuItem>
                </Link>
              </Menu>
            </Toolbar>
            <Divider />
          </AppBar>
          {children}
        </Stack>
      </Stack>
    </React.Fragment>
  )
}
