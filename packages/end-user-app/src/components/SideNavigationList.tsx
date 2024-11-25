import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material'
import Link from 'next/link'
import React from 'react'

interface SideNavigationBase {
  navigations?: SideNavigation[]
}

interface SideNavigationHeader extends SideNavigationBase {
  type: 'header'
  title: string
}

interface SideNavigationDivider extends SideNavigationBase {
  type: 'divider'
}

interface SideNavigationLink extends SideNavigationBase {
  type: 'link'
  title: string
  href: string
  selectedWhenExactlyMatched?: boolean
  selectedWhenPartiallyMatched?: boolean
}

export type SideNavigation =
  | SideNavigationHeader
  | SideNavigationDivider
  | SideNavigationLink

export default function SideNavigationList({
  pathname,
  navigations,
  indentionLevel = 0,
}: Readonly<{
  pathname: string
  navigations: SideNavigation[]
  indentionLevel?: number
}>) {
  const INDENTION_SCALE = 2
  return (
    <List
      disablePadding
      dense={indentionLevel > 0}
      sx={{
        flexGrow: 1,
        overflowY: 'hidden',
        '&:hover': { overflowY: 'auto' },
      }}
    >
      {navigations.map((nav, i) => {
        let content: React.ReactNode
        if (nav.type === 'header') {
          content = (
            <ListSubheader sx={{ ml: indentionLevel * INDENTION_SCALE }}>
              {nav.title}
            </ListSubheader>
          )
        } else if (nav.type === 'divider') {
          content = (
            <Divider
              sx={{ my: 1, mr: 2, ml: (indentionLevel + 1) * INDENTION_SCALE }}
            />
          )
        } else if (nav.type === 'link') {
          content = (
            <ListItem disablePadding>
              <Link href={nav.href} passHref legacyBehavior>
                <ListItemButton
                  component="a"
                  selected={
                    (nav.selectedWhenExactlyMatched && pathname === nav.href) ??
                    (nav.selectedWhenPartiallyMatched &&
                      pathname.startsWith(nav.href))
                  }
                >
                  <ListItemText
                    primary={nav.title}
                    sx={{ pl: indentionLevel * INDENTION_SCALE }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        }
        return (
          <React.Fragment key={i}>
            {content}
            {nav.navigations && (
              <SideNavigationList
                pathname={pathname}
                navigations={nav.navigations}
                indentionLevel={indentionLevel + 1}
              />
            )}
          </React.Fragment>
        )
      })}
    </List>
  )
}
