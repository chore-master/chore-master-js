// Quota

export interface Quota {
  reference: string
  used: number
  limit: number
}

export interface UpdateQuotaFormInputs {
  used?: number
  limit?: number
}
