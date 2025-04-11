import Decimal from 'decimal.js'
import React from 'react'

export default function NumberBlock({
  hasCommas = false,
  hasSign = false,
  value,
  fallbackValue = 0,
  fixedDecimals,
}: Readonly<{
  hasCommas?: boolean
  hasSign?: boolean
  value: number | string | undefined
  fallbackValue?: number
  fixedDecimals?: number
}>) {
  const decimal = new Decimal(value ?? fallbackValue)

  // Apply fixed decimals if specified
  let valueString =
    fixedDecimals !== undefined
      ? decimal.toFixed(fixedDecimals)
      : decimal.toString()

  // Add commas for thousands separators if requested
  if (hasCommas) {
    const parts = valueString.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    valueString = parts.join('.')
  }

  // Add sign if requested (+ for positive, - already included for negative)
  if (hasSign && !decimal.isNegative() && !decimal.isZero()) {
    valueString = '+' + valueString
  }

  return <React.Fragment>{valueString}</React.Fragment>
}
