<template>
  <g>
    <circle class="location__icon-atmosphere fadable"
            :cx="xPos" :cy="yPos"
            r="60"
            v-if="atmosphere && $parent.userSettings.showAtmosphere.value"
            fill="url('#gradient-atmosphere')"
    />
    <foreignObject :x="foreignObjectX"
                   :y="foreignObjectY"
                   :height="diameter"
                   :width="diameter"
                   class="body__container"
    >
      <body xmlns="http://www.w3.org/1999/xhtml">
      <div class="body fadable">
        <div class="body__surface" :style="'background-color: ' + fillColor"></div>
        <div class="body__surface-shadow"
             :style="surfaceShadowPositionStyle"
             v-if="$parent.userSettings.showBodyShadows.value"
        ></div>
        <div class="body__surface-haze" style=""></div>
      </div>
      </body>
    </foreignObject>
  </g>
</template>
<script>
export default {
  props: [
    'atmosphere',
    'diameter',
    'fillColor',
    'radius',
    'starX',
    'starY',
    'xPos',
    'yPos'
  ],
  computed: {
    foreignObjectX: function () { return this.xPos - this.radius - 2 },
    foreignObjectY: function () { return this.yPos - this.radius - 2 },
    surfaceShadowPositionStyle: function () {
      const xRel = this.foreignObjectX - this.starX
      const yRel = this.foreignObjectY - this.starY
      const hype = Math.sqrt(Math.pow(xRel, 2) + Math.pow(yRel, 2))
      const xScale = xRel / hype
      const yScale = yRel / hype
      let right = this.radius * xScale
      let top = this.radius * yScale
      top -= this.radius * 2
      right -= this.radius * 2
      const style = 'bottom: ' + top + 'px; right: ' + right + 'px;'
      return style
    }
  }
}
</script>
<style lang="sass">
@import '../../../sass/variables'

.location
  stroke-width: 0
  z-index: -1

.body
  $size: 80px
  $border-size: $size * 0.05
  border: $border-size solid #eee
  border-radius: $size
  height: 100%
  overflow: hidden
  position: relative
  width: 100%
  transition: border-color $transition-standard

  &__container
    body
      height: 100%
      width: 100%

  &__atmosphere
    $asize: 1.45 * $size
    align-items: center
    background-image: radial-gradient(rgba(256, 256, 256, 0.4) 35%, rgba(256, 256, 256, 0) 70%)
    border-radius: $size * 1.4
    display: flex
    height: $asize
    justify-content: center
    padding: 1rem
    width: $asize

  &__surface
    height: 100%
    width: 100%
    position: relative
    filter: brightness(1.05)

    &-shadow
      $ssize: 3 * $size
      border-radius: $ssize
      background-image: radial-gradient(rgba(255, 255, 255, 0.5) 0%, rgba(0, 0, 0, 1) 39%) !important
      content: ''
      display: block
      height: $ssize
      position: absolute
      width: $ssize
      z-index: 1

    &-haze
      background-color: rgba(255,255,255,0.1) !important
      content: ''
      height: $size
      position: absolute
      right: 0
      top: 0
      width: $size
      z-index: 2

</style>
