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

export interface BalanceSheetSeries {
  accounts: Account[]
  balance_sheets: BalanceSheetSummary[]
  balance_entries: BalanceEntry[]
}

export interface CreateBalanceSheetFormInputs {
  balanced_time: string
  balance_entries: {
    account_reference: string
    amount: string
  }[]
}

export interface UpdateBalanceSheetFormInputs {
  balanced_time: string
  balance_entries: {
    account_reference: string
    amount: string
  }[]
}

// BalanceEntry

export interface BalanceEntry {
  reference?: string
  balance_sheet_reference?: string
  account_reference: string
  amount: number
}

// Instrument

export interface Instrument {
  reference: string
  name: string
  quantity_decimals: number
  px_decimals: number
  instrument_type: string
  base_asset_reference?: string
  quote_asset_reference?: string
  settlement_asset_reference?: string
  underlying_asset_reference?: string
  staking_asset_reference?: string
  yielding_asset_reference?: string
}

export interface CreateInstrumentFormInputs {
  name: string
  quantity_decimals: number
  px_decimals: number
  instrument_type: string
  base_asset_reference?: string
  quote_asset_reference?: string
  settlement_asset_reference?: string
  underlying_asset_reference?: string
  staking_asset_reference?: string
  yielding_asset_reference?: string
}

export interface UpdateInstrumentFormInputs {
  name?: string
  quantity_decimals?: number
  px_decimals?: number
  instrument_type?: string
  base_asset_reference?: string
  quote_asset_reference?: string
  settlement_asset_reference?: string
  underlying_asset_reference?: string
  staking_asset_reference?: string
  yielding_asset_reference?: string
}

// Portfolio

export interface Portfolio {
  reference: string
  name: string
  description?: string
}

export interface CreatePortfolioFormInputs {
  name: string
  description?: string
}

export interface UpdatePortfolioFormInputs {
  name?: string
  description?: string
}

// LedgerEntry

export interface LedgerEntry {
  reference: string
  instrument_reference: string
  entry_type: string
  source_type: string
  quantity: number
  price: number
  entry_time: string
}

export interface CreateLedgerEntryFormInputs {
  instrument_reference: string
  entry_type: string
  quantity: number
  price: number
  entry_time: string
}

export interface UpdateLedgerEntryFormInputs {
  instrument_reference: string
  entry_type: string
  quantity: number
  price: number
  entry_time: string
}
