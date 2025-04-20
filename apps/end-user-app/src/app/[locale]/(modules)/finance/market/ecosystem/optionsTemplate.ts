import { Options } from 'highcharts/highcharts'

// https://www.highcharts.com/docs/chart-and-series-types/network-graph
// https://www.highcharts.com/blog/tutorials/which-charts-are-best-at-showing-data-relationships/?search=network

export default {
  chart: {
    height: 720,
  },
  plotOptions: {
    networkgraph: {
      layoutAlgorithm: {
        enableSimulation: true,
        integration: 'verlet',
        linkLength: 80,
      },
    },
  },
  tooltip: {
    useHTML: true,
    outside: true,
    style: {
      pointerEvents: 'auto',
    },
    formatter: function (this: {
      point: { full_name?: string; name: string; avatar_url?: string }
    }): string {
      let result = ''
      if (this.point.full_name) {
        result += `<div><b>${this.point.full_name}</b></div>`
      } else {
        result += `<div><b>${this.point.name}</b></div>`
      }
      if (this.point.avatar_url) {
        result += `<div><img src="${this.point.avatar_url}" style="display: block; height: 64px;" /></div>`
      }
      result = `<div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">${result}</div>`
      return result
    },
  },
  series: [
    {
      type: 'networkgraph',
      dataLabels: {
        enabled: true,
        linkFormat: '',
        allowOverlap: true,
        style: {
          textOutline: false,
        },
      },
      nodes: [],
      data: [],
    },
  ],
} as unknown as Options
