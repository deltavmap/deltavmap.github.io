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
@import './sass/pages-common'

html
  overflow-y: hidden !important

</style>
<script>
import update from './mixins/update'

export default {
  name: 'App',
  mixins: [update]
}
</script>
