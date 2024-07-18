import React from 'react'

const SomeChart = () => {
  const chartRef = React.useRef(null)
  const data = [
    { cx: 100, cy: 100, value: 7 },
    { cx: 150, cy: 70, value: 15 },
    { cx: 50, cy: 30, value: 4 },
  ]
  React.useEffect(() => {
    // d3.select(chartRef.current)
    //   .datum(grouped.concat([annotations]))
    //   .call(chart)
  }, [chartRef])

  return (
    <svg ref={chartRef}>
      <g className="container">
        {data.map((d, i) => (
          <circle key={i} className="my-circle" />
        ))}
      </g>
    </svg>
  )
}
