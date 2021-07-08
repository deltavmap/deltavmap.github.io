<template>
  <g>
    <line :x1="x1Mod"
          :y1="y1Mod"
          :x2="x2Mod"
          :y2="y2Mod"
          class="edge__line fadable"
    ></line>
    <foreignObject :x="midPointX - 25"
                   :y="midPointY - 12"
                   width="50" height="26"
    >
      <div class="underlay-html-container">
        <p class="edge__label fadable" xmlns="http://www.w3.org/1999/xhtml">
          {{ deltaData.dv }}
        </p>
      </div>
    </foreignObject>
  </g>
</template>
<script>
export default {
  props: [
    'deltaData',
    'source',
    'target',
    'x1',
    'x2',
    'y1',
    'y2'
  ],
  computed: {
    nodeRadius: function () {
      return this.$parent.nodeRadius
    },
    midPointX: function () { return this.getXMidPointOfDelta() },
    midPointY: function () { return this.getYMidPointOfDelta() },
    scale: function () {
      const halfStrokeWidth = 2
      const hyp = Math.sqrt(Math.pow(this.xdiff, 2) + Math.pow(this.ydiff, 2))
      return (this.nodeRadius + halfStrokeWidth) / hyp
    },
    x1Mod: function () {
      return this.x1 + (this.scale * this.xdiff)
    },
    y1Mod: function () { return this.y1 + (this.scale * this.ydiff) },
    x2Mod: function () { return this.x2 - (this.scale * this.xdiff) },
    y2Mod: function () { return this.y2 - (this.scale * this.ydiff) },
    xdiff: function () { return this.x2 - this.x1 },
    ydiff: function () { return this.y2 - this.y1 },
    angleFromHorizontal: function () {
      return Math.atan(this.ydiff / this.xdiff)
    }
  },
  methods: {
    xMod: function (x, add = true) {
      const adjacent = Math.cos(this.angleFromHorizontal) * this.nodeRadius

      if (this.xdiff >= 0) {
        return x + adjacent
      } else {
        return x - adjacent
      }
    },
    yMod: function (y, add = true) {
      const opposite = Math.sin(this.angleFromHorizontal) * this.nodeRadius
      if (add) {
        return y + opposite
      } else {
        return y - opposite
      }
    },
    getXMidPointOfDelta: function () {
      const sourceX = this.x1
      const targetX = this.x2
      let xLow, xHigh
      if (sourceX < targetX) {
        xLow = sourceX
        xHigh = targetX
      } else {
        xLow = targetX
        xHigh = sourceX
      }
      return xLow + ((xHigh - xLow) / 2)
    },
    getYMidPointOfDelta: function () {
      const sourceY = this.y1
      const targetY = this.y2
      let yLow, yHigh
      if (sourceY < targetY) {
        yLow = sourceY
        yHigh = targetY
      } else {
        yLow = targetY
        yHigh = sourceY
      }
      return yLow + ((yHigh - yLow) / 2)
    }
  }
}
</script>
<style lang="sass">
@import '../../sass/variables'
.map
  .edge
    &__line
      stroke: whitesmoke
      stroke-width: 4
    &__label
      background-color: $color-map-light
      border-radius: 4px
      color: $color-map-dark
      font-size: 12px
      margin-bottom: 0
      padding: .25em
      text-align: center

.path-selected
  .edge-on-path
    .edge
      &__line
        stroke: $color-map-dark
        opacity: 1
      &__label
        color: $color-map-light
        background-color: $color-map-dark
        opacity: 1
</style>
