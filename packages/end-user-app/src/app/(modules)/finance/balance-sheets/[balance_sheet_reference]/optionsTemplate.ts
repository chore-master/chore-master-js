import { Options } from 'highcharts/highcharts'

export const pieChartOptionsTemplate = {
  chart: {
    type: 'pie',
    animation: false,
  },
  plotOptions: {
    pie: {
      animation: false,
    },
  },
} as unknown as Options
