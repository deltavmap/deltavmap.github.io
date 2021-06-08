<template>
  <g>
    <line :x1="x1"
          :y1="y1"
          :x2="x2"
          :y2="y2"
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
    // 'x1', 'x2', 'y1', 'y2',
    // 'midPointX', 'midPointY',
    'deltaData',
    'source', 'target'
  ],
  computed: {
    midPointX: function () { return this.getXMidPointOfDelta() },
    midPointY: function () { return this.getYMidPointOfDelta() },
    x1: function () { return this.source.position.x },
    y1: function () { return this.source.position.y },
    x2: function () { return this.target.position.x },
    y2: function () { return this.target.position.y }
  },
  methods: {
    getXPosOfOrbit: function (nodeId) {
      return this.getPosOfOrbit(nodeId).x
    },
    getXMidPointOfDelta: function () {
      const sourceX = this.source.position.x
      const targetX = this.target.position.x
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
      const sourceY = this.source.position.y
      const targetY = this.target.position.y
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
@import '@/sass/variables'
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
