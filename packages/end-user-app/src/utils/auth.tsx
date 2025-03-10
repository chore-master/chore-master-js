import { iamAPIAgent } from '@/utils/apiAgent'
import React from 'react'

interface EndUserType {
  name: string
  is_mounted?: boolean
}

interface EndUserContextType {
  isLoading: boolean
  successLoadedCount: number
  res: any
  endUser: EndUserType | null
  sync: any
}

const EndUserContext = React.createContext<EndUserContextType>({
  isLoading: false,
  successLoadedCount: 0,
  res: null,
  endUser: null,
  sync: async () => {},
})

export const EndUserProvider = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [successLoadedCount, setSuccessLoadedCount] = React.useState(0)
  const [res, setRes] = React.useState(null)
  const [endUser, setEndUser] = React.useState(null)

  const fetchEndUser = async () => {
    setIsLoading(true)
    iamAPIAgent.get('/v1/identity/users/me', {
      params: {},
      onFail: ({ res }: any) => {
        setRes(res)
        setEndUser(null)
        setIsLoading(false)
      },
      onSuccess: async ({ res, data }: any) => {
        setRes(res)
        setEndUser(data)
        setSuccessLoadedCount((c) => c + 1)
        setIsLoading(false)
      },
    })
  }

  React.useEffect(() => {
    fetchEndUser()
  }, [])

  return (
    <EndUserContext.Provider
      value={{
        isLoading,
        successLoadedCount,
        res,
        endUser,
        sync: fetchEndUser,
      }}
      {...props}
    />
  )
}

export const useEndUser = () => {
  const endUserContext = React.useContext(EndUserContext)
  return {
    isLoading: endUserContext.isLoading,
    successLoadedCount: endUserContext.successLoadedCount,
    res: endUserContext.res,
    endUser: endUserContext.endUser,
    sync: endUserContext.sync,
  }
}
