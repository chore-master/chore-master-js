'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import Box from '@mui/material/Box'
import React from 'react'

interface ABC {
  a?: string | null
  b?: { b1:  string }
}

export default function Page() {
  // react hook
  const [data, setData] = React.useState<ABC>({"a":null, "b": {"b1": "sdsddgfdfg"}})
  const handleclick = async () => {
    await fetchAbc()
  }

  const fetchAbc = async () => {
    await choreMasterAPIAgent.get('/v1/risk/abc', {
      params: {},
      onFail: ({ message }: any) => {
        alert(message)
      },
      onSuccess: async ({ data }: any) => {
        console.log(data)
        setData(data)
      },
    })
  }

  React.useEffect(() => {
    setInterval(() => {
      console.log('xxx');
      
    }, 2000)
    fetchAbc()
  }, [])

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="risk" />
        <ModuleFunctionBody>
          <Box p={2}>
            <button onClick={handleclick}>xxx</button>
            {data.a}
            {/* <Com color={data.b}></Com> */}
          </Box>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  )
}

function Com({ color, another }: { color: { b1: string }, another?: string }) {
  return <div>{color.b1}</div>
}