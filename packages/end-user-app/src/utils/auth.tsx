import { iamAPIAgent } from '@/utils/apiAgent'
import React from 'react'

interface EndUserType {
  email: string
  root_folder_id?: string
}

interface EndUserContextType {
  isLoading: boolean
  res: any
  endUser: EndUserType | null
  sync: any
}

const EndUserContext = React.createContext<EndUserContextType>({
  isLoading: false,
  res: null,
  endUser: null,
  sync: async () => {},
})

export const EndUserProvider = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [res, setRes] = React.useState(null)
  const [endUser, setEndUser] = React.useState(null)

  const fetchEndUser = async () => {
    setIsLoading(true)
    iamAPIAgent.get('/v1/end_users/me', {
      params: {},
      onFail: ({ res }: any) => {
        setRes(res)
        setEndUser(null)
        setIsLoading(false)
      },
      onSuccess: async ({ res, data }: any) => {
        setRes(res)
        setEndUser(data)
        setIsLoading(false)
      },
    })
  }

  React.useEffect(() => {
    fetchEndUser()
  }, [])

  return (
    <EndUserContext.Provider
      value={{ isLoading, res, endUser, sync: fetchEndUser }}
      {...props}
    />
  )
}

export const useEndUser = () => {
  const endUserContext = React.useContext(EndUserContext)
  return {
    isLoading: endUserContext.isLoading,
    res: endUserContext.res,
    endUser: endUserContext.endUser,
    sync: endUserContext.sync,
  }
}
