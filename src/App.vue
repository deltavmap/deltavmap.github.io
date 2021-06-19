<template>
  <v-app>
    <DeltaVMapPage v-on:refresh-app="refreshApp()"></DeltaVMapPage>
  </v-app>
</template>
<script>
import update from './mixins/update'

import DeltaVMapPage from './components/DeltaVMapPage'

export default {
  name: 'App',
  components: {
    DeltaVMapPage
  },
  mixins: [update]
}
</script>
<style lang="sass">
html
  overflow: hidden
</style>
