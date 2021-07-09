<template>
  <g class="location__icon location__icon-capture-escape fadable">
    <icon-border :xPos="xPos" :yPos="yPos" :radius="radius"
    ></icon-border>
    <g v-if="$parent.userSettings.showIcons.value">
      <circle :cx="xPos"
              :cy="yPos"
              :r="smallRadius"
              fill="none"
              class=""
      ></circle>
      <path :d="arc"
            fill="none"
      ></path>
    </g>
  </g>
</template>
<script>
import IconBorder from './IconBorder'
export default {
  components: {
    IconBorder
  },
  props: [
    'fillColor',
    'radius',
    'xPos',
    'yPos'
  ],
  computed: {
    smallRadius: function () {
      return this.radius / 4
    },
    circle1x: function () { return this.xPos - 22 },
    circle1y: function () { return this.yPos + 18 },
    circle2x: function () { return this.xPos + 18 },
    circle2y: function () { return this.yPos - 22 },
    arc: function () {
      const x1 = this.xPos + 8
      const y1 = this.yPos - 6
      const x2 = this.circle1x - 8
      const y2 = this.circle1y + 8.5
      const c1x = x1 + 13
      const c1y = y1 + 18
      const c2x = x2 + 18
      const c2y = y2 + 13
      const startingPoint = 'M' + x1 + ',' + y1
      const controlPoint1 = 'C' + c1x + ',' + c1y
      const controlPoint2 = '' + c2x + ',' + c2y
      const endPoint = '' + x2 + ',' + y2
      return startingPoint + ' ' + controlPoint1 + ' ' + controlPoint2 + ' ' + endPoint
    }
  }

}
</script>
