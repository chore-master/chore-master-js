// import { colors } from '@/utils/chart'
// import * as d3 from 'd3'
// import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey'
import React from 'react'
import { useMeasure } from 'react-use'

export default function SessionChart({ layout, priceDatapoints }) {
  const chartLayout = Object.assign(
    {
      width: 640,
      minWidth: undefined,
      height: 400,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 40,
    },
    layout
  )
  const [chartRef, chartMeasure] = useMeasure()
  const [pricesData, setPricesData] = React.useState(priceDatapoints)

  React.useEffect(() => {
    setPricesData(priceDatapoints)
  }, [priceDatapoints])

  return (
    <svg
      ref={chartRef}
      style={{
        width: chartLayout.width,
        minWidth: chartLayout.minWidth,
        height: chartLayout.height,
      }}
    ></svg>
  )
}
