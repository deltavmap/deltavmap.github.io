import Vue from 'vue'

import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = true

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
