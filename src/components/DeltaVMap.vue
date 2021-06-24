<template>
  <div class="map-container fade-in">
    <svg id="map"
         class="map"
         :class="{'path-selected' : path.isSelected}"
         :width="mapWidth"
         height="9000px"
    >
      <defs>
        <linearGradient id="gradient-shadow-left" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stop-color="rgba(255,255,255,0.5)" />
          <stop offset="75%" stop-color="rgba(0,0,0,1)" />
        </linearGradient>
        <linearGradient id="gradient-shadow-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stop-color="rgba(255,255,255,0.5)" />
          <stop offset="75%" stop-color="rgba(0,0,0,1)" />
        </linearGradient>
        <radialGradient id="gradient-atmosphere" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:rgb(255,255,255); stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:0" />
        </radialGradient>
        <radialGradient id="gradient-sun" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:white; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#bba; stop-opacity:1" />
        </radialGradient>
        <radialGradient id="gradient-sun-corona" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:white; stop-opacity:1" />
          <stop offset="5%" style="stop-color:white; stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:white; stop-opacity:0" />
        </radialGradient>
      </defs>
      <g v-for="(edge, edgeIndex) in system.finalDeltasArray"
         :key="'delta-' + edgeIndex"
         :id="edge.sourceId + '-' + edge.targetId"
         :class="[
             'edge',
             'edge--' + edge.sourceId + '-' + edge.targetId,
             'edge--' + edge.targetId + '-' + edge.sourceId,
             path.edgesGraph[edge.sourceId][edge.targetId] ? 'edge-on-path' : ''
           ]"
      >
        <delta :deltaData="edge"
               :source="getLocationById(edge.sourceId)"
               :target="getLocationById(edge.targetId)"
        >
        </delta>
      </g>
      <g v-for="(location, locationIndex) in system.finalLocationsArray"
         :key="locationIndex"
         class="location"
         :id="location.id"
         :class="{
             'origin-node': location.id === path.origin.id,
             'destination-node': location.id === path.destination.id,
             'node-on-path': isNodeOnPath(location.id)
           }"
      >
        <location :location="location"
                  :label="location.label"
                  :location-type="location.nodeType"
                  :radius="nodeRadius"
                  :fill-color="getNodeFill(location)"
                  :x-pos="location.position.x"
                  :y-pos="location.position.y"
                  :has-atmosphere="location.atmosphere"
                  :sunX="system.locationsObject.Sun.position.x"
                  :sunY="system.locationsObject.Sun.position.y"
                  v-on:node-selected="$emit('node-selected', location)"
        ></location>
      </g>
    </svg>
  </div>
</template>
<script>
import Utils from './utils'
import Delta from './Delta'
import Location from './Location'

export default {
  components: {
    Delta,
    Location
  },
  props: [
    'map',
    'system',
    'path'
  ],
  data () {
    return {
      pageLoaded: false,
      nodeRadius: 40
    }
  },
  mounted () {
    setTimeout(() => {
      this.pageLoaded = true
    }, 2000)
  },
  computed: {
    mapWidth: function () {
      return (this.map.maxX + 2 * this.map.colDelta) + 'px'
    }
  },
  methods: {
    getLocationById: function (nodeId) {
      return this.system.finalLocationsObject[nodeId]
    },
    getNodeFill: function (node) {
      switch (node.nodeType) {
        case 'body':
          return node.color
        default:
          return 'rgba(0,0,0,0)' // TODO add to sass
      }
    },
    isNodeOnPath: function (nodeId) {
      return (Utils.isDefined(this.path.nodes[nodeId]) && this.path.nodes[nodeId])
    }
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '../sass/variables'
@import '../sass/utils/shadow-box.sass'

.map-container
  background: $color-map-background
  background-image: linear-gradient(175deg, $color-map-background, darken($color-map-background-darker, 5%))
  cursor: crosshair
  grid-row-start: 1
  grid-row-end: 3
  grid-column-start: 2
  grid-column-end: 2
  opacity: 0
  overflow: hidden
  position: relative
  z-index: 1

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    grid-column-start: 1
    grid-column-end: 1
    grid-row-start: 2
    grid-row-end: 2
  &:hover
    cursor: hand
  &--visible
    opacity: 1

  &__prompt
    @extend .u-shadow
    background-color: $color-dark
    border-radius: .5rem
    border-left-width: 5px
    border-left-style: solid
    color: $color-light
    left: 2rem
    padding: .5rem 1rem
    position: absolute
    top: 2rem
    z-index: 3

    &--origin
      border-left-color: $color-origin

    &--destination
      border-left-color: $color-destination

    @media #{map-get($display-breakpoints, 'sm-and-down')}
    @media #{map-get($display-breakpoints, 'md-and-up')}
      display: none

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    grid-row-start: 2

  @media #{map-get($display-breakpoints, 'md-and-up')}
    grid-row-end: span 2

.map
  min-height: 100%
  width: 100%
  overflow: visible
  text-align: initial

.path-selected
  .fadable
    opacity: $opacity
</style>
