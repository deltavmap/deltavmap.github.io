import Vue from 'vue'

import CalculatorApp from '../../CalculatorApp.vue'
import vuetify from '../../plugins/vuetify'

Vue.config.productionTip = true

new Vue({
  vuetify,
  render: h => h(CalculatorApp)
}).$mount('#app')
