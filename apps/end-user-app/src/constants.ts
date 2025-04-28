export const sideNavWidth = 240
export const minSidePanelWidth = 160
export const mobileBreakpoint = 320

export const integrationOperatorDiscriminators = [
  'oanda_feed',
  'yahoo_finance_feed',
  'coingecko_feed',
]
export const INTERMEDIATE_ASSET_SYMBOL = 'USD'

// export const financeInstrumentTypes = [
//   {
//     label: '股票',
//     value: 'STOCK',
//   },
//   {
//     label: '外匯',
//     value: 'FOREX',
//   },
//   {
//     label: '衍生品',
//     value: 'DERIVATIVE',
//   },
//   {
//     label: '借貸',
//     value: 'LENDING',
//   },
// ] as const

// export const financeInstrumentAssetReferenceFields = [
//   {
//     name: 'base_asset_reference',
//     label: '基礎資產',
//     requiredByInstrumentTypes: ['FX'],
//   },
//   {
//     name: 'quote_asset_reference',
//     label: '報價資產',
//     requiredByInstrumentTypes: ['FX', 'FUTURE', 'DERIVATIVE'],
//   },
//   {
//     name: 'settlement_asset_reference',
//     label: '結算資產',
//     requiredByInstrumentTypes: ['EQUITY', 'FUTURE', 'DERIVATIVE'],
//   },
//   {
//     name: 'underlying_asset_reference',
//     label: '標的資產',
//     requiredByInstrumentTypes: ['FUTURE', 'DERIVATIVE'],
//   },
//   {
//     name: 'staking_asset_reference',
//     label: '質押資產',
//     requiredByInstrumentTypes: ['EARNING'],
//   },
//   {
//     name: 'yielding_asset_reference',
//     label: '收益資產',
//     requiredByInstrumentTypes: ['EARNING'],
//   },
// ] as const

export const financeTransferFlowTypes = [
  {
    label: '成本',
    value: 'COST',
  },

  {
    label: '開銷',
    value: 'EXPENSE',
  },

  {
    label: '收入',
    value: 'REVENUE',
  },

  {
    label: '更動部位',
    value: 'UPDATE_POSITION',
  },
]

// export const financeLedgerEntryEntryTypes = [
//   {
//     label: '交易買入',
//     value: 'TRADE_BUY',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '交易賣出',
//     value: 'TRADE_SELL',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '質押',
//     value: 'STAKE',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '解質押',
//     value: 'UNSTAKE',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '現金股息',
//     value: 'CASH_DIVIDEND',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '股票股息',
//     value: 'STOCK_DIVIDEND',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '獎勵',
//     value: 'REWARD',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '資金費',
//     value: 'FUNDING_FEE',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '利息',
//     value: 'INTEREST',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: false,
//   },
//   {
//     label: '交易手續費',
//     value: 'TRADE_FEE',
//     isAvailableForParentLedgerEntry: false,
//     isAvailableForChildLedgerEntry: true,
//   },
//   {
//     label: '稅',
//     value: 'TAX',
//     isAvailableForParentLedgerEntry: true,
//     isAvailableForChildLedgerEntry: true,
//   },
//   {
//     label: 'Gas 費用',
//     value: 'GAS_FEE',
//     isAvailableForParentLedgerEntry: false,
//     isAvailableForChildLedgerEntry: true,
//   },
// ] as const

// export const financeLedgerEntrySourceTypes = [
//   {
//     label: '手動',
//     value: 'MANUAL',
//   },
//   {
//     label: '託管',
//     value: 'MANAGED',
//   },
// ] as const

export const colors10 = [
  '#2caffe',
  '#544fc5',
  '#00e272',
  '#fe6a35',
  '#6b8abc',
  '#d568fb',
  '#2ee0ca',
  '#fa4b42',
  '#feb56a',
  '#91e8e1',
] as const

// https://stackoverflow.com/a/34163778
// export const colors20 = [
//   '#1F77B4',
//   '#AEC7E8',
//   '#FF7F0E',
//   '#FFBB78',
//   '#2CA02C',
//   '#98DF8A',
//   '#D62728',
//   '#FF9896',
//   '#9467BD',
//   '#C5B0D5',
//   '#8C564B',
//   '#C49C94',
//   '#E377C2',
//   '#F7B6D2',
//   '#7F7F7F',
//   '#C7C7C7',
//   '#BCBD22',
//   '#DBDB8D',
//   '#17BECF',
//   '#9EDAE5',
// ] as const

export const colors20 = [
  '#5D8AA8', // 主色調：柔和藍
  '#E57373', // 次要色：珊瑚紅
  '#4CAF50', // 翠綠
  '#FFA726', // 明亮橙
  '#42A5F5', // 亮藍
  '#9575CD', // 紫羅蘭
  '#26A69A', // 藍綠
  '#EC407A', // 玫紅
  '#7E57C2', // 深紫
  '#FF7043', // 深橙
  '#66BB6A', // 草綠
  '#5C6BC0', // 靛藍
  '#FF9800', // 橙色
  '#78909C', // 藍灰
  '#D4E157', // 檸檬綠
  '#BA68C8', // 紫紅
  '#29B6F6', // 天藍
  '#EF5350', // 亮紅
  '#8D6E63', // 深褐
  '#7CB342', // 蘋果綠
] as const
