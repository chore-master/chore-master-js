'use client'

import { CurrentUser } from '@/types/global'
import choreMasterAPIAgent from '@/utils/apiAgent'
import React from 'react'

interface AuthContextType {
  isLoadingCurrentUser: boolean
  currentUserSuccessLoadedCount: number
  currentUserRes: any
  currentUser: CurrentUser | null
  currentUserHasSomeOfRoles: (roleSymbols: string[]) => boolean
  reset: () => void
}

const AuthContext = React.createContext<AuthContextType>({
  isLoadingCurrentUser: false,
  currentUserSuccessLoadedCount: 0,
  currentUserRes: null,
  currentUser: null,
  currentUserHasSomeOfRoles: () => false,
  reset: () => {},
})

export const AuthProvider = (props: any) => {
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = React.useState(false)
  const [currentUserSuccessLoadedCount, setUserSuccessLoadedCount] =
    React.useState(0)
  const [currentUserRes, setUserRes] = React.useState(null)
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null)

  const fetchUser = React.useCallback(async () => {
    setIsLoadingCurrentUser(true)
    choreMasterAPIAgent.get('/v1/identity/users/me', {
      params: {},
      onFail: ({ res }: any) => {
        setUserRes(res)
        setCurrentUser(null)
        setIsLoadingCurrentUser(false)
      },
      onSuccess: async ({ res, data }: any) => {
        setUserRes(res)
        setCurrentUser(data)
        setUserSuccessLoadedCount((c) => c + 1)
        setIsLoadingCurrentUser(false)
      },
    })
  }, [])

  React.useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider
      value={{
        isLoadingCurrentUser,
        currentUserSuccessLoadedCount,
        currentUserRes,
        currentUser,
        currentUserHasSomeOfRoles: (roleSymbols: string[]) => {
          return (
            currentUser?.user_roles.some((userRole) =>
              roleSymbols.includes(userRole.role.symbol)
            ) ?? false
          )
        },
        reset: () => {
          setIsLoadingCurrentUser(false)
          setUserSuccessLoadedCount(0)
          setUserRes(null)
          setCurrentUser(null)
        },
      }}
      {...props}
    />
  )
}

export const useAuth = () => {
  const authContext = React.useContext(AuthContext)
  return {
    isLoadingCurrentUser: authContext.isLoadingCurrentUser,
    currentUserSuccessLoadedCount: authContext.currentUserSuccessLoadedCount,
    currentUserRes: authContext.currentUserRes,
    currentUser: authContext.currentUser,
    currentUserHasSomeOfRoles: authContext.currentUserHasSomeOfRoles,
    reset: authContext.reset,
  }
}
