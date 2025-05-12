import TopNavigation from '@/components/TopNavigation'
import Stack from '@mui/material/Stack'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Stack>
      <TopNavigation />
      {children}
    </Stack>
  )
}
