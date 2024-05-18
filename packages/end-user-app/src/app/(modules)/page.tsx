import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Link from 'next/link'

export default function Page() {
  return (
    <Container>
      <Stack>
        <List disablePadding>
          <Link href="/module1">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Module 1" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link href="/module2">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Module 2" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Stack>
    </Container>
  )
}
