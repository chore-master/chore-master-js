import { Link } from '@/i18n/navigation'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import React from 'react'

interface SideNavigationBase {
  navigations?: SideNavigation[]
  isVisible?: boolean
}

interface SideNavigationHeader extends SideNavigationBase {
  type: 'header'
  title: string
}

interface SideNavigationDivider extends SideNavigationBase {
  type: 'divider'
}

export interface SideNavigationLink extends SideNavigationBase {
  type: 'link'
  title: string
  href: string
  selectedWhenExactlyMatched?: boolean
  selectedWhenPartiallyMatched?: boolean
  endNode?: React.ReactNode
}

export interface SideNavigationCollapsible extends SideNavigationBase {
  type: 'collapsible'
  title: string
  isDefaultCollapsed: boolean
  getSelected?: (
    isCollapsed: boolean,
    pathname: string,
    nav: SideNavigationCollapsible
  ) => boolean
}

export type SideNavigation =
  | SideNavigationHeader
  | SideNavigationDivider
  | SideNavigationLink
  | SideNavigationCollapsible

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
  const [titleToIsChildrenCollapsed, setTitleToIsChildrenCollapsed] =
    React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const collapsibleNavigations = navigations.filter(
      (nav) => nav.type === 'collapsible'
    )
    const newTitleToIsChildrenCollapsed = collapsibleNavigations.reduce(
      (acc, nav) => {
        if (!Object.keys(acc).includes(nav.title)) {
          acc[nav.title] = nav.isDefaultCollapsed
        }
        return acc
      },
      titleToIsChildrenCollapsed
    )
    setTitleToIsChildrenCollapsed({ ...newTitleToIsChildrenCollapsed })
  }, [navigations])

  return (
    <List
      disablePadding
      dense={indentionLevel > 1}
      sx={{
        flexGrow: 1,
        overflowY: 'hidden',
        '&:hover': { overflowY: 'auto' },
      }}
    >
      {navigations
        .filter((nav) => nav.isVisible === undefined || nav.isVisible)
        .map((nav, i) => {
          let content: React.ReactNode
          const isChildrenCollapsed =
            nav.type === 'collapsible' && titleToIsChildrenCollapsed[nav.title]
          if (nav.type === 'header') {
            content = (
              <ListSubheader sx={{ ml: indentionLevel * INDENTION_SCALE }}>
                {nav.title}
              </ListSubheader>
            )
          } else if (nav.type === 'divider') {
            content = (
              <Divider
                sx={{
                  my: 1,
                  mr: 2,
                  ml: (indentionLevel + 1) * INDENTION_SCALE,
                }}
              />
            )
          } else if (nav.type === 'link') {
            content = (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href={nav.href}
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
                  {nav.endNode}
                </ListItemButton>
              </ListItem>
            )
          } else if (nav.type === 'collapsible') {
            content = (
              <ListItem disablePadding>
                <ListItemButton
                  selected={nav.getSelected?.(
                    isChildrenCollapsed,
                    pathname,
                    nav
                  )}
                  onClick={() => {
                    setTitleToIsChildrenCollapsed({
                      ...titleToIsChildrenCollapsed,
                      [nav.title]: !isChildrenCollapsed,
                    })
                  }}
                >
                  <ListItemText
                    primary={nav.title}
                    sx={{ pl: indentionLevel * INDENTION_SCALE }}
                  />
                  {isChildrenCollapsed ? <ExpandMore /> : <ExpandLess />}
                </ListItemButton>
              </ListItem>
            )
          }
          return (
            <React.Fragment key={i}>
              {content}
              <Collapse in={!isChildrenCollapsed} timeout="auto" unmountOnExit>
                {nav.navigations && (
                  <SideNavigationList
                    pathname={pathname}
                    navigations={nav.navigations}
                    indentionLevel={indentionLevel + 1}
                  />
                )}
              </Collapse>
            </React.Fragment>
          )
        })}
    </List>
  )
}
