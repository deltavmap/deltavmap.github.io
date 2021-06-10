<template>
  <g :class="{'location-is-surface': locationIsSurface}">
    <circle class="orbit__icon-atmosphere fadable"
            :cx="xPos"
            :cy="yPos"
            r="300"
            v-if="orbit.data.id === 'Sun'"
            fill="url('#gradient-sun-corona')"
    />

    <circle class="orbit__icon-atmosphere fadable"
      :cx="xPos"
      :cy="yPos"
      r="60"
      v-if="hasAtmosphere"
      fill="url('#gradient-atmosphere')"
    />
    <circle class="orbit__icon-background underlay"
            :cx="xPos"
            :cy="yPos"
            :r="formattedRadius"
    />
    <circle class="orbit__icon fadable"
            :cx="xPos"
            :cy="yPos"
            :fill="fillColor"
            :r="formattedRadius"
    />
    <circle class="orbit__icon-surface-shadow fadable"
            v-if="locationIsSurface"
            :cx="xPos"
            :cy="yPos"
            :r="formattedShadowRadius"
            stroke-width="0"
            :fill="shadowFill"
    />
    <foreignObject :x="xPos - 75"
                   :y="(yPos + 65)"
                   width="150"
                   height="64">
      <body xmlns="http://www.w3.org/1999/xhtml">
      <div class="underlay-html-container">
        <p class="orbit__label fadable" xmlns="http://www.w3.org/1999/xhtml">
          {{ label }}
        </p>
      </div>
      </body>
    </foreignObject>
  </g>
</template>
<script>
export default {
  props: [
    'orbit',
    'orbitType',
    'label',
    'radius',
    'fillColor',
    'xPos',
    'yPos',
    'hasAtmosphere'
  ],
  computed: {
    formattedRadius: function () { return this.radius + 'px' },
    formattedShadowRadius: function () { return (this.radius - 2) + 'px' },
    shadowFill: function () {
      let gradId = '#gradient-'
      if (this.orbit.data.id === 'Sun') {
        gradId += 'sun'
      } else {
        const dir = (this.xPos > 0) ? 'right' : 'left'
        gradId += 'shadow-' + dir
      }
      return "url('" + gradId + "')"
    },
    locationIsSurface: function () {
      return this.orbitType === 'surface'
    },
    labelTransformValue: function () {
      return 'translate(' + (this.xPos - 75) + ',' + (this.yPos + 65) + ')'
      // return 'translate(100, 300)'
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

.underlay
  fill: $color-map-background
  z-index: 0

.orbit
  $radius: 40
  stroke: $color-map-light
  &:hover
    cursor: pointer
  &__label
    background-color: darken($color-map-background, 5%)
    border-radius: $border-radius
    color: $color-map-light
    // filter: grayscale(20%)
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
    .orbit__icon
      stroke: $color-origin
    .orbit__label
      color: $color-map-dark
      background-color: $color-origin

  &.destination-node
    opacity: 1
    .orbit__icon
      stroke: $color-destination
    .orbit__label
      color: $color-map-dark
      background-color: $color-destination

.location-is-surface
  .orbit__label
    letter-spacing: .2em
    text-transform: uppercase

.path-selected
  .node-on-path
    .orbit__icon
      opacity: 1
    .orbit__icon-surface-shadow
      opacity: 1
    .orbit__label
      opacity: 1
    .orbit__icon-atmosphere
      opacity: 1
  .node-on-path:not(.origin-node, .destination-node)
    .orbit__icon
      stroke: $color-map-dark
    .orbit__label
      background-color: $color-map-dark
      color: $color-map-light

</style>
