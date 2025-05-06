'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import { Operator } from '@/types/integration'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MuiLink from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  const { enqueueNotification } = useNotification()

  // Feed operator
  const [feedOperators, setFeedOperators] = React.useState<Operator[]>([])
  const [isFetchingFeedOperators, setIsFetchingFeedOperators] =
    React.useState(false)
  const [selectedFeedOperatorReference, setSelectedFeedOperatorReference] =
    React.useState('')

  const fetchFeedOperators = React.useCallback(async () => {
    setIsFetchingFeedOperators(true)
    await choreMasterAPIAgent.get('/v1/integration/users/me/operators', {
      params: {
        discriminators: ['oanda_feed', 'yahoo_finance_feed'],
      },
      onError: () => {
        enqueueNotification(`Unable to fetch feed operators now.`, 'error')
      },
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setFeedOperators(data)
      },
    })
    setIsFetchingFeedOperators(false)
  }, [enqueueNotification])

  React.useEffect(() => {
    const feedOperator = feedOperators.find(
      (operator) => operator.reference === selectedFeedOperatorReference
    )
    if (!feedOperator) {
      setSelectedFeedOperatorReference(feedOperators[0]?.reference || '')
    }
  }, [feedOperators, selectedFeedOperatorReference])

  React.useEffect(() => {
    fetchFeedOperators()
  }, [])

  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <Breadcrumbs>
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            href="/finance/market/prices"
          >
            價格
          </MuiLink>
          <Typography>批次回補</Typography>
        </Breadcrumbs>
      </Box>
      <ModuleFunction>
        <ModuleFunctionHeader
          title="批次回補"
          actions={[
            <Tooltip key="refresh" title="立即重整">
              <span>
                <IconButton
                  onClick={fetchFeedOperators}
                  disabled={isFetchingFeedOperators}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>,
          ]}
        />
        <ModuleFunctionBody loading={isFetchingFeedOperators}>
          <FormControl variant="standard">
            <InputLabel>報價來源</InputLabel>
            <Select
              value={selectedFeedOperatorReference}
              onChange={(event: SelectChangeEvent) => {
                setSelectedFeedOperatorReference(event.target.value)
              }}
              autoWidth
            >
              {feedOperators.map((operator) => (
                <MenuItem key={operator.reference} value={operator.reference}>
                  {operator.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}
