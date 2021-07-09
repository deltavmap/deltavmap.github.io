<template>
  <v-app class="u-bg-color-main">
    <transition name="page">
      <router-view/>
    </transition>
  </v-app>
</template>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import './sass/variables'

.u-bg-color-main
  background-color: $color-map-background

.u-bg-color-warn
  background-color: lighten($color-purpley-red, 0%)

html
  overflow-y: hidden !important

html, html > body, div.v-application.theme--dark
  @extend .u-bg-color-main

.theme--dark.v-sheet
  background-color: $color-purpley

</style>
<script>
import update from './mixins/update'

export default {
  name: 'App',
  mixins: [update]
}
</script>
