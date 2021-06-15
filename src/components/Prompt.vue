<template>
  <div class="prompt"
       v-if="$vuetify.breakpoint.smAndDown"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'

.prompt
  background-color: $color-dark
  border-radius: .5em
  color: $color-panel-font-light
  padding: .25em .5em
  text-align: center

</style>
