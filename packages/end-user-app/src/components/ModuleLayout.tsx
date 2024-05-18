'use client'
import { AccountCircle } from '@mui/icons-material'
import AppsIcon from '@mui/icons-material/Apps'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack sx={{ width: 240, height: '100vh' }}>
          <AppBar
            position="static"
            // color="primary"
            color="transparent"
            elevation={0}
          >
            <Toolbar disableGutters>
              <IconButton size="large" color="inherit">
                <AppsIcon />
              </IconButton>
              <Typography variant="h6" component="div">
                {moduleName}
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider />
          <List disablePadding>
            {navigations.map((navigation) => (
              <Link key={navigation.title} href={navigation.href}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary={navigation.title} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Stack>
        <Stack sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar disableGutters>
              <IconButton size="large" color="inherit">
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton size="large" color="inherit" onClick={handleMenu}>
                <AccountCircle />
              </IconButton>
              <Menu
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
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Divider />
          {children}
        </Stack>
      </Stack>
    </React.Fragment>
  )
}
