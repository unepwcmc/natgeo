<template>
  <div class="chart--row">
    <p v-if="title" class="chart__title">{{ title }}</p>

    <div class="chart__chart">
      <div v-for="(row, index) in rows" :key="`row-${index}`">
        <span class="chart__label">{{ row.label }}</span>
        <div
          class="chart__row flex flex-v-center flex-h-between"
          :class="themeClass"
        >
          <span class="chart__bar" :style="{ width: row.percent + '%' }"></span>
          <span
            :class="`chart__bar--oecm ${legendClass}`"
            v-if="row.percent_oecm > 0"
            :style="{ width: row.percent_oecm + '%', left: row.percent + '%' }"
          ></span>
        </div>
        <ul class="chart__legend">
          <li>
            <span :class="`chart-key__wdpa--${legendClass}`"></span>
            <p>PAs {{ row.percent }} %</p>
          </li>
          <li v-if="row.percent_oecm > 0">
            <span :class="`chart-key__oecm--${legendClass}`"></span>
            <p>OECMs {{ row.percent_oecm }}%</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollMagic from "scrollmagic"

export default {
  name: "chart-row",

  props: {
    title: String,
    theme: String,
    rows: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.animateOnScroll()
  },
  methods: {
    animateOnScroll() {
      const controller = new ScrollMagic.Controller()
      const scene = new ScrollMagic.Scene({
        triggerElement: ".chart--row__subtitle",
        reverse: false,
      }).setClassToggle(
        ".chart__bar, .chart__bar--oecm",
        "bar-animate"
      )
      scene.addTo(controller)
    }
  },
  computed: {
    themeClass() {
      return `chart-theme--${this.theme}`
    },
    legendClass() {
      return `${this.theme}`
    },
  },
};
</script>