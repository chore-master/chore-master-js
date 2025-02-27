'use client'

import DatetimeBlock from '@/components/DatetimeBlock'
import SideNavigationList, {
  SideNavigation,
} from '@/components/SideNavigationList'
import { useTimezone } from '@/components/timezone'
import { SystemInspect } from '@/types'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useEndUser } from '@/utils/auth'
import { useNotification } from '@/utils/notification'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import ContrastIcon from '@mui/icons-material/Contrast'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import DeviceHubIcon from '@mui/icons-material/DeviceHub'
import HelpIcon from '@mui/icons-material/Help'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LanIcon from '@mui/icons-material/Lan'
import LaunchIcon from '@mui/icons-material/Launch'
import LightModeIcon from '@mui/icons-material/LightMode'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import SettingsIcon from '@mui/icons-material/Settings'
import WidgetsIcon from '@mui/icons-material/Widgets'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import { useColorScheme } from '@mui/material/styles'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import './style.css'

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
  const { enqueueNotification } = useNotification()

  const [isModulesDrawerOpen, setIsModulesDrawerOpen] =
    React.useState<boolean>(false)
  const [isNonMobileSideNavOpen, setIsNonMobileSideNavOpen] =
    React.useState<boolean>(true)
  const [isMobileSideNavDrawerOpen, setIsMobileSideNavDrawerOpen] =
    React.useState<boolean>(false)
  const [isAboutDialogOpen, setIsAboutDialogOpen] =
    React.useState<boolean>(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    React.useState<boolean>(false)
  const [systemInspect, setSystemInspect] = React.useState<
    SystemInspect | undefined
  >()
  const [isLoadingSystemInspect, setIsLoadingSystemInspect] =
    React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { mode, setMode } = useColorScheme()
  const isSideNavInMobileMode = useMediaQuery(
    `(max-width: ${String(sideNavWidth + mobileBreakpoint)}px)`
  )
  const router = useRouter()
  const pathname = usePathname()
  const {
    isLoading: isLoadingEndUser,
    endUser,
    successLoadedCount: endUserSuccessLoadedCount,
    res: endUserRes,
  } = useEndUser()
  const timezone = useTimezone()
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const isMenuOpen = Boolean(anchorEl)

  const fetchSystemInspect = React.useCallback(async () => {
    setIsLoadingSystemInspect(true)
    await choreMasterAPIAgent.get('/inspect', {
      params: {},
      onError: () => {
        enqueueNotification(`Unable to fetch system inspect now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setSystemInspect(data)
      },
    })
    setIsLoadingSystemInspect(false)
  }, [enqueueNotification])

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

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

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

      <Stack direction="row">
        {isSideNavInMobileMode && (
          <Drawer
            open={isMobileSideNavDrawerOpen}
            onClose={() => {
              setIsMobileSideNavDrawerOpen(false)
            }}
          >
            {sideNav}
          </Drawer>
        )}

        <Collapse
          orientation="horizontal"
          in={isSideNavInMobileMode ? false : isNonMobileSideNavOpen}
          sx={{
            overflowX: 'hidden',
            position: 'sticky',
            top: 0,
            height: '100vh',
          }}
        >
          {sideNav}
        </Collapse>

        {!isSideNavInMobileMode && <Divider orientation="vertical" flexItem />}

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
              <Tooltip title="關於">
                <IconButton
                  onClick={() => {
                    fetchSystemInspect()
                    setIsAboutDialogOpen(true)
                  }}
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="設定">
                <IconButton
                  onClick={() => {
                    setIsSettingsDialogOpen(true)
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              {endUser && (
                <Tooltip
                  title={
                    <React.Fragment>
                      <span>管理員帳戶</span>
                      <br />
                      <span>{endUser.email}</span>
                    </React.Fragment>
                  }
                >
                  <span>
                    <IconButton
                      size="small"
                      sx={{ mx: 1 }}
                      disabled={isLoadingEndUser}
                      onClick={handleAvatarClick}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {endUser.email.substring(0, 1).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {!loginRequired && !endUser && (
                <Tooltip title="登入">
                  <span>
                    <IconButton
                      size="small"
                      sx={{ mx: 1 }}
                      disabled={isLoadingEndUser}
                      onClick={() => {
                        router.push('/login')
                      }}
                    >
                      <LoginIcon />
                    </IconButton>
                  </span>
                </Tooltip>
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
                      <LogoutIcon fontSize="small" />
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

      <Dialog
        closeAfterTransition={false}
        open={isAboutDialogOpen}
        onClose={() => {
          setIsAboutDialogOpen(false)
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <span>關於</span>
            <IconButton
              aria-label="close"
              onClick={() => {
                setIsAboutDialogOpen(false)
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <DeviceHubIcon />
              </ListItemIcon>
              <ListItemText primary="系統資訊" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">發佈版本</Typography>
                    <Chip
                      size="small"
                      label={systemInspect?.commit_revision ?? 'N/A'}
                    />
                  </Stack>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">提交版本</Typography>
                    <Chip
                      size="small"
                      label={systemInspect?.commit_short_sha ?? 'N/A'}
                    />
                  </Stack>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">環境</Typography>
                    <Chip size="small" label={systemInspect?.env} />
                  </Stack>
                }
              />
            </ListItem>
            <ListItem disablePadding sx={{ mt: 2 }}>
              <ListItemIcon>
                <PrivacyTipIcon />
              </ListItemIcon>
              <ListItemText primary="聲明" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <MuiLink color="inherit" href="/privacy" target="_blank">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2">隱私權</Typography>
                      <LaunchIcon fontSize="small" />
                    </Stack>
                  </MuiLink>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <MuiLink color="inherit" href="/terms" target="_blank">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2">服務條款</Typography>
                      <LaunchIcon fontSize="small" />
                    </Stack>
                  </MuiLink>
                }
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        closeAfterTransition={false}
        open={isSettingsDialogOpen}
        onClose={() => {
          setIsSettingsDialogOpen(false)
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <span>設定</span>
            <IconButton
              aria-label="close"
              onClick={() => {
                setIsSettingsDialogOpen(false)
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <ContrastIcon />
              </ListItemIcon>
              <ListItemText primary="對比" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <React.Fragment>
                    <ToggleButtonGroup
                      color="primary"
                      value={mode}
                      exclusive
                      onChange={(
                        event: React.MouseEvent<HTMLElement>,
                        newMode: string
                      ) => {
                        setMode(newMode as 'light' | 'dark')
                      }}
                    >
                      <ToggleButton value="light">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LightModeIcon fontSize="small" />
                          <span>淺色</span>
                        </Stack>
                      </ToggleButton>
                      <ToggleButton value="dark">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DarkModeIcon fontSize="small" />
                          <span>深色</span>
                        </Stack>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem disablePadding sx={{ mt: 2 }}>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="時區" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <React.Fragment>
                    套用時區：UTC{timezone.offsetText}
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    預覽目前時間：
                    <DatetimeBlock date={currentDate} realTime />
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                inset
                primary={
                  <Slider
                    size="small"
                    valueLabelDisplay="auto"
                    step={30}
                    min={-600}
                    max={540}
                    marks={[
                      {
                        value: 0,
                        label: 'UTC+00:00',
                      },
                      {
                        value: 480,
                        label: 'UTC+08:00',
                      },
                    ]}
                    value={timezone.offsetInMinutes}
                    onChange={(event: Event, newValue: number | number[]) => {
                      timezone.setOffsetInMinutes(newValue as number)
                    }}
                  />
                }
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
