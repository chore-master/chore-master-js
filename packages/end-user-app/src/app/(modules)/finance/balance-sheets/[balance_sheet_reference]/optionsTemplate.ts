import { Options } from 'highcharts/highcharts'

export const pieChartOptionsTemplate = {
  chart: {
    type: 'pie',
  },
  plotOptions: {
    series: {
      borderRadius: 5,
      dataLabels: [
        {
          enabled: true,
          distance: 15,
          format: '{point.name}',
        },
        {
          enabled: true,
          distance: '-30%',
          filter: {
            property: 'percentage',
            operator: '>',
            value: 5,
          },
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '0.9em',
            textOutline: 'none',
          },
        },
      ],
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: ' +
      '<b>{point.y:,.2f} {point.settlementAssetSymbol} ({point.percentage:.2f}%)</b><br/>',
  },
} as unknown as Options
