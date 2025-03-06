'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
  const { entity_reference } = useParams()
  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <Typography color="text.secondary">常用情境</Typography>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/example/entities"
          >
            瀏覽實體
          </MuiLink>
          <Chip size="small" label={entity_reference} />
        </Breadcrumbs>
      </Box>

      <ModuleFunction>
        <ModuleFunctionHeader
          title={
            <span>
              實體 <Chip size="small" label={entity_reference} />
            </span>
          }
        />
        <ModuleFunctionBody>
          <Typography sx={{ p: 2 }}>實體詳細內容</Typography>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
