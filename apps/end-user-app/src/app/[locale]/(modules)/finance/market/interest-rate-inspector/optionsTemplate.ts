import { Options } from 'highcharts/highcharts'

// https://www.highcharts.com/docs/chart-and-series-types/network-graph
// https://www.highcharts.com/blog/tutorials/which-charts-are-best-at-showing-data-relationships/?search=network

export default {
  legend: {
    enabled: true,
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 840,
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
          },
        },
      },
    ],
  },
  chart: {
    marginTop: 48,
  },
  xAxis: {
    title: {
      text: '額度',
    },
    allowDecimals: false,
    labels: {
      format: '{value:,.0f}',
    },
  },
  yAxis: {
    title: {
      text: '利率',
    },
    // allowDecimals: false,
    labels: {
      format: '{value:.1f}%',
    },
    stackLabels: {
      enabled: true,
      format: '{total:.2f}%',
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
      '<div style="display:flex; align-items:center; justify-content:space-between; width:100%;">' +
      '<span style="margin-right:10px;">' +
      '<span style="color:{series.color}">\u25CF</span> {series.name}' +
      '</span>' +
      '<span style="text-align:right;">{point.y:.3f}%</span>' +
      '</div>',
  },
} as unknown as Options
