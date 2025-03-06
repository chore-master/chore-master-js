'use client'

import SankeyChart from '@/components/charts/SankeyChart'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { useNotification } from '@/utils/notification'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import { useMeasure, useWindowSize } from 'react-use'
import './page.css'

interface Node {
  name: string
}

interface Link {
  source: string
  target: string
  value: number
}

export default function Page() {
  const { enqueueNotification } = useNotification()
  const [isLoadingData, setIsLoadingData] = React.useState(true)
  const [data, setData] = React.useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  })
  const windowSize = useWindowSize()
  const [contentBoxRef, contentBoxMeasure] = useMeasure()

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!isLoadingData) {
      setIsLoadingData(true)
    }
    await choreMasterAPIAgent.get('/widget/sankey', {
      params: {},
      onFail: ({ message }: any) => {
        enqueueNotification(message, 'error')
      },
      onSuccess: async ({ data }: any) => {
        setData(data)
      },
    })
    setIsLoadingData(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        justifyContent:
          contentBoxMeasure.width < windowSize.width ? 'center' : 'flex-start',
        alignItems:
          contentBoxMeasure.height < windowSize.height
            ? 'center'
            : 'flex-start',
      }}
    >
      <Box ref={contentBoxRef}>
        {isLoadingData ? (
          <CircularProgress />
        ) : (
          <Box p={2}>
            <SankeyChart
              layout={{}}
              nodeDatapoints={data.nodes}
              linkDatapoints={data.links}
              accessNodeId={(node: any) => node.id}
              accessLinkSource={(link: any) => link.source}
              accessLinkTarget={(link: any) => link.target}
              accessLinkValue={(link: any) => link.value}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
