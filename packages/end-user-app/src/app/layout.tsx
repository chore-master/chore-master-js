import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './Header'
import SideNavigation from './SideNavigation'
import Theme from './Theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chore Master',
  description: 'Chore Master',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
          >
            <SideNavigation />
            <Stack sx={{ flexGrow: 1 }}>
              <Header />
              <Divider />
              {children}
            </Stack>
          </Stack>
        </Theme>
      </body>
    </html>
  )
}
