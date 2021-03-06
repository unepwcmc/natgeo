// polyfills
import 'babel-polyfill'

// libraries
import Vue from 'vue/dist/vue.esm'
import VueAnalytics from 'vue-analytics'
import TurbolinksAdapter from 'vue-turbolinks'

// helpers
import { setRTLPluginOnce } from "../components/map/map-helpers.js"

Vue.config.productionTip = false

if (window._railsEnv === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-129227134-1',
    checkDuplicatedScript: true
  })
}
else if (window._railsEnv === 'staging') {
  console.log('Google Analytics for staging')
  Vue.use(VueAnalytics, {
    id: 'UA-129227134-2',
    checkDuplicatedScript: true
  })
}
Vue.use(TurbolinksAdapter)

// store
import store from '../store/store.js'

// vue components
import Accordion from '../components/accordion/Accordion'
import AccordionItem from '../components/accordion/AccordionItem'
import AmChart from '../components/charts/AmChart'
import AmChartGauge from '../components/charts/AmChartGauge'
import CardImage from '../components/cards/CardImage'
import CarouselFixed from '../components/carousel/CarouselFixed'
import ChartArea from '../components/charts/ChartArea'
import ChartColumn from '../components/charts/ChartColumn'
import ChartDoughnut from '../components/charts/ChartDoughnut'
import ChartLegend from '../components/charts/ChartLegend'
import ChartRow from '../components/charts/ChartRow'
import ChartRowStacked from '../components/charts/ChartRowStacked'
import Download from '../components/download/Download'
import MapInfographic from '../components/map/MapInfographic'
import MapStatistics from '../components/map/MapStatistics'
import NavLink from '../components/nav/NavLink'
import References from '../components/references/References'
import SelectText from '../components/select/SelectText'
import Pagination from '../components/pagination/Pagination'
import SocialShare from '../components/social/SocialShare'

// create event hub and export so that it can be imported into .vue files
export const eventHub = new Vue()

// create vue instance and attach to the DOM
document.addEventListener('turbolinks:load', () => {
  const app = new Vue({
    el: '#v-app',
    store,
    components: {
      Accordion,
      AccordionItem,
      AmChart,
      AmChartGauge,
      CardImage,
      CarouselFixed,
      ChartArea,
      ChartColumn,
      ChartDoughnut,
      ChartLegend,
      ChartRow,
      ChartRowStacked,
      Download,
      MapInfographic,
      MapStatistics,
      NavLink,
      References,
      SelectText,
      Pagination,
      SocialShare
    },

    mounted () {
      // Add support for RTL languages
      // Make sure this is only called once per page
      if(!window.RTLPluginIsSet) { 
        setRTLPluginOnce() 
        window.RTLPluginIsSet = true
      }
    }
  })
})
