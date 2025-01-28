import { Options } from 'highcharts/highcharts'

// https://www.highcharts.com/demo/highcharts/sankey-diagram

export const getOptions = (series: any) => {
  const colors = [
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
  ]
  return {
    chart: {
      height: 720,
    },
    legend: {
      enabled: true,
    },
    tooltip: Object.assign(
      {
        headerFormat: '',
        pointFormat:
          '{point.fromNode.name} \u2192 {point.toNode.name}: <b>${point.weight:,.0f}</b>',
        style: {
          pointerEvents: 'auto',
        },
      },
      {
        nodeFormat: '{point.name}: <b>${point.sum:,.0f}</b>',
      }
    ),
    series: series.map((s: any, index: number) => ({
      name: s.name,
      type: 'sankey',
      showInLegend: true,
      colorByPoint: false,
      clip: false,
      color: colors[index % colors.length],
      dataLabels: {
        nodeFormatter: function () {
          const point = (
            this as unknown as { point: { name: string; sum: number } }
          ).point
          return `${point.name}<br />${String(
            Math.floor(point.sum / 1000000)
          )}M`
        },
        // nodeFormat: '{point.name}<br />${point.sum:,.0f}',
      },
      keys: ['from', 'to', 'weight'],
      nodes: s.nodes,
      data: s.links,
    })),
  } as unknown as Options
}
