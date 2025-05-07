import type { MarkPrice } from '@/types/finance'

/**
 * Given prices of `MIDDLE/X` and `MIDDLE/Y`, calculate the price of `X/Y`.
 */
export const getSyntheticPrice = (
  markPrices: MarkPrice[],
  baseAssetReference: string,
  quoteAssetReference: string,
  intermediateAssetReference: string
) => {
  const prices = markPrices.map((markPrice) => markPrice.mark_price)
  let price_intermediate_base = null
  if (baseAssetReference === intermediateAssetReference) {
    price_intermediate_base = '1'
  } else {
    price_intermediate_base = prices.find(
      (price) =>
        price.base_asset_reference === intermediateAssetReference &&
        price.quote_asset_reference === baseAssetReference
    )?.value
  }

  let price_intermediate_quote = null
  if (quoteAssetReference === intermediateAssetReference) {
    price_intermediate_quote = '1'
  } else {
    price_intermediate_quote = prices.find(
      (price) =>
        price.base_asset_reference === intermediateAssetReference &&
        price.quote_asset_reference === quoteAssetReference
    )?.value
  }

  if (price_intermediate_base && price_intermediate_quote) {
    return (
      parseFloat(price_intermediate_quote) / parseFloat(price_intermediate_base)
    )
  }

  return null
}
