'use client'

import { Link } from '@/i18n/navigation'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image'
import React from 'react'

const pages = [
  { title: '定價', href: '/pricing' },
  { title: '聯絡我們', href: '/contact' },
]
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export default function TopNavigation() {
  const theme = useTheme()
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'))
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image
              src="/images/logo.svg"
              alt="Chore Master Learn"
              width={48}
              height={48}
            />
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              //   fontFamily: 'monospace',
              fontWeight: 700,
              //   letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Chore Master Learn
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={page.href}
                >
                  {page.title}
                </MenuItem>
              ))}
              {!isUpMd && <Divider />}
              {!isUpMd && (
                <MenuItem
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href="https://www.chore-master.app"
                  target="_blank"
                >
                  前往 App
                </MenuItem>
              )}
              {/* {pages.map((page) => (
                <Link key={page.title} href={page.href} passHref legacyBehavior>
                  <MenuItem component="a" onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: 'center' }}>
                      {page.title}
                    </Typography>
                  </MenuItem>
                </Link>
              ))} */}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <Image
              src="/images/logo.svg"
              alt="Chore Master Learn"
              width={32}
              height={32}
            />
          </Box>
          <Typography
            // variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              //   fontFamily: 'monospace',
              fontWeight: 700,
              //   letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Chore Master Learn
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                href={page.href}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          {isUpMd && (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                href="https://www.chore-master.app"
                target="_blank"
                variant="outlined"
                color="inherit"
              >
                前往 App
              </Button>
            </Box>
          )}
          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
