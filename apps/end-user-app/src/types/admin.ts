// User

export interface UserSummary {
  reference: string
  name: string
  username: string | null
  email: string | null
}

export interface UserDetail {
  reference: string
  name: string
  username: string | null
  email: string | null
  user_roles: {
    reference: string
    role_reference: string
  }[]
}

export interface CreateUserFormInputs {
  reference?: string
  name: string
  username: string
  password: string
}

export interface UpdateUserFormInputs {
  reference?: string
  name?: string
  username?: string
  password?: string
}
