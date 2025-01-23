'use client'

import { merge } from 'lodash'

/*
import * as Highcharts from 'highcharts/highcharts'
import AccessibilityModule from 'highcharts/modules/accessibility'
import NetworkGraphModule from 'highcharts/modules/networkgraph'
AccessibilityModule(Highcharts)
NetworkGraphModule(Highcharts)
console.log(JSON.stringify(Highcharts.getOptions(), null, 2))
*/
const initialOptions = {
  colors: [
    '#265FB5',
    '#222',
    '#698F01',
    '#F4693E',
    '#4C0684',
    '#0FA388',
    '#B7104A',
    '#AF9023',
    '#1A704C',
    '#B02FDD',
  ],
  symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
  lang: {
    loading: 'Loading...',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekdays: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    decimalPoint: '.',
    numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
    resetZoom: 'Reset zoom',
    resetZoomTitle: 'Reset zoom level 1:1',
    thousandsSep: ' ',
    accessibility: {
      defaultChartTitle: 'Chart',
      chartContainerLabel: '{title}. Highcharts interactive chart.',
      svgContainerLabel: 'Interactive chart',
      drillUpButton: '{buttonText}',
      credits: 'Chart credits: {creditsStr}',
      thousandsSep: ',',
      svgContainerTitle: '',
      graphicContainerLabel: '',
      screenReaderSection: {
        beforeRegionLabel: '',
        afterRegionLabel: '',
        annotations: {
          heading: 'Chart annotations summary',
          descriptionSinglePoint:
            '{annotationText}. Related to {annotationPoint}',
          descriptionMultiplePoints:
            '{annotationText}. Related to {annotationPoint}{#each additionalAnnotationPoints}, also related to {this}{/each}',
          descriptionNoPoints: '{annotationText}',
        },
        endOfChartMarker: 'End of interactive chart.',
      },
      sonification: {
        playAsSoundButtonText: 'Play as sound, {chartTitle}',
        playAsSoundClickAnnouncement: 'Play',
      },
      legend: {
        legendLabelNoTitle: 'Toggle series visibility, {chartTitle}',
        legendLabel: 'Chart legend: {legendTitle}',
        legendItem: 'Show {itemName}',
      },
      zoom: {
        mapZoomIn: 'Zoom chart',
        mapZoomOut: 'Zoom out chart',
        resetZoomButton: 'Reset zoom',
      },
      rangeSelector: {
        dropdownLabel: '{rangeTitle}',
        minInputLabel: 'Select start date.',
        maxInputLabel: 'Select end date.',
        clickButtonAnnouncement: 'Viewing {axisRangeDescription}',
      },
      navigator: {
        handleLabel: '{#eq handleIx 0}Start, percent{else}End, percent{/eq}',
        groupLabel: 'Axis zoom',
        changeAnnouncement: '{axisRangeDescription}',
      },
      table: {
        viewAsDataTableButtonText: 'View as data table, {chartTitle}',
        tableSummary: 'Table representation of chart.',
      },
      announceNewData: {
        newDataAnnounce: 'Updated data for chart {chartTitle}',
        newSeriesAnnounceSingle: 'New data series: {seriesDesc}',
        newPointAnnounceSingle: 'New data point: {pointDesc}',
        newSeriesAnnounceMultiple:
          'New data series in chart {chartTitle}: {seriesDesc}',
        newPointAnnounceMultiple:
          'New data point in chart {chartTitle}: {pointDesc}',
      },
      seriesTypeDescriptions: {
        boxplot:
          'Box plot charts are typically used to display groups of statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.',
        arearange:
          'Arearange charts are line charts displaying a range between a lower and higher value for each point.',
        areasplinerange:
          'These charts are line charts displaying a range between a lower and higher value for each point.',
        bubble:
          'Bubble charts are scatter charts where each data point also has a size value.',
        columnrange:
          'Columnrange charts are column charts displaying a range between a lower and higher value for each point.',
        errorbar:
          'Errorbar series are used to display the variability of the data.',
        funnel:
          'Funnel charts are used to display reduction of data in stages.',
        pyramid:
          'Pyramid charts consist of a single pyramid with item heights corresponding to each point value.',
        waterfall:
          'A waterfall chart is a column chart where each column contributes towards a total end value.',
      },
      chartTypes: {
        emptyChart: 'Empty chart',
        mapTypeDescription: 'Map of {mapTitle} with {numSeries} data series.',
        unknownMap: 'Map of unspecified region with {numSeries} data series.',
        combinationChart: 'Combination chart with {numSeries} data series.',
        defaultSingle:
          'Chart with {numPoints} data {#eq numPoints 1}point{else}points{/eq}.',
        defaultMultiple: 'Chart with {numSeries} data series.',
        splineSingle:
          'Line chart with {numPoints} data {#eq numPoints 1}point{else}points{/eq}.',
        splineMultiple: 'Line chart with {numSeries} lines.',
        lineSingle:
          'Line chart with {numPoints} data {#eq numPoints 1}point{else}points{/eq}.',
        lineMultiple: 'Line chart with {numSeries} lines.',
        columnSingle:
          'Bar chart with {numPoints} {#eq numPoints 1}bar{else}bars{/eq}.',
        columnMultiple: 'Bar chart with {numSeries} data series.',
        barSingle:
          'Bar chart with {numPoints} {#eq numPoints 1}bar{else}bars{/eq}.',
        barMultiple: 'Bar chart with {numSeries} data series.',
        pieSingle:
          'Pie chart with {numPoints} {#eq numPoints 1}slice{else}slices{/eq}.',
        pieMultiple: 'Pie chart with {numSeries} pies.',
        scatterSingle:
          'Scatter chart with {numPoints} {#eq numPoints 1}point{else}points{/eq}.',
        scatterMultiple: 'Scatter chart with {numSeries} data series.',
        boxplotSingle:
          'Boxplot with {numPoints} {#eq numPoints 1}box{else}boxes{/eq}.',
        boxplotMultiple: 'Boxplot with {numSeries} data series.',
        bubbleSingle:
          'Bubble chart with {numPoints} {#eq numPoints 1}bubbles{else}bubble{/eq}.',
        bubbleMultiple: 'Bubble chart with {numSeries} data series.',
      },
      axis: {
        xAxisDescriptionSingular:
          'The chart has 1 X axis displaying {names[0]}. {ranges[0]}',
        xAxisDescriptionPlural:
          'The chart has {numAxes} X axes displaying {#each names}{#unless @first},{/unless}{#if @last} and{/if} {this}{/each}.',
        yAxisDescriptionSingular:
          'The chart has 1 Y axis displaying {names[0]}. {ranges[0]}',
        yAxisDescriptionPlural:
          'The chart has {numAxes} Y axes displaying {#each names}{#unless @first},{/unless}{#if @last} and{/if} {this}{/each}.',
        timeRangeDays: 'Data range: {range} days.',
        timeRangeHours: 'Data range: {range} hours.',
        timeRangeMinutes: 'Data range: {range} minutes.',
        timeRangeSeconds: 'Data range: {range} seconds.',
        rangeFromTo: 'Data ranges from {rangeFrom} to {rangeTo}.',
        rangeCategories: 'Data range: {numCategories} categories.',
      },
      exporting: {
        chartMenuLabel: 'Chart menu',
        menuButtonLabel: 'View chart menu, {chartTitle}',
      },
      series: {
        summary: {
          default:
            '{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          defaultCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          line: '{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          lineCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          spline:
            '{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          splineCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          column:
            '{series.name}, bar series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.',
          columnCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Bar series with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.',
          bar: '{series.name}, bar series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.',
          barCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Bar series with {series.points.length} {#eq series.points.length 1}bar{else}bars{/eq}.',
          pie: '{series.name}, pie {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}slice{else}slices{/eq}.',
          pieCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Pie with {series.points.length} {#eq series.points.length 1}slice{else}slices{/eq}.',
          scatter:
            '{series.name}, scatter plot {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}point{else}points{/eq}.',
          scatterCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}, scatter plot with {series.points.length} {#eq series.points.length 1}point{else}points{/eq}.',
          boxplot:
            '{series.name}, boxplot {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}box{else}boxes{/eq}.',
          boxplotCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Boxplot with {series.points.length} {#eq series.points.length 1}box{else}boxes{/eq}.',
          bubble:
            '{series.name}, bubble series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.',
          bubbleCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Bubble series with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.',
          map: '{series.name}, map {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}area{else}areas{/eq}.',
          mapCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Map with {series.points.length} {#eq series.points.length 1}area{else}areas{/eq}.',
          mapline:
            '{series.name}, line {seriesNumber} of {chart.series.length} with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          maplineCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Line with {series.points.length} data {#eq series.points.length 1}point{else}points{/eq}.',
          mapbubble:
            '{series.name}, bubble series {seriesNumber} of {chart.series.length} with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.',
          mapbubbleCombination:
            '{series.name}, series {seriesNumber} of {chart.series.length}. Bubble series with {series.points.length} {#eq series.points.length 1}bubble{else}bubbles{/eq}.',
        },
        description: '{description}',
        xAxisDescription: 'X axis, {name}',
        yAxisDescription: 'Y axis, {name}',
        nullPointValue: 'No value',
        pointAnnotationsDescription:
          '{#each annotations}Annotation: {this}{/each}',
      },
    },
  },
  global: {
    buttonTheme: {
      fill: '#f7f7f7',
      padding: 8,
      r: 2,
      stroke: '#cccccc',
      'stroke-width': 1,
      style: {
        color: '#333333',
        cursor: 'pointer',
        fontSize: '0.8em',
        fontWeight: 'normal',
      },
      states: {
        hover: {
          fill: '#e6e6e6',
        },
        select: {
          fill: '#e6e9ff',
          style: {
            color: '#000000',
            fontWeight: 'bold',
          },
        },
        disabled: {
          style: {
            color: '#cccccc',
          },
        },
      },
    },
  },
  time: {
    timezoneOffset: 0,
    useUTC: true,
  },
  chart: {
    alignThresholds: false,
    panning: {
      enabled: false,
      type: 'x',
    },
    styledMode: false,
    borderRadius: 0,
    colorCount: 10,
    allowMutatingData: true,
    ignoreHiddenSeries: true,
    spacing: [10, 10, 15, 10],
    resetZoomButton: {
      theme: {},
      position: {},
    },
    reflow: true,
    type: 'line',
    zooming: {
      singleTouch: false,
      resetButton: {
        theme: {
          zIndex: 6,
        },
        position: {
          align: 'right',
          x: -10,
          y: 10,
        },
      },
    },
    width: null,
    height: null,
    borderColor: '#334eff',
    backgroundColor: '#ffffff',
    plotBorderColor: '#cccccc',
  },
  title: {
    style: {
      color: '#333333',
      fontWeight: 'bold',
    },
    text: 'Chart title',
    align: 'center',
    margin: 15,
    widthAdjust: -44,
  },
  subtitle: {
    style: {
      color: '#666666',
      fontSize: '0.8em',
    },
    text: '',
    align: 'center',
    widthAdjust: -44,
  },
  caption: {
    margin: 15,
    style: {
      color: '#666666',
      fontSize: '0.8em',
    },
    text: '',
    align: 'left',
    verticalAlign: 'bottom',
  },
  plotOptions: {
    line: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: {
        enabledThreshold: 2,
        lineColor: '#ffffff',
        lineWidth: 0,
        radius: 4,
        states: {
          normal: {
            animation: true,
          },
          hover: {
            animation: {
              duration: 150,
            },
            enabled: true,
            radiusPlus: 2,
            lineWidthPlus: 1,
          },
          select: {
            fillColor: '#cccccc',
            lineColor: '#000000',
            lineWidth: 2,
          },
        },
      },
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: true,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      legendSymbol: 'lineMarker',
    },
    area: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: {
        enabledThreshold: 2,
        lineColor: '#ffffff',
        lineWidth: 0,
        radius: 4,
        states: {
          normal: {
            animation: true,
          },
          hover: {
            animation: {
              duration: 150,
            },
            enabled: true,
            radiusPlus: 2,
            lineWidthPlus: 1,
          },
          select: {
            fillColor: '#cccccc',
            lineColor: '#000000',
            lineWidth: 2,
          },
        },
      },
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: true,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      legendSymbol: 'areaMarker',
      threshold: 0,
    },
    spline: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: {
        enabledThreshold: 2,
        lineColor: '#ffffff',
        lineWidth: 0,
        radius: 4,
        states: {
          normal: {
            animation: true,
          },
          hover: {
            animation: {
              duration: 150,
            },
            enabled: true,
            radiusPlus: 2,
            lineWidthPlus: 1,
          },
          select: {
            fillColor: '#cccccc',
            lineColor: '#000000',
            lineWidth: 2,
          },
        },
      },
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: true,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      legendSymbol: 'lineMarker',
    },
    areaspline: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: {
        enabledThreshold: 2,
        lineColor: '#ffffff',
        lineWidth: 0,
        radius: 4,
        states: {
          normal: {
            animation: true,
          },
          hover: {
            animation: {
              duration: 150,
            },
            enabled: true,
            radiusPlus: 2,
            lineWidthPlus: 1,
          },
          select: {
            fillColor: '#cccccc',
            lineColor: '#000000',
            lineWidth: 2,
          },
        },
      },
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: true,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      legendSymbol: 'areaMarker',
      threshold: 0,
    },
    column: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: null,
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        x: 0,
      },
      cropThreshold: 50,
      opacity: 1,
      pointRange: null,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: false,
          brightness: 0.1,
        },
        select: {
          animation: {
            duration: 0,
          },
          color: '#cccccc',
          borderColor: '#000000',
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: false,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      borderRadius: 3,
      centerInCategory: false,
      groupPadding: 0.2,
      pointPadding: 0.1,
      minPointLength: 0,
      startFromThreshold: true,
      tooltip: {
        distance: 6,
      },
      threshold: 0,
      borderColor: '#ffffff',
    },
    bar: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: null,
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        x: 0,
      },
      cropThreshold: 50,
      opacity: 1,
      pointRange: null,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: false,
          brightness: 0.1,
        },
        select: {
          animation: {
            duration: 0,
          },
          color: '#cccccc',
          borderColor: '#000000',
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: false,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      borderRadius: 3,
      centerInCategory: false,
      groupPadding: 0.2,
      pointPadding: 0.1,
      minPointLength: 0,
      startFromThreshold: true,
      tooltip: {
        distance: 6,
      },
      threshold: 0,
      borderColor: '#ffffff',
    },
    scatter: {
      lineWidth: 0,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: {
        enabledThreshold: 2,
        lineColor: '#ffffff',
        lineWidth: 0,
        radius: 4,
        states: {
          normal: {
            animation: true,
          },
          hover: {
            animation: {
              duration: 150,
            },
            enabled: true,
            radiusPlus: 2,
            lineWidthPlus: 1,
          },
          select: {
            fillColor: '#cccccc',
            lineColor: '#000000',
            lineWidth: 2,
          },
        },
        enabled: true,
      },
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: true,
      turboThreshold: 1000,
      findNearestPointBy: 'xy',
      legendSymbol: 'lineMarker',
      jitter: {
        x: 0,
        y: 0,
      },
      tooltip: {
        headerFormat:
          '<span style="color:{point.color}">●</span> <span style="font-size: 0.8em"> {series.name}</span><br/>',
        pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>',
      },
    },
    pie: {
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: null,
      point: {
        events: {},
      },
      dataLabels: {
        animation: {},
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
        connectorPadding: 5,
        connectorShape: 'crookedLine',
        distance: 30,
        enabled: true,
        softConnector: true,
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
          brightness: 0.1,
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 150,
          },
          opacity: 0.2,
        },
      },
      stickyTracking: false,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      borderRadius: 3,
      center: [null, null],
      clip: false,
      colorByPoint: true,
      ignoreHiddenPoint: true,
      inactiveOtherPoints: true,
      legendType: 'point',
      size: null,
      showInLegend: false,
      slicedOffset: 10,
      tooltip: {
        followPointer: true,
      },
      borderColor: '#ffffff',
      borderWidth: 1,
    },
    networkgraph: {
      lineWidth: 2,
      allowPointSelect: false,
      crisp: true,
      showCheckbox: false,
      animation: {
        duration: 1000,
      },
      enableMouseTracking: true,
      events: {},
      marker: {
        enabledThreshold: 2,
        lineColor: '#ffffff',
        lineWidth: 0,
        radius: 4,
        states: {
          normal: {
            animation: true,
          },
          hover: {
            animation: {
              duration: 150,
            },
            enabled: true,
            radiusPlus: 2,
            lineWidthPlus: 1,
          },
          select: {
            fillColor: '#cccccc',
            lineColor: '#000000',
            lineWidth: 2,
          },
          inactive: {
            opacity: 0.3,
            animation: {
              duration: 50,
            },
          },
        },
        enabled: true,
      },
      point: {
        events: {},
      },
      dataLabels: {
        animation: {
          defer: 1000,
        },
        align: 'center',
        borderWidth: 0,
        defer: true,
        padding: 5,
        style: {
          fontSize: '0.7em',
          fontWeight: 'bold',
          color: 'contrast',
          textOutline: '1px contrast',
          transition: 'opacity 2000ms',
        },
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
        linkTextPath: {
          enabled: true,
        },
        textPath: {
          enabled: false,
        },
      },
      cropThreshold: 300,
      opacity: 1,
      pointRange: 0,
      softThreshold: true,
      states: {
        normal: {
          animation: true,
        },
        hover: {
          animation: {
            duration: 150,
          },
          lineWidthPlus: 1,
          marker: {},
          halo: {
            size: 10,
            opacity: 0.25,
          },
        },
        select: {
          animation: {
            duration: 0,
          },
        },
        inactive: {
          animation: {
            duration: 50,
          },
          opacity: 0.2,
          linkOpacity: 0.3,
        },
      },
      stickyTracking: false,
      turboThreshold: 1000,
      findNearestPointBy: 'x',
      inactiveOtherPoints: true,
      link: {
        color: 'rgba(100, 100, 100, 0.5)',
        width: 1,
      },
      draggable: true,
      layoutAlgorithm: {
        initialPositions: 'circle',
        initialPositionRadius: 1,
        enableSimulation: false,
        theta: 0.5,
        maxSpeed: 10,
        approximation: 'none',
        type: 'reingold-fruchterman',
        integration: 'euler',
        maxIterations: 1000,
        gravitationalConstant: 0.0625,
        friction: -0.981,
      },
      showInLegend: false,
    },
    series: {
      dataLabels: {
        color: '#F0F0F3',
      },
      marker: {
        lineColor: '#333',
      },
    },
    boxplot: {
      fillColor: '#505053',
    },
    candlestick: {
      lineColor: 'white',
    },
    errorbar: {
      color: 'white',
    },
    map: {
      nullColor: '#353535',
    },
  },
  legend: {
    enabled: true,
    align: 'center',
    alignColumns: true,
    className: 'highcharts-no-tooltip',
    events: {},
    layout: 'horizontal',
    itemMarginBottom: 2,
    itemMarginTop: 2,
    borderColor: '#999999',
    borderRadius: 0,
    navigation: {
      style: {
        fontSize: '0.8em',
      },
      activeColor: '#0022ff',
      inactiveColor: '#cccccc',
    },
    itemStyle: {
      color: '#333333',
      cursor: 'pointer',
      fontSize: '0.8em',
      textDecoration: 'none',
      textOverflow: 'ellipsis',
    },
    itemHoverStyle: {
      color: '#000000',
    },
    itemHiddenStyle: {
      color: '#666666',
      textDecoration: 'line-through',
    },
    shadow: false,
    itemCheckboxStyle: {
      position: 'absolute',
      width: '13px',
      height: '13px',
    },
    squareSymbol: true,
    symbolPadding: 5,
    verticalAlign: 'bottom',
    x: 0,
    y: 0,
    title: {
      style: {
        fontSize: '0.8em',
        fontWeight: 'bold',
        color: '#D0D0D0',
      },
    },
    accessibility: {
      enabled: true,
      keyboardNavigation: {
        enabled: true,
      },
    },
    backgroundColor: 'transparent',
  },
  loading: {
    labelStyle: {
      fontWeight: 'bold',
      position: 'relative',
      top: '45%',
    },
    style: {
      position: 'absolute',
      backgroundColor: '#ffffff',
      opacity: 0.5,
      textAlign: 'center',
    },
  },
  tooltip: {
    enabled: true,
    animation: {
      duration: 300,
    },
    borderRadius: 3,
    dateTimeLabelFormats: {
      millisecond: '%A, %e %b, %H:%M:%S.%L',
      second: '%A, %e %b, %H:%M:%S',
      minute: '%A, %e %b, %H:%M',
      hour: '%A, %e %b, %H:%M',
      day: '%A, %e %b %Y',
      week: 'Week from %A, %e %b %Y',
      month: '%B %Y',
      year: '%Y',
    },
    footerFormat: '',
    headerShape: 'callout',
    hideDelay: 500,
    padding: 8,
    shape: 'callout',
    shared: false,
    snap: 10,
    headerFormat: '<span style="font-size: 0.8em">{point.key}</span><br/>',
    pointFormat:
      '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
    backgroundColor: '#ffffff',
    shadow: true,
    stickOnContact: false,
    style: {
      color: '#333333',
      cursor: 'default',
      fontSize: '0.8em',
    },
    useHTML: false,
  },
  credits: {
    enabled: true,
    href: 'https://www.highcharts.com?credits',
    position: {
      align: 'right',
      x: -10,
      verticalAlign: 'bottom',
      y: -5,
    },
    style: {
      cursor: 'pointer',
      color: '#767676',
      fontSize: '0.6em',
    },
    text: 'Highcharts.com',
  },
  xAxis: {
    alignTicks: true,
    panningEnabled: true,
    zIndex: 2,
    zoomEnabled: true,
    dateTimeLabelFormats: {
      millisecond: {
        main: '%H:%M:%S.%L',
        range: false,
      },
      second: {
        main: '%H:%M:%S',
        range: false,
      },
      minute: {
        main: '%H:%M',
        range: false,
      },
      hour: {
        main: '%H:%M',
        range: false,
      },
      day: {
        main: '%e %b',
      },
      week: {
        main: '%e %b',
      },
      month: {
        main: "%b '%y",
      },
      year: {
        main: '%Y',
      },
    },
    endOnTick: false,
    gridLineDashStyle: 'Solid',
    gridZIndex: 1,
    labels: {
      autoRotationLimit: 80,
      distance: 15,
      enabled: true,
      indentation: 10,
      overflow: 'justify',
      staggerLines: 0,
      step: 0,
      useHTML: false,
      zIndex: 7,
      style: {
        color: '#333333',
        cursor: 'default',
        fontSize: '0.8em',
      },
    },
    maxPadding: 0.01,
    minorGridLineDashStyle: 'Solid',
    minorTickLength: 2,
    minorTickPosition: 'outside',
    minorTicksPerMajor: 5,
    minPadding: 0.01,
    reversedStacks: false,
    showEmpty: true,
    showFirstLabel: true,
    showLastLabel: true,
    startOfWeek: 1,
    startOnTick: false,
    tickLength: 10,
    tickPixelInterval: 100,
    tickmarkPlacement: 'between',
    tickPosition: 'outside',
    title: {
      align: 'middle',
      useHTML: false,
      x: 0,
      y: 0,
      style: {
        color: '#666666',
        fontSize: '0.8em',
      },
    },
    visible: true,
    minorGridLineColor: '#f2f2f2',
    minorGridLineWidth: 1,
    minorTickColor: '#999999',
    lineColor: '#333333',
    lineWidth: 1,
    gridLineColor: '#e6e6e6',
    tickColor: '#333333',
  },
  yAxis: {
    alignTicks: true,
    panningEnabled: true,
    zIndex: 2,
    zoomEnabled: true,
    dateTimeLabelFormats: {
      millisecond: {
        main: '%H:%M:%S.%L',
        range: false,
      },
      second: {
        main: '%H:%M:%S',
        range: false,
      },
      minute: {
        main: '%H:%M',
        range: false,
      },
      hour: {
        main: '%H:%M',
        range: false,
      },
      day: {
        main: '%e %b',
      },
      week: {
        main: '%e %b',
      },
      month: {
        main: "%b '%y",
      },
      year: {
        main: '%Y',
      },
    },
    endOnTick: true,
    gridLineDashStyle: 'Solid',
    gridZIndex: 1,
    labels: {
      autoRotationLimit: 80,
      distance: 15,
      enabled: true,
      indentation: 10,
      overflow: 'justify',
      staggerLines: 0,
      step: 0,
      useHTML: false,
      zIndex: 7,
      style: {
        color: '#333333',
        cursor: 'default',
        fontSize: '0.8em',
      },
    },
    maxPadding: 0.05,
    minorGridLineDashStyle: 'Solid',
    minorTickLength: 2,
    minorTickPosition: 'outside',
    minorTicksPerMajor: 5,
    minPadding: 0.05,
    reversedStacks: true,
    showEmpty: true,
    showFirstLabel: true,
    showLastLabel: true,
    startOfWeek: 1,
    startOnTick: true,
    tickLength: 10,
    tickPixelInterval: 72,
    tickmarkPlacement: 'between',
    tickPosition: 'outside',
    title: {
      align: 'middle',
      useHTML: false,
      x: 0,
      y: 0,
      style: {
        color: '#666666',
        fontSize: '0.8em',
      },
      text: 'Values',
    },
    visible: true,
    minorGridLineColor: '#f2f2f2',
    minorGridLineWidth: 1,
    minorTickColor: '#999999',
    lineColor: '#333333',
    lineWidth: 0,
    gridLineColor: '#e6e6e6',
    gridLineWidth: 1,
    tickColor: '#333333',
    stackLabels: {
      animation: {},
      allowOverlap: false,
      enabled: false,
      crop: true,
      overflow: 'justify',
      style: {
        color: '#000000',
        fontSize: '0.7em',
        fontWeight: 'bold',
        textOutline: '1px contrast',
      },
    },
  },
  scrollbar: {
    height: 10,
    barBorderRadius: 5,
    buttonBorderRadius: 0,
    buttonsEnabled: false,
    minWidth: 6,
    opposite: true,
    step: 0.2,
    zIndex: 3,
    barBackgroundColor: '#cccccc',
    barBorderWidth: 0,
    barBorderColor: '#cccccc',
    buttonArrowColor: '#333333',
    buttonBackgroundColor: '#e6e6e6',
    buttonBorderColor: '#cccccc',
    buttonBorderWidth: 1,
    rifleColor: 'none',
    trackBackgroundColor: 'rgba(255, 255, 255, 0.001)',
    trackBorderColor: '#cccccc',
    trackBorderRadius: 5,
    trackBorderWidth: 1,
  },
  accessibility: {
    enabled: true,
    screenReaderSection: {
      beforeChartFormat:
        '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>',
      afterChartFormat: '{endOfChartMarker}',
      axisRangeDateFormat: '%Y-%m-%d %H:%M:%S',
    },
    series: {
      descriptionFormat:
        '{seriesDescription}{authorDescription}{axisDescription}',
      describeSingleSeries: false,
      pointDescriptionEnabledThreshold: 200,
    },
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}.',
      describeNull: true,
    },
    landmarkVerbosity: 'all',
    linkedDescription:
      '*[data-highcharts-chart="{index}"] + .highcharts-description',
    highContrastMode: 'auto',
    keyboardNavigation: {
      enabled: true,
      focusBorder: {
        enabled: true,
        hideBrowserFocusOutline: true,
        style: {
          color: '#334eff',
          lineWidth: 2,
          borderRadius: 3,
        },
        margin: 2,
      },
      order: [
        'series',
        'zoom',
        'rangeSelector',
        'navigator',
        'legend',
        'chartMenu',
      ],
      wrapAround: true,
      seriesNavigation: {
        skipNullPoints: true,
        pointNavigationEnabledThreshold: false,
        rememberPointFocus: false,
      },
    },
    announceNewData: {
      enabled: false,
      minAnnounceInterval: 5000,
      interruptUser: false,
    },
    highContrastTheme: {
      chart: {
        backgroundColor: 'window',
      },
      title: {
        style: {
          color: 'windowText',
        },
      },
      subtitle: {
        style: {
          color: 'windowText',
        },
      },
      colorAxis: {
        minColor: 'windowText',
        maxColor: 'windowText',
        stops: [],
        dataClasses: [],
      },
      colors: ['windowText'],
      xAxis: {
        gridLineColor: 'windowText',
        labels: {
          style: {
            color: 'windowText',
          },
        },
        lineColor: 'windowText',
        minorGridLineColor: 'windowText',
        tickColor: 'windowText',
        title: {
          style: {
            color: 'windowText',
          },
        },
      },
      yAxis: {
        gridLineColor: 'windowText',
        labels: {
          style: {
            color: 'windowText',
          },
        },
        lineColor: 'windowText',
        minorGridLineColor: 'windowText',
        tickColor: 'windowText',
        title: {
          style: {
            color: 'windowText',
          },
        },
      },
      tooltip: {
        backgroundColor: 'window',
        borderColor: 'windowText',
        style: {
          color: 'windowText',
        },
      },
      plotOptions: {
        series: {
          lineColor: 'windowText',
          fillColor: 'window',
          borderColor: 'windowText',
          edgeColor: 'windowText',
          borderWidth: 1,
          dataLabels: {
            connectorColor: 'windowText',
            color: 'windowText',
            style: {
              color: 'windowText',
              textOutline: 'none',
            },
          },
          marker: {
            lineColor: 'windowText',
            fillColor: 'windowText',
          },
        },
        pie: {
          color: 'window',
          colors: ['window'],
          borderColor: 'windowText',
          borderWidth: 1,
        },
        boxplot: {
          fillColor: 'window',
        },
        candlestick: {
          lineColor: 'windowText',
          fillColor: 'window',
        },
        errorbar: {
          fillColor: 'window',
        },
      },
      legend: {
        backgroundColor: 'window',
        itemStyle: {
          color: 'windowText',
        },
        itemHoverStyle: {
          color: 'windowText',
        },
        itemHiddenStyle: {
          color: '#555',
        },
        title: {
          style: {
            color: 'windowText',
          },
        },
      },
      credits: {
        style: {
          color: 'windowText',
        },
      },
      drilldown: {
        activeAxisLabelStyle: {
          color: 'windowText',
        },
        activeDataLabelStyle: {
          color: 'windowText',
        },
      },
      navigation: {
        buttonOptions: {
          symbolStroke: 'windowText',
          theme: {
            fill: 'window',
          },
        },
      },
      rangeSelector: {
        buttonTheme: {
          fill: 'window',
          stroke: 'windowText',
          style: {
            color: 'windowText',
          },
          states: {
            hover: {
              fill: 'window',
              stroke: 'windowText',
              style: {
                color: 'windowText',
              },
            },
            select: {
              fill: '#444',
              stroke: 'windowText',
              style: {
                color: 'windowText',
              },
            },
          },
        },
        inputBoxBorderColor: 'windowText',
        inputStyle: {
          backgroundColor: 'window',
          color: 'windowText',
        },
        labelStyle: {
          color: 'windowText',
        },
      },
      navigator: {
        handles: {
          backgroundColor: 'window',
          borderColor: 'windowText',
        },
        outlineColor: 'windowText',
        maskFill: 'transparent',
        series: {
          color: 'windowText',
          lineColor: 'windowText',
        },
        xAxis: {
          gridLineColor: 'windowText',
        },
      },
      scrollbar: {
        barBackgroundColor: '#444',
        barBorderColor: 'windowText',
        buttonArrowColor: 'windowText',
        buttonBackgroundColor: 'window',
        buttonBorderColor: 'windowText',
        rifleColor: 'windowText',
        trackBackgroundColor: 'window',
        trackBorderColor: 'windowText',
      },
    },
  },
  exporting: {
    accessibility: {
      enabled: true,
    },
  },
  navigator: {
    accessibility: {
      enabled: true,
    },
    series: {
      color: '#5f98cf',
      lineColor: '#5f98cf',
    },
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA',
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(180,180,255,0.2)',
    xAxis: {
      gridLineColor: '#505053',
    },
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: '#F0F0F3',
    },
    activeDataLabelStyle: {
      color: '#F0F0F3',
    },
  },
  navigation: {
    buttonOptions: {
      symbolStroke: '#DDDDDD',
      theme: {
        fill: '#505053',
      },
    },
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#eee',
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: '#F0F0F3',
          },
        },
        select: {
          fill: '#303030',
          stroke: '#101010',
          style: {
            color: '#F0F0F3',
          },
        },
      },
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: '#F0F0F3',
    },
    labelStyle: {
      color: '#F0F0F3',
    },
  },
}

