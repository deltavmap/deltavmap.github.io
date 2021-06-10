import Vue from 'vue'
import browserDetect from 'vue-browser-detect-plugin'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(browserDetect)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
