// SystemInspect

export interface SystemInspect {
  commit_revision: string | null
  commit_short_sha: string | null
  env: string
}

export interface LoginForm {
  username: string
  password: string
  turnstile_token: string
}

// Auth

export interface CurrentUser {
  name: string
  user_roles: {
    role: {
      symbol: string
    }
  }[]
}

// Pagination

export interface OffsetPagination {
  page: number
  rowsPerPage: number
  count: number
  rowsPerPageOptions: number[]
  offset: number
  setPagination: (pagination: { page: number; rowsPerPage: number }) => void
  setCount: (count: number) => void
  setPage: (page: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
}
