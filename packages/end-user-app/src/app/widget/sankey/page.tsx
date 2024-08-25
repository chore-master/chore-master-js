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
import { useWindowSize } from 'react-use'
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
  const { width, height } = useWindowSize()

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
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {isLoadingData ? (
        <CircularProgress />
      ) : (
        <Box p={2}>
          <SankeyChart
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
          <NoSsr>
            <Typography>
              Window: {width}x{height}
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
        </Box>
      )}
    </Box>
  )
}
