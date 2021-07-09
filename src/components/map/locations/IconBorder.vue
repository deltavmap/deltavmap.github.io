<template>
  <circle class="icon-border"
          :cx="xPos" :cy="yPos"
          fill="none"
          :r="radius"
  >
  </circle>
</template>
<script>
export default {
  props: [
    'fillColor',
    'radius',
    'xPos',
    'yPos'
  ]
}
</script>
<style lang="sass">
@import '../../../sass/variables'

.icon-border
  stroke-width: 4
  z-index: 2

</style>
