import { Options } from 'highcharts/highcharts'

export default {
  chart: {
    type: 'area',
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: '',
    },
    allowDecimals: false,
    labels: {
      format: '{value:,.0f}',
    },
    stackLabels: {
      enabled: true,
      format: '{total:,.2f}',
    },
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      marker: {
        enabled: false,
        symbol: 'circle',
      },
    },
    series: {
      connectNulls: true,
    },
  },
  tooltip: {
    shared: true,
    valueDecimals: 2,
    useHTML: true,
    pointFormat:
      '<div style="display:flex; justify-content:space-between; width:100%;">' +
      '<span style="margin-right:10px;">' +
      '<span style="color:{series.color}">\u25CF</span> {series.name}' +
      '</span>' +
      '<span style="text-align:right;">{point.y:,.2f}</span>' +
      '</div>',
  },
} as unknown as Options
