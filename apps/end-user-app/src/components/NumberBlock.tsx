import Decimal from 'decimal.js'
import React from 'react'

export default function NumberBlock({
  hasCommas = false,
  hasSign = false,
  value,
  fallbackValue = 0,
}: Readonly<{
  hasCommas?: boolean
  hasSign?: boolean
  value: number | string | undefined
  fallbackValue?: number
}>) {
  const decimal = new Decimal(value ?? fallbackValue)

  let valueString = decimal.toString()

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

  // const valueString = new Decimal(value ?? fallbackValue)
  //   .dividedBy(new Decimal(10 ** decimals))
  //   .toString()
  return <React.Fragment>{valueString}</React.Fragment>
}
