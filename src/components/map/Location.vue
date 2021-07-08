<template>
  <g :id="location.id"
     class="location"
     :class="[
       (locationIsSurface) ? 'location-is-surface' : '',
       (isOriginNode) ? 'origin-node': '',
       (isDestinationNode) ? 'destination-node': '',
       (nodeOnPath) ? 'node-on-path': ''
     ]"
  >
    <star :xPos="xPos" :yPos="yPos"
          v-if="location.id === starId"
          :radius="radius"
          :fillColor="fillColor"
    ></star>
    <low-orbit :xPos="xPos" :yPos="yPos"
               :fillColor="fillColor" :radius="radius"
               v-if="isOrbit"
    ></low-orbit>
    <l1 :xPos="xPos" :yPos="yPos" :radius="radius"
               v-if="location.nodeType === 'orbit-l1'"
    ></l1>
    <l2 :xPos="xPos" :yPos="yPos" :radius="radius"
        v-if="location.nodeType === 'orbit-l2'"
    ></l2>
    <n-r-h-o :xPos="xPos" :yPos="yPos" :radius="radius"
        v-if="location.nodeType === 'orbit-nrho'"
    ></n-r-h-o>
    <capture-escape :xPos="xPos" :yPos="yPos"
                    :fillColor="fillColor" :radius="radius"
                    v-if="location.nodeType === 'orbit-capture-escape'"
    ></capture-escape>
    <transfer-orbit :xPos="xPos" :yPos="yPos"
                    :fillColor="fillColor" :radius="radius"
                    v-if="location.nodeType === 'orbit-transfer'"
    ></transfer-orbit>
    <stationary-orbit :xPos="xPos" :yPos="yPos"
                    :fillColor="fillColor" :radius="radius"
                    v-if="location.nodeType === 'orbit-stationary'"
    ></stationary-orbit>
    <celestial-body :diameter="formattedSize"
                    :fillColor="fillColor"
                    :radius="radius"
                    :starX="starX"
                    :starY="starY"
                    :xPos="xPos"
                    :yPos="yPos"
                    :atmosphere="location.atmosphere"
                    v-if="locationIsSurface && location.id !== starId"
    >
    </celestial-body>
    <circle :cx="xPos"
            :cy="yPos"
            :r="formattedRadius"
            class="click-target"
            @click="clickHandler"
    ></circle>
    <location-label :click-handler="clickHandler"
                    :xPos="xPos"
                    :yPos="yPos"
    >{{ location.label }}</location-label>
  </g>
</template>
<script>
import CaptureEscape from './locations/CaptureEscape'
import CelestialBody from './locations/Body'
import LocationLabel from './locations/LocationLabel'
import LowOrbit from './locations/LowOrbit'
import L1 from './locations/L1'
import L2 from './locations/L2'
import NRHO from './locations/NRHO'
import TransferOrbit from './locations/TransferOrbit'
import Star from './locations/Star'
import StationaryOrbit from './locations/StationaryOrbit'

export default {
  components: {
    CaptureEscape,
    CelestialBody,
    LocationLabel,
    LowOrbit,
    L1,
    L2,
    NRHO,
    TransferOrbit,
    Star,
    StationaryOrbit
  },
  props: [
    'location',
    'isDestinationNode',
    'isOriginNode',
    'nodeOnPath',
    'radius',
    'starId',
    'starX',
    'starY',
    'xPos',
    'yPos'
  ],
  computed: {
    formattedRadius: function () { return this.radius + 'px' },
    formattedSize: function () { return (this.radius * 2) + 4 + 'px' },
    locationIsSurface: function () {
      return this.location.nodeType === 'body'
    },
    isOrbit: function () {
      const type = this.location.nodeType
      return type === 'orbit'
    },
    labelTransformValue: function () {
      return 'translate(' + (this.xPos - 75) + ',' + (this.yPos + 65) + ')'
    },
    fillColor: function () {
      switch (this.location.nodeType) {
        case 'body':
          return this.location.color
        default:
          return 'rgba(0,0,0,0)' // TODO add to sass
      }
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
@import '../../sass/variables'

*
  transition: none

.click-target
  opacity: 0 !important
  &:hover
    cursor: pointer

.location
  $radius: 40
  stroke: $color-map-light

  &__icon
    stroke: $color-white
    stroke-width: 4
    z-index: 2

  &.origin-node
    opacity: 1
    fill: $color-origin
    stroke: $color-origin
    .body
      border-color: $color-origin
    .location__icon
      stroke: $color-origin
    .icon-border
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
    .icon-border
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
    *
      opacity: 1 !important
    .click-target
      opacity: 0 !important

  .node-on-path:not(.origin-node, .destination-node)
    .location__icon
      stroke: $color-map-dark
    .icon-border
      stroke: $color-map-dark
    .location__label
      background-color: $color-map-dark
      color: $color-map-light

</style>
