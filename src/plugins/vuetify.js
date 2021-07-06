import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: 'red',
        secondary: 'green',
        accent: 'yellow',
        error: 'black'
      },
      dark: {
        primary: '#eee',
        secondary: '#8f8',
        accent: '#ff3',
        error: '#f99'
      }
    }
  }
})
