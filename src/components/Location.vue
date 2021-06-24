<template>
  <g :class="[(locationIsSurface) ? 'location-is-surface' : '']"
  >
    <circle class="location__icon-atmosphere fadable"
            :cx="xPos"
            :cy="yPos"
            r="400"
            v-if="location.id === 'Sun'"
            fill="url('#gradient-sun-corona')"
    />

    <circle class="location__icon-atmosphere fadable"
      :cx="xPos"
      :cy="yPos"
      r="60"
      v-if="hasAtmosphere"
      fill="url('#gradient-atmosphere')"
    />
    <circle class="location__icon fadable"
            :cx="xPos"
            :cy="yPos"
            :fill="fillColor"
            :r="formattedRadius"
            v-if="!locationIsSurface || location.id === 'Sun'"
    />
    <circle class="location__icon-surface-shadow fadable"
            v-if="locationIsSurface && location.id === 'Sun'"
            :cx="xPos"
            :cy="yPos"
            :r="formattedShadowRadius"
            stroke-width="0"
            :fill="shadowFill"
    />
    <foreignObject :x="xPos - 45"
                   :y="yPos - 45"
                   height="88"
                   width="88"
                   v-if="locationIsSurface && location.id !== 'Sun'"
                   class="body__container"
    >
      <body xmlns="http://www.w3.org/1999/xhtml">
        <div class="body fadable">
          <div class="body__surface" :style="'background-color: ' + fillColor"></div>
          <div class="body__surface-shadow" :style="surfaceShadowPositionStyle"></div>
          <div class="body__surface-haze" style=""></div>
        </div>
      </body>
    </foreignObject>
    <foreignObject :x="xPos - 75"
                   :y="(yPos + 65)"
                   width="150"
                   height="100"
    >
      <body xmlns="http://www.w3.org/1999/xhtml"
            style="padding: 5px;"
      >
      <div class="underlay-html-container">
        <p class="location__label fadable">
          {{ label }}
        </p>
        <div class="click-target" @click="clickHandler"></div>
      </div>
      </body>
    </foreignObject>

    <circle :cx="xPos - 1"
          :cy="yPos - 1"
            r="44"
          class="click-target"
          @click="clickHandler"
    ></circle>
  </g>
</template>
<script>
export default {
  props: [
    'location',
    'locationType',
    'label',
    'radius',
    'fillColor',
    'xPos',
    'yPos',
    'hasAtmosphere',
    'sunX',
    'sunY'
  ],
  computed: {
    formattedRadius: function () { return this.radius + 'px' },
    formattedShadowRadius: function () { return (this.radius - 2) + 'px' },
    shadowFill: function () {
      let gradId = '#gradient-'
      if (this.location.id === 'Sun') {
        gradId += 'sun'
      } else {
        const dir = (this.xPos > this.sunX) ? 'right' : 'left'
        gradId += 'shadow-' + dir
      }
      return "url('" + gradId + "')"
    },
    locationIsSurface: function () {
      return this.locationType === 'body'
    },
    labelTransformValue: function () {
      return 'translate(' + (this.xPos - 75) + ',' + (this.yPos + 65) + ')'
    },
    surfaceShadowPositionStyle: function () {
      // const x = this.xPos
      // const y = this.yPos
      // const xRel = this.xPos - this.sunX
      // const yRel = this.yPos - this.sunY
      const right = -1.5 * this.radius * 2
      const top = -1.5 * this.radius * 2
      return 'top: ' + top + 'px; right: ' + right + 'px;'
    }
  },
  methods: {
    clickHandler: function () {
      this.$emit('node-selected', this.location)
    }
  }
}
</script>
<style lang="sass">
@import '@/sass/variables'
$border-radius: 4px

*
  transform: none
  transition: none
.click-target
  opacity: 0
  &:hover
    cursor: pointer

.underlay-html-container
  position: relative
  &:before
    background-color: $color-map-background
    border-radius: $border-radius
    bottom: 0
    content: ' '
    left: 0
    position: absolute
    right: 0
    top: 0
    z-index: -1
  & > *
    z-index: 1

  .click-target
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0

.underlay
  fill: $color-map-background
  z-index: 0

.location
  $radius: 40
  stroke: $color-map-light

  &__label
    background-color: darken($color-map-background, 7%)
    border-radius: $border-radius
    color: $color-map-light
    padding: .5em 1em
    text-align: center

  &__icon-atmosphere
    stroke-width: 0
    z-index: -1

  &__icon-background
    stroke: $color-map-background
    stroke-width: 4
    fill: $color-map-background
    z-index: 1

  &__icon
    stroke: whitesmoke
    stroke-width: 4
    z-index: 2

  &__icon-earth-indicator
    stroke-width: 0

  &__icon-surface-shadow
    stroke-width: 0
    pointer-events: none
    z-index: 2

  &.origin-node
    opacity: 1
    .body
      border-color: $color-origin
    .location__icon
      stroke: $color-origin
    .location__label
      color: $color-map-dark
      background-color: $color-origin

  &.destination-node
    opacity: 1
    .body
      border-color: $color-destination
    .location__icon
      stroke: $color-destination
    .location__label
      color: $color-map-dark
      background-color: $color-destination

.location-is-surface
  .location__label
    letter-spacing: .2em
    text-transform: uppercase

.path-selected
  .node-on-path
    .location__icon
      opacity: 1
    .location__icon-surface-shadow
      opacity: 1
    .location__label
      opacity: 1
    .location__icon-atmosphere
      opacity: 1
    .body
      opacity: 1
  .node-on-path:not(.origin-node, .destination-node)
    .location__icon
      stroke: $color-map-dark
    .location__label
      background-color: $color-map-dark
      color: $color-map-light

.body
  $size: 80px
  $border-size: $size * 0.05
  border: $border-size solid #eee
  border-radius: $size
  height: 100%
  overflow: hidden
  position: relative
  width: 100%

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
    filter: brightness(1.2)

    &-shadow
      $ssize: 3 * $size
      border-radius: $ssize
      background-image: radial-gradient(rgba(255, 255, 255, 0.5) 0%, rgba(0, 0, 0, 1) 48%) !important
      content: ''
      display: block
      height: $ssize
      position: absolute
      // right: - 1.5 * $size
      // top: - 1.5 * $size
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
