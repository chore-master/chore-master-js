// Resource

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

// Asset

export interface Asset {
  reference: string
  name: string
  symbol: string
  decimals: number
  is_settleable: boolean
}

export interface CreateAssetFormInputs {
  name: string
  symbol: string
  decimals: number
  is_settleable: boolean
}

export interface UpdateAssetFormInputs {
  name: string
  symbol: string
  decimals: number
  is_settleable: boolean
}

// Account

export interface Account {
  reference: string
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
  settlement_asset_reference: string
}

export interface CreateAccountFormInputs {
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
  settlement_asset_reference: string
}

export interface UpdateAccountFormInputs {
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}

// BalanceSheet

export interface BalanceSheetSummary {
  reference: string
  balanced_time: string
}

export interface BalanceSheetDetail {
  reference: string
  balanced_time: string
  balance_entries: BalanceEntry[]
}

export interface CreateBalanceSheetFormInputs {
  balanced_time: string
  balance_entries: BalanceEntry[]
}

export interface UpdateBalanceSheetFormInputs {
  balanced_time: string
  balance_entries: BalanceEntry[]
}

// BalanceEntry

export interface BalanceEntry {
  reference?: string
  balance_sheet_reference?: string
  account_reference: string
  amount: string
}
