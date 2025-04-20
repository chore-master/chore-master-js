// User

export interface UserSummary {
  reference: string
  name: string
  username: string
}

export interface UserDetail {
  reference: string
  name: string
  username: string
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
  name?: string
  username?: string
  password?: string
}
