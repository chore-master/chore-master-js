import { User } from '@/types'
import { iamAPIAgent } from '@/utils/apiAgent'
import React from 'react'

interface AuthContextType {
  isLoadingUser: boolean
  userSuccessLoadedCount: number
  userRes: any
  user: User | null
  userIsSomeRole: (roleSymbols: string[]) => boolean
}

const AuthContext = React.createContext<AuthContextType>({
  isLoadingUser: false,
  userSuccessLoadedCount: 0,
  userRes: null,
  user: null,
  userIsSomeRole: () => false,
})

export const AuthProvider = (props: any) => {
  const [isLoadingUser, setIsLoadingUser] = React.useState(false)
  const [userSuccessLoadedCount, setUserSuccessLoadedCount] = React.useState(0)
  const [userRes, setUserRes] = React.useState(null)
  const [user, setUser] = React.useState<User | null>(null)

  const fetchUser = React.useCallback(async () => {
    setIsLoadingUser(true)
    iamAPIAgent.get('/v1/identity/users/me', {
      params: {},
      onFail: ({ res }: any) => {
        setUserRes(res)
        setUser(null)
        setIsLoadingUser(false)
      },
      onSuccess: async ({ res, data }: any) => {
        setUserRes(res)
        setUser(data)
        setUserSuccessLoadedCount((c) => c + 1)
        setIsLoadingUser(false)
      },
    })
  }, [])

  React.useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <AuthContext.Provider
      value={{
        isLoadingUser,
        userSuccessLoadedCount,
        userRes,
        user,
        userIsSomeRole: (roleSymbols: string[]) => {
          return user?.user_roles.some((userRole) =>
            roleSymbols.includes(userRole.role.symbol)
          )
        },
      }}
      {...props}
    />
  )
}

export const useAuth = () => {
  const authContext = React.useContext(AuthContext)
  return {
    isLoadingUser: authContext.isLoadingUser,
    userSuccessLoadedCount: authContext.userSuccessLoadedCount,
    userRes: authContext.userRes,
    user: authContext.user,
    userIsSomeRole: authContext.userIsSomeRole,
  }
}
