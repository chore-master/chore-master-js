'use client'

import getConfig from '@/utils/config'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'

export default function Page() {
  const { HOST } = getConfig()

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="Sankey 展示" />
        <ModuleFunctionBody>
          <Stack p={2}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
            <iframe src={`${HOST}/widget/sankey`} />
            <Typography>
              Phasellus dignissim massa vel justo bibendum blandit. Proin
              eleifend mauris leo. Maecenas convallis, lacus semper pretium
              mattis, tellus ante suscipit velit, vitae aliquam lectus elit nec
              urna. Pellentesque posuere, purus ut accumsan semper, metus arcu
              pulvinar dolor, vel faucibus odio mauris non odio. Vivamus
              tincidunt rutrum ligula. Morbi tristique ex non ipsum aliquet
              cursus. Nam sit amet magna et turpis iaculis dignissim. Vestibulum
              ante ipsum primis in faucibus orci luctus et ultrices posuere
              cubilia curae; Fusce arcu enim, porttitor a ante porta, porta
              venenatis lorem. Donec tempus nulla gravida ligula convallis
              elementum. Donec pharetra aliquet mi. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis egestas.
              Donec non turpis turpis.
            </Typography>
          </Stack>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
