import { Options } from 'highcharts/highcharts'

export const areaChartOptionsTemplate = {
  chart: {
    type: 'area',
  },
  xAxis: {
    type: 'datetime',
    // https://api.highcharts.com/highcharts/xAxis.dateTimeLabelFormats
    dateTimeLabelFormats: {
      month: '%Y-%m', // https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat
    },
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
    headerFormat:
      '<div style="font-size: 14px; margin-bottom: 8px;">{point.key}</div>',
    xDateFormat: '%Y-%m-%d %H:%M',
    pointFormat:
      '<div style="display:flex; justify-content:space-between; width:100%;">' +
      '<span style="margin-right:10px;">' +
      '<span style="color:{series.color}; font-size:16px;">\u25CF</span> {series.name}' +
      '</span>' +
      '<span style="text-align:right;">{point.y:,.2f}</span>' +
      '</div>',
  },
} as unknown as Options
