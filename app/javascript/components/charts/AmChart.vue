<template>
  <div class="chart--amchart">
    <div class="chart--amchart__wrapper-ie11">
      <div class="chart--amchart__scrollable">
        <div class="chart--amchart__bounding-box">
          <div class="chart--amchart__svg" id="chartdiv" />
        </div>
      </div>
    </div>

    <download 
      v-if="fileDownload"
      class="chart--amchart__download"
      event-element="Multiline Chart - Download CSV"
      :fileDownload="fileDownload"
      text="CSV Download"
    />
  </div>
</template>

<script>
import scrollMagic from "scrollmagic"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import Download from "../download/Download.vue"

am4core.useTheme(am4themes_animated)

const STROKE_COLOUR = am4core.color("#c8c8c8")

export default {
  name: "AmChart",
  
  components: {
    Download
  },

  mounted() {
    this.chartInit()
    this.startAnimation()
  },

  destroyed() {
     this.chart.dispose()
  },

  props: {
    chartBackgroundColour: {
      default: "#ffffff",
      type: String,
    },
    fileDownload: String,
    options:{
      default: function () { 
        return {
          y: ''
        } 
      },
      type: Object
    },
    rawData: {
      type: Object,
      required: true,
    },
    dots: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chart: null,
      chartData: [],
      colours: ["#32AC00", "#1C4AAF", "#64BAD9"],
      yTargetColours: ["#32AC00", "#1C4AAF"],
      xTargetColours: ["#000000"],
      totalSeries: 0,
      xAxis: null,
      yAxis: null,
    }
  },
  methods: {
    chartInit() {
      const points = this.rawData.datapoints
      this.totalSeries = Object.keys(points[0]).length - 1

      this.createChart()
      this.createXAxis(points)
      this.createYAxis(points)
      this.createLegend()
      this.createSeries()

      this.drawTargetLines(this.xAxis, this.rawData.xTargets, this.xTargetColours)
      this.drawTargetLines(this.yAxis, this.rawData.yTargets, this.yTargetColours)
    },

    startAnimation() {
      const vm = this
      const controller = new scrollMagic.Controller()
      const scene = new scrollMagic.Scene({
        triggerElement: ".chart--amchart",
        reverse: false,
      })
      scene.on("enter", function () {
        vm.addPointsToChart()
      })
      return scene.addTo(controller)
    },

    addPointsToChart() {
      const vm = this
      let counter = 0
      const i = setInterval(function () {
        vm.chart.addData(vm.rawData.datapoints[counter])
        counter++

        if (counter === vm.rawData.datapoints.length) {
          clearInterval(i)
        }
      }, 10)
    },

    createXAxis(points) {
      this.xAxis = this.chart.xAxes.push(new am4charts.DateAxis())
      this.styleAxisLine(this.xAxis)

      this.xAxis.renderer.minGridDistance = 50
      this.xAxis.renderer.ticks.template.disabled = false
      this.xAxis.renderer.ticks.template.strokeOpacity = 1
      this.xAxis.renderer.ticks.template.stroke = STROKE_COLOUR
      this.xAxis.renderer.ticks.template.length = 6
      this.xAxis.renderer.ticks.template.location = 0.5
      this.xAxis.renderer.labels.template.location = 0.5
      this.xAxis.renderer.baseInterval = { timeUnit: "year", count: 1 }

      //  Presetting min and max values on x-axis for smooth animation
      this.xAxis.min = new Date(points[0].x).getTime()
      this.xAxis.max = new Date(points[points.length - 1].x).getTime()
    },

    createYAxis(points) {
      this.yAxis = this.chart.yAxes.push(new am4charts.ValueAxis())
      this.yAxis.title.maxWidth = 120
      this.yAxis.title.text = `[bold]${this.rawData.units}[/]`
      this.yAxis.title.rotation = 0
      this.yAxis.title.valign = "top"
      this.yAxis.title.wrap = "true"
      this.yAxis.marginLeft = 0
      this.yAxis.maxWidth = 190
      this.yAxis.title.dy = -80
      this.yAxis.title.dx = 70

      //  Presetting min and max values on y-axis for smooth animation
      this.yAxis.min = Number(
        Object.entries(points[0])
        .slice(0, 3)
        .sort(([, a], [, b]) => a - b)[0][1]
      )

      if(this.options.y.max) {
        this.yAxis.max = this.options.y.max
      } else {
        this.yAxis.max = Number(
          Object.entries(points[points.length - 1])
          .slice(0, 3)
          .sort(([, a], [, b]) => b - a)[0][1] + 1
        )
      }

      this.styleAxisLine(this.yAxis)
    },

    styleAxisLine(axis) {
      axis.renderer.grid.template.disabled = true
      axis.renderer.line.strokeOpacity = 1
      axis.renderer.line.strokeWidth = 1
      axis.renderer.line.stroke = STROKE_COLOUR
    },

    createChart() {
      am4core.options.autoSetClassName = true

      this.chart = am4core.create("chartdiv", am4charts.XYChart)
      this.chart.paddingTop = 90
      this.chart.paddingRight = 40
      this.chart.paddingLeft = -20
      this.chart.background.fill = this.chartBackgroundColour
    },

    createDots(series, seriesNum) {
      const bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.fill = am4core.color(this.colours[seriesNum])
      bullet.circle.radius = 3
    },

    createLegend() {
      const legend = (this.chart.legend = new am4charts.Legend())
      legend.maxWidth = undefined
    },

    createSeries() {
    for (let seriesNum = 0; seriesNum < this.totalSeries; seriesNum++) {
        const series = this.chart.series.push(new am4charts.LineSeries())
        series.dataFields.valueY = seriesNum + 1
        series.dataFields.dateX = "x"
        series.name = this.rawData.legend[seriesNum]
        series.stroke = am4core.color(this.colours[seriesNum])
        series.strokeWidth = 3
        series.yAxis = this.yAxis
        series.showOnInit = false

        if (this.dots) {
          this.createDots(series, seriesNum)
        }
      }
    },
    drawTargetLines(axis, targets, colours) {
      if (targets === undefined) {
        return
      }

      for (let targetNum = 0; targetNum < targets.length; targetNum++) {
        const target = axis.axisRanges.create()

        if (targets[targetNum].isDate === true) {
          target.date = new Date(targets[targetNum].position)
          target.label.valign = "top"
          target.label.dx = -85
          target.label.dy = -10
        }
        else {
          target.value = targets[targetNum].position 
          target.label.verticalCenter = "bottom"
        }
        target.grid.stroke = am4core.color(colours[targetNum])
        target.grid.strokeDasharray = "3,3"
        target.grid.strokeWidth = 1
        target.grid.strokeOpacity = 1

        target.label.inside = true
        target.label.text = targets[targetNum].name
      }
      },
    },
  }
</script>