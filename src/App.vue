<template>
  <v-app>
    <DeltaVMapPage></DeltaVMapPage>
  </v-app>
</template>
<script>
import DeltaVMapPage from './components/DeltaVMapPage'

export default {
  name: 'App',
  components: {
    DeltaVMapPage
  }
}
</script>
<style lang="sass">
html
  overflow: hidden
</style>
