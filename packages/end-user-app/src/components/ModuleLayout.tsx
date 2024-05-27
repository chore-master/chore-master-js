'use client'

import { Logout, PersonAdd, Settings } from '@mui/icons-material'
// import { AccountCircle } from '@mui/icons-material'
import AppsIcon from '@mui/icons-material/Apps'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
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
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
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

  return (
    <React.Fragment>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <List disablePadding>
          <ListItem disablePadding>
            <Link href="/module1" passHref legacyBehavior>
              <ListItemButton component="a">
                <ListItemText primary="Module 1" />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link href="/module2" passHref legacyBehavior>
              <ListItemButton component="a">
                <ListItemText primary="Module 2" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Drawer>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack
          sx={{
            width: 240,
            height: '100vh',
            position: 'sticky',
            top: 0,
          }}
        >
          <AppBar
            position="sticky"
            // color="primary"
            // color="transparent"
            elevation={0}
          >
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
              // scrollbarGutter: 'stable',
            }}
          >
            {navigations.map((navigation) => (
              <ListItem key={navigation.title} disablePadding>
                <Link href={navigation.href} passHref legacyBehavior>
                  <ListItemButton component="a">
                    <ListItemText primary={navigation.title} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Stack>

        <Stack sx={{ flexGrow: 1 }}>
          <AppBar
            position="sticky"
            // color="transparent"
            elevation={0}
          >
            <Toolbar disableGutters>
              <IconButton size="large" color="inherit">
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              {/* <IconButton size="large" color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton> */}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleAvatarClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={isMenuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
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
                <MenuItem onClick={handleCloseMenu}>
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <Avatar /> My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseMenu}>
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
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
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
