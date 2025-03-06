import { INTERMEDIATE_ASSET_SYMBOL } from '@/constants'

/**
 * Given prices of `MIDDLE/X` and `MIDDLE/Y`, calculate the price of `X/Y`.
 */
export const getSyntheticPrice = (
  prices: any[],
  baseAssetSymbol: string,
  quoteAssetSymbol: string
) => {
  let price_intermediate_base = null
  if (baseAssetSymbol === INTERMEDIATE_ASSET_SYMBOL) {
    price_intermediate_base = 1
  } else {
    price_intermediate_base =
      prices.find(
        (price) =>
          price.instrument_symbol ===
          `${INTERMEDIATE_ASSET_SYMBOL}_${baseAssetSymbol}`
      )?.matched_price || 0
  }

  let price_intermediate_quote = null
  if (quoteAssetSymbol === INTERMEDIATE_ASSET_SYMBOL) {
    price_intermediate_quote = 1
  } else {
    price_intermediate_quote =
      prices.find(
        (price) =>
          price.instrument_symbol ===
          `${INTERMEDIATE_ASSET_SYMBOL}_${quoteAssetSymbol}`
      )?.matched_price || 0
  }

  return price_intermediate_quote / price_intermediate_base
}
