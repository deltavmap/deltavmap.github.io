<template>
  <g class="location__icon location__icon--orbit-stationary fadable">
    <icon-border :xPos="xPos" :yPos="yPos" :radius="radius"
    ></icon-border>
    <circle :cx="circle1x"
            :cy="circle1y"
            :r="smallRadius"
            fill="none"
    ></circle>
    <circle :cx="circle2x"
            :cy="circle2y"
            :r="verySmallRadius"
            fill="none"
    ></circle>
    <line :x1="lineX1"
          :y1="lineY1"
          :x2="lineX2"
          :y2="lineY2"
          fill="none"
          class=""
    ></line>
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
    smallRadius: function () {
      return this.radius / 4
    },
    verySmallRadius: function () {
      return this.radius / 6
    },
    lineOffset: function () {
      return this.radius / 5
    },
    circle1x: function () { return this.xPos },
    circle1y: function () { return this.yPos },
    circle2x: function () { return this.xPos },
    circle2y: function () { return this.yPos - this.radius / 1.3 },
    lineX1: function () { return this.circle1x },
    lineY1: function () { return this.circle1y - this.smallRadius },
    lineX2: function () { return this.circle2x },
    lineY2: function () { return this.circle2y + this.verySmallRadius }
  }
}
</script>
