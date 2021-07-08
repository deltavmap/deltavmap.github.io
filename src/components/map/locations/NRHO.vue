<template>
  <g class="location__icon location__icon--orbit-transfer fadable">
    <icon-border :xPos="xPos" :yPos="yPos" :radius="radius"
    ></icon-border>
    <rect :x="x"
          :y="y"
          :width="size"
          :height="size"
          fill="none"
    ></rect>
  </g>
</template>
<script>
import IconBorder from './IconBorder'

export default {
  components: {
    IconBorder
  },
  props: [
    'radius',
    'xPos',
    'yPos'
  ],
  computed: {
    size: function () { return this.radius * 1.35 },
    x: function () { return this.xPos - this.size / 2 },
    y: function () { return this.yPos - this.size / 2 }
  }
}
</script>
<style lang="sass">

</style>