function extractColorValues(obj) {
  const colors = {}

  function traverse(currentObj, path = '') {
    for (const [key, value] of Object.entries(currentObj)) {
      const fullPath = path ? `${path}.${key}` : key

      if (
        key.toLowerCase().endsWith('color') ||
        key.toLowerCase().endsWith('colors')
      ) {
        colors[fullPath] = value
      }

      if (typeof value === 'object' && value !== null) {
        traverse(value, fullPath)
      }
    }
  }

  traverse(obj)
  return colors
}

function unflattenObject(flatObj) {
  const result = {}

  for (const [key, value] of Object.entries(flatObj)) {
    const keys = key.split('.')
    let current = result

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!(k in current)) {
        current[k] = {}
      }
      current = current[k]
    }

    current[keys[keys.length - 1]] = value
  }

  return result
}
export const colorOptions = unflattenObject(extractColorValues(initialOptions))

// import HighContrastLight from 'highcharts/themes/high-contrast-light'
export const lightThemeOptions = merge({}, colorOptions, {
  colors: [
    '#265FB5',
    '#222',
    '#698F01',
    '#F4693E',
    '#4C0684',
    '#0FA388',
    '#B7104A',
    '#AF9023',
    '#1A704C',
    '#B02FDD',
  ],
  plotOptions: {
    series: {
      dataLabels: {
        color: '#000',
      },
    },
  },
  credits: { style: { color: '#767676' } },
  navigator: { series: { color: '#5f98cf', lineColor: '#5f98cf' } },
})

