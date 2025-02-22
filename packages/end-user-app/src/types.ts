export interface Resource {
  reference: string
  name: string
  discriminator: string
  value: string
}

export interface CreateResourceFormInputs {
  name: string
  discriminator: string
  value: string
}

export interface UpdateResourceFormInputs {
  name: string
  discriminator: string
  value: string
}

export interface Account {
  reference: string
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}

export interface CreateAccountFormInputs {
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}

export interface UpdateAccountFormInputs {
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}

export interface Asset {
  reference: string
  name: string
  symbol: string
  is_settleable: boolean
}

export interface CreateAssetFormInputs {
  name: string
  symbol: string
  is_settleable: boolean
}

export interface UpdateAssetFormInputs {
  name: string
  symbol: string
  is_settleable: boolean
}

export interface BalanceSheetSummary {
  reference: string
  balanced_time: string
}

export interface CreateBalanceSheetFormInputs {
  balanced_time: string
  balance_entries: {
    account_reference: string
    asset_reference: string
    entry_type: string
    amount: number
  }[]
}

export interface UpdateBalanceSheetFormInputs {
  balanced_time: string
}
