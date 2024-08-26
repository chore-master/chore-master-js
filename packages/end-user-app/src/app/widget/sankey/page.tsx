'use client'
import SankeyChart from '@/components/charts/SankeyChart'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { NoSsr } from '@mui/base/NoSsr'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
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
        alert(message)
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
              datapoints={[
                { source: 'A', target: 'B', value: 10 },
                { source: 'A', target: 'C', value: 20 },
                { source: 'B', target: 'D', value: 30 },
                { source: 'C', target: 'D', value: 40 },
              ]}
              accessSource={(d) => d.source}
              accessTarget={(d) => d.target}
              accessValue={(d) => d.value}
            />
            {false ? (
              <>
                <NoSsr>
                  <Typography>
                    Window: {windowSize.width}x{windowSize.height}
                  </Typography>
                </NoSsr>
                <Typography>Nodes</Typography>
                <List>
                  {data.nodes.map((node) => (
                    <ListItemText key={node.name}>{node.name}</ListItemText>
                  ))}
                </List>
                <Typography>Links</Typography>
                <List>
                  {data.links.map((link, i) => (
                    <ListItemText key={i}>
                      Source: {link.source}, Target: {link.target}, Value:{' '}
                      {link.value}
                    </ListItemText>
                  ))}
                </List>
              </>
            ) : null}
          </Box>
        )}
      </Box>
    </Box>
  )
}