// import HighContrastDark from 'highcharts/themes/high-contrast-dark'
export const darkThemeOptions = merge({}, colorOptions, {
  colors: [
    '#67B9EE',
    '#CEEDA5',
    '#9F6AE1',
    '#FEA26E',
    '#6BA48F',
    '#EA3535',
    '#8D96B7',
    '#ECCA15',
    '#20AA09',
    '#E0C3E4',
  ],
  chart: { backgroundColor: '#1f1f20', plotBorderColor: '#606063' },
  title: { style: { color: '#F0F0F3' } },
  subtitle: { style: { color: '#F0F0F3' } },
  xAxis: {
    gridLineColor: '#707073',
    labels: { style: { color: '#F0F0F3' } },
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',
    title: { style: { color: '#F0F0F3' } },
  },
  yAxis: {
    gridLineColor: '#707073',
    labels: { style: { color: '#F0F0F3' } },
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',
    title: { style: { color: '#F0F0F3' } },
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: { color: '#F0F0F3' },
  },
  plotOptions: {
    series: {
      dataLabels: { color: '#F0F0F3' },
      marker: { lineColor: '#333' },
    },
    boxplot: { fillColor: '#505053' },
    candlestick: { lineColor: 'white' },
    errorbar: { color: 'white' },
    map: { nullColor: '#353535' },
  },
  legend: {
    backgroundColor: 'transparent',
    itemStyle: { color: '#F0F0F3' },
    itemHoverStyle: { color: '#FFF' },
    itemHiddenStyle: { color: '#606063' },
    title: { style: { color: '#D0D0D0' } },
  },
  credits: { style: { color: '#F0F0F3' } },
  drilldown: {
    activeAxisLabelStyle: { color: '#F0F0F3' },
    activeDataLabelStyle: { color: '#F0F0F3' },
  },
  navigation: {
    buttonOptions: { symbolStroke: '#DDDDDD', theme: { fill: '#505053' } },
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: { color: '#eee' },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: { color: '#F0F0F3' },
        },
        select: {
          fill: '#303030',
          stroke: '#101010',
          style: { color: '#F0F0F3' },
        },
      },
    },
    inputBoxBorderColor: '#505053',
    inputStyle: { backgroundColor: '#333', color: '#F0F0F3' },
    labelStyle: { color: '#F0F0F3' },
  },
  navigator: {
    handles: { backgroundColor: '#666', borderColor: '#AAA' },
    outlineColor: '#CCC',
    maskFill: 'rgba(180,180,255,0.2)',
    series: { color: '#7798BF', lineColor: '#A6C7ED' },
    xAxis: { gridLineColor: '#505053' },
  },
  scrollbar: {
    barBackgroundColor: '#808083',
    barBorderColor: '#808083',
    buttonArrowColor: '#CCC',
    buttonBackgroundColor: '#606063',
    buttonBorderColor: '#606063',
    rifleColor: '#FFF',
    trackBackgroundColor: '#404043',
    trackBorderColor: '#404043',
  },
})
