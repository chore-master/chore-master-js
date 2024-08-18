'use client'

import choreMasterAPIAgent from '@/utils/apiAgent'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React from 'react'

interface Node {
  name: string
}
interface Link {
  source: string
  target: string
  value: number
}

export default function Page() {
  const [isLoadingData, setIsLoadingData] = React.useState(false)
  const [data, setData] = React.useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  })

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoadingData(true)
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
    <Box p={2}>
      {isLoadingData ? (
        <CircularProgress />
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </Box>
  )
}
