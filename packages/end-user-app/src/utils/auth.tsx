import { iamAPIAgent } from '@/utils/apiAgent'
import React from 'react'

const EndUserContext = React.createContext({
  isLoading: false,
  error: null,
  endUser: null,
  sync: async () => {},
})

export const EndUserProvider = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [endUser, setEndUser] = React.useState(null)

  const fetchEndUser = async () => {
    setIsLoading(true)
    iamAPIAgent.get('/v1/end_users/me', {
      params: {},
      onFail: (_status: any, data: any) => {
        setError(data)
        setEndUser(null)
        setIsLoading(false)
      },
      onSuccess: async (data: any) => {
        setError(null)
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
      value={{ isLoading, error, endUser, sync: fetchEndUser }}
      {...props}
    />
  )
}

export const useEndUser = () => {
  const endUserContext = React.useContext(EndUserContext)
  return {
    isLoading: endUserContext.isLoading,
    error: endUserContext.error,
    endUser: endUserContext.endUser,
    sync: endUserContext.sync,
  }
}
