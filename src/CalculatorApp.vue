<template>
  <v-app class="u-bg-color-main">
    <calculators></calculators>
  </v-app>
</template>
<script>
import Calculators from './views/Calculators'

export default {
  name: 'App',
  components: {
    Calculators
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import './sass/variables'
@import './sass/pages-common'

.theme--dark.v-label
  color: lighten($color-purpley, 25%)

</style>
