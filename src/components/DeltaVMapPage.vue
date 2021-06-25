<template>
  <div id="page-container" :class="{'page-loaded': pageLoaded}">
    <site-title>Delta V Map</site-title>
    <controls :path="path"
              v-on:controls-origin-click="handleOriginClick()"
              v-on:controls-destination-click="handleDestinationClick()"
              v-on:controls-reverse-selected-nodes="reverseSelectedNodes()"
              v-on:controls-clear-path="clearPath()"
              v-on:refresh-button-click="hardRefresh()"
    ></controls>
    <banner class="fade-in"
            :display-banner="displayBanner()"
            v-on:close-banner="handleBannerClose()"
    >
      <div class="px-4 mb-4 py-4 rounded u-bg-color-main">
        <div class="d-flex justify-start align-center">
          <div class="mr-1 banner__icon banner__icon--warn"><div>⚠</div></div>
          <span class="text-center">
            This is app is still in active development.
          </span>
          <div class="ml-1 banner__icon banner__icon--warn"><div>⚠</div></div>
        </div>
      </div>
      <div v-if="$parent.$parent.updateExists"
           class="mb-4 pa-4 rounded u-bg-color-warn"
           style="letter-spacing: .05em"
      >
        <div class="d-flex justify-center align-center">

          <div class="text-left d-flex flex-column justify-center text-center">
            <p>UPDATE AVAILABLE, PLEASE:</p>
            <button type="button"
                    @click="hardRefresh()"
                    class="d-flex align-center justify-space-between px-3"
            >
              <span class="mr-4 banner__icon banner__icon--refresh"><div>↺</div></span>
              HARD REFRESH
              <span class="ml-4 banner__icon banner__icon--refresh"><div>↺</div></span>
            </button>
            <div class="mt-4" style="font-size: .8em">
              <a href="https://www.documate.org/automation/what-is-a-hard-refresh-how-to-do-a-hard-refresh-in-any-browser/"
              >learn more</a>
            </div>
          </div>
        </div>
      </div>
      <p>
        Please view the ABOUT page for more information.
      </p>
    </banner>
    <delta-v-map :system="system"
                 :map="map"
                 :path="path"
                 v-on:node-selected="nodeSelected($event)"
    ></delta-v-map>
    <div id="bottom-scroll-marker"></div>
  </div>
</template>
<script>
import panzoom from 'panzoom'
import dijkstrajs from 'dijkstrajs'

import Utils from './utils'
import Locations from './nodes'
import Positions from './positions'
import UnformattedDeltaArrays from './edges'
import CreateOuterPlanets from './create-outer-planets'
import Controls from './Controls'
import DeltaVMap from './DeltaVMap'
import SiteTitle from './SiteTitle'
import Banner from './Banner'

export default {
  components: {
    Banner,
    Controls,
    DeltaVMap,
    SiteTitle
  },
  data () {
    return {
      pageLoaded: false,
      bannerTitle: 'banner-intro-hide',
      mapSVG: null,
      panzoom: null,
      // system data
      system: {
        fixedNodeConstraints: [],
        locationsObject: {},
        deltaObjectsArray: [],
        finalLocationsArray: [],
        finalDeltasArray: [],
        finalEdgeGraph: {}
      },
      // map position
      map: {
        globalXOffset: 3000,
        maxX: 0,
        minX: 0,
        colDelta: 250,
        planetY: 0,
        planetYDelta: 350
      },
      // selected path
      path: {
        isSelected: false,
        aerobrakingAvailable: false,
        origin: false,
        destination: false,
        deltaV: null,
        edgesGraph: {},
        edgesList: [],
        nodes: {}
      }
    }
  },
  computed: {
    pathDestinationText: function () {
      return (this.path.destination) ? this.path.destination.label : ''
    },
    pathOriginId: function () {
      return (typeof this.path.origin === 'object') ? this.path.origin.id : ''
    },
    pathDestinationId: function () {
      return (typeof this.path.destination === 'object') ? this.path.destination.id : ''
    }
  },
  methods: {
    displayBanner: function () {
      return (this.$parent.$parent.updateExists || localStorage.getItem(this.bannerTitle) !== 'true')
    },
    col: function (n, localXOffset = 0) {
      const x = n * this.map.colDelta + this.map.globalXOffset + localXOffset
      if (x > this.map.maxX) {
        this.map.maxX = x
      }

      if (x < this.map.minX) {
        this.map.minX = x
      }

      return x
    },
    handleOriginClick: function () {
      if (this.path.origin) { // TODO necessary?
        this.clearSelectedOrigin()
      }
    },
    handleDestinationClick: function () {
      if (this.path.destination) { // TODO necessary?
        this.clearSelectedDestination()
      }
    },
    hasAtmosphere: function (nodeData) {
      if (Utils.isDefined(nodeData) && Utils.isDefined(nodeData.atmosphere)) {
        return nodeData.atmosphere
      } else {
        return false
      }
    },
    ancestorHasAtmosphere: function (nodeData) {
      if (Utils.isUndefined(this.system.finalLocationsObject[nodeData.parent])) {
        return false
      } else {
        const ancestor = this.system.finalLocationsObject[nodeData.parent]
        return this.hasAtmosphere(ancestor)
      }
    },
    setPlanetY: function (amount) {
      this.map.planetY = amount
      return this.map.planetY
    },
    incPlanetYDelta: function (amount = this.map.planetYDelta) {
      return this.setPlanetY(this.map.planetY + amount)
    },
    applyPositionDataToLocations: function (locations) {
      Positions(this, locations)
    },
    createLocationObject: function (id, label, nodeType, parent, color = null, altitude = null, atmosphere = false) {
      if (altitude) {
        label = label + ' (' + altitude + 'km)'
      }
      return {
        id, label, nodeType, parent, color, altitude, atmosphere
      }
    },
    createBody: function (id, parent, color = null, atmosphere = false) {
      return this.createLocationObject(id, id, 'body', parent, color, null, atmosphere)
    },
    createTransferOrbit: function (bodyName, parent) {
      return this.createLocationObject(
        bodyName + 'T',
        bodyName + ' Transfer',
        'orbit-transfer', parent
      )
    },
    createCaptureEscapeOrbit: function (planetName) {
      return this.createLocationObject(
        planetName + 'CE',
        planetName + ' Capture/Escape',
        'orbit-capture-escape',
        planetName
      )
    },
    createLowOrbit: function (bodyName, altitude) {
      return this.createLocationObject(
        'L' + bodyName + 'O',
        'Low ' + bodyName + ' Orbit',
        'orbit',
        bodyName,
        null,
        altitude
      )
    },
    createPlanetSystem: function (
      planetName, alignLeft, hasAtmosphere,
      predecessorTransferOrbitId, predecessorHasAtmosphere,
      outerPlanetTransferDV, outerPlanetCaptureDV,
      color, moonsArray,
      lowOrbitDV, lowOrbitAltitude,
      bodyDV,
      layoutStartX,
      layoutStartY,
      yOffsetInt
    ) {
      const addPositionData = (node, x, y) => {
        node.position = { x, y }
      }
      const col = n => this.col(n, layoutStartX)
      let currentCol = 0
      const dir = (alignLeft) ? -1 : 1
      const updateCurrentCol = (i = 1) => {
        currentCol += (dir * i)
        return currentCol
      }

      // create outer planet
      const planetBody = this.createBody(
        planetName,
        'Sun',
        color,
        hasAtmosphere
      )
      this.addLocation(planetBody)

      // create the outer planet transfer orbit and delta
      const outerPlanetTransfer = this.createTransferOrbit(
        planetName,
        'Sun'
      )
      const transferName = outerPlanetTransfer.id
      addPositionData(outerPlanetTransfer, col(0), layoutStartY)
      this.addLocation(outerPlanetTransfer)

      let predecessorTransferAB
      if (predecessorHasAtmosphere) {
        if (hasAtmosphere) {
          predecessorTransferAB = 2
        } else {
          predecessorTransferAB = 1
        }
      } else {
        if (hasAtmosphere) {
          predecessorTransferAB = 3
        } else {
          predecessorTransferAB = 0
        }
      }
      const planetAB = (hasAtmosphere) ? 1 : 0
      const outerPlanetTransferDeltaObject = this.createDeltaObject(
        transferName, predecessorTransferOrbitId, outerPlanetTransferDV, predecessorTransferAB
      )

      // create outer planet capture orbit and delta
      const outerPlanetCaptureEscape = this.createCaptureEscapeOrbit(planetName)
      const captureName = outerPlanetCaptureEscape.id
      updateCurrentCol()
      addPositionData(outerPlanetCaptureEscape, col(currentCol), layoutStartY)
      this.addLocation(outerPlanetCaptureEscape)

      const outerPlanetCaptureDeltaObject = this.createDeltaObject(
        transferName, captureName, outerPlanetCaptureDV, planetAB
      )
      updateCurrentCol()
      const moonTransferY = layoutStartY
      // const modifier = -dir
      const modifier = 1
      const moonCaptureY = moonTransferY + (modifier * this.map.planetYDelta)
      const moonLowOrbitY = moonCaptureY + (modifier * this.map.planetYDelta)
      const moonBodyY = moonLowOrbitY + (modifier * this.map.planetYDelta)
      let prevSource = outerPlanetCaptureEscape

      moonsArray.map(m => {
        const moonName = m[1]
        const ab = (Utils.isDefined(m[6])) ? m[6] : false // moon aeroBraking availability
        const moonTransfer = this.createTransferOrbit(moonName, planetName)
        addPositionData(moonTransfer, col(currentCol), moonTransferY)
        const moonTransferDelta = this.createDeltaObject(prevSource.id, moonTransfer.id, m[0], planetAB)
        const moonCapture = this.createCaptureEscapeOrbit(moonName)
        addPositionData(moonCapture, col(currentCol), moonCaptureY)
        const moonCaptureDelta = this.createDeltaObject(moonTransfer.id, moonCapture.id, m[2], ab)

        const moonLowOrbit = this.createLowOrbit(moonName, m[4])
        addPositionData(moonLowOrbit, col(currentCol), moonLowOrbitY)
        const moonLowDelta = this.createDeltaObject(moonCapture.id, moonLowOrbit.id, m[3], ab)

        const moonBody = this.createBody(
          moonName,
          planetName,
          '#807E7F',
          (Utils.isDefined(m[7]) && m[7] === true)
        )
        addPositionData(moonBody, col(currentCol), moonBodyY)
        const moonBodyDelta = this.createDeltaObject(moonLowOrbit.id, moonBody.id, m[5], ab)

        prevSource = moonTransfer
        updateCurrentCol()

        this.addLocation(moonTransfer)
        this.addDeltaObject(moonTransferDelta)
        this.addDeltaObject(moonCaptureDelta)
        this.addLocation(moonCapture)
        this.addDeltaObject(moonLowDelta)
        this.addLocation(moonLowOrbit)
        this.addLocation(moonBody)
        this.addDeltaObject(moonBodyDelta)
      })

      const lowOrbit = this.createLowOrbit(planetName, lowOrbitAltitude)
      const lowOrbitName = lowOrbit.id
      addPositionData(lowOrbit, col(currentCol), layoutStartY)
      addPositionData(planetBody, col(updateCurrentCol()), layoutStartY)
      this.addDeltaObject(outerPlanetTransferDeltaObject)
      this.addDeltaObject(outerPlanetCaptureDeltaObject)
      this.addLocation(lowOrbit)
      this.addDeltaObject(this.createDeltaObject(prevSource.id, lowOrbitName, lowOrbitDV, planetAB))
      this.addDeltaObject(this.createDeltaObject(lowOrbitName, planetName, bodyDV, planetAB))
    },
    createDeltaObject: function (sourceId, targetId, dv, ab = 0) {
      switch (ab) {
        case 0: ab = 'false'; break
        case 1: ab = 'true'; break
        case 2: ab = 'both'; break
        case 3: ab = 'reverse'; break
      }
      return { sourceId, targetId, dv, ab }
    },
    createDeltaObjectFromArray: function (deltaArray) {
      const a = deltaArray
      return this.createDeltaObject(a[0], a[1], a[2], a[3])
    },
    addLocation: function (locationData) {
      this.system.locationsObject[locationData.id] = locationData
    },
    addDeltaObject: function (deltaObject) {
      this.system.deltaObjectsArray.push(deltaObject)
    },
    addDeltaArray: function (unformattedDeltaArray) {
      const deltaObject = this.createDeltaObjectFromArray(unformattedDeltaArray)
      this.addDeltaObject(deltaObject)
    },
    createData: function () {
      this.system.locationsObject = Locations
      this.applyPositionDataToLocations(this.system.locationsObject)

      CreateOuterPlanets(this)

      const finalLocationsArray = Object.values(this.system.locationsObject)

      UnformattedDeltaArrays.forEach((arr) => {
        this.addDeltaArray(arr)
      })
      this.system.finalDeltasArray = this.system.deltaObjectsArray
      const edgeGraph = {}
      const edgesOnPathGraph = {}
      this.system.deltaObjectsArray.map(d => {
        const source = d.sourceId
        const target = d.targetId
        const dv = d.dv
        if (Utils.isUndefined(edgeGraph[source])) {
          edgeGraph[source] = {}
          edgesOnPathGraph[source] = {}
        }
        if (Utils.isUndefined(edgeGraph[target])) {
          edgeGraph[target] = {}
          edgesOnPathGraph[target] = {}
        }
        edgeGraph[source][target] = dv
        edgeGraph[target][source] = dv
        edgesOnPathGraph[source][target] = false
        edgesOnPathGraph[target][source] = false
      })

      this.system.finalEdgeGraph = edgeGraph
      this.path.edgesGraph = edgesOnPathGraph
      this.system.finalLocationsObject = this.system.locationsObject
      this.system.finalLocationsArray = finalLocationsArray
    },
    handleBothTerminalsAlreadySelected: function (nodeData) {
      this.clearPath()
      this.path.origin = nodeData
      this.path.destination = false
      this.path.deltaV = null
    },
    handleReceivedOriginTerminal: function (nodeData) {
      this.path.origin = nodeData

      if (this.path.origin && this.path.destination) {
        this.computePath()
      }
    },
    testIfAeroBrakingIsAvailable: function (edge, previousNode) {
      if (edge.ab === 'both') {
        this.path.aerobrakingAvailable = true
      } else {
        // delta is going with the path direction
        if (previousNode.id === edge.sourceId && edge.ab === 'true') {
          this.path.aerobrakingAvailable = true
        }

        // delta is going against the path direction
        if (previousNode.id === edge.targetId && edge.ab === 'reverse') {
          this.path.aerobrakingAvailable = true
        }
      }
    },
    markEdgeOnPath: function (sourceId, targetId) {
      this.path.edgesGraph[sourceId][targetId] = true
      this.path.edgesGraph[targetId][sourceId] = true
      this.path.edgesList.push([sourceId, targetId])
    },
    demarkAllEdgesOnPath: function () {
      this.path.edgesList.map(a => {
        const sourceId = a[0]
        const targetId = a[1]
        this.path.edgesGraph[sourceId][targetId] = false
        this.path.edgesGraph[targetId][sourceId] = false
      })
    },
    markNodeOnPath: function (nodeId) {
      this.path.nodes[nodeId] = true
    },
    demarkAllNodesOnPath: function () {
      Object.keys(this.path.nodes).map(k => { this.path.nodes[k] = false })
    },
    computePath: function () {
      const self = this
      self.path.aerobrakingAvailable = false
      self.path.isSelected = true

      const originNodeData = self.path.origin
      const originId = self.path.origin.id
      const destinationNodeData = self.path.destination
      const destinationId = self.path.destination.id

      const shortestPath = dijkstrajs.find_path(this.system.finalEdgeGraph, originId, destinationId)

      let previousNode = null
      let delta = 0
      // let lastEdge
      shortestPath.forEach(nodeId => {
        // handle node
        const node = self.system.finalLocationsObject[nodeId]
        this.markNodeOnPath(nodeId)

        // handle edge
        if (previousNode) {
          // mark the edge SVGs that are on path with .edge-on-path class
          this.markEdgeOnPath(previousNode.id, node.id)

          // increase the delta v running total
          delta += this.system.finalEdgeGraph[previousNode.id][node.id]
        }

        // keep a record the current node so the relevant edges can be identified
        previousNode = node
      })

      self.path.aerobrakingAvailable = this.calculateIfAeroBrakingIsAvailable(originNodeData, destinationNodeData)
      self.path.deltaV = delta
    },
    handleReceivedDestinationTerminal: function (nodeData) {
      this.path.destination = nodeData
      if (this.path.origin && this.path.destination) {
        this.computePath()
      }
    },
    calculateIfAeroBrakingIsAvailable: function (originNodeData, destinationNodeData) {
      const self = this
      const destinationHasAtmosphere = self.hasAtmosphere(destinationNodeData)

      // If landing on a body with an atmosphere,
      // then aerobraking is available
      if (destinationNodeData.nodeType === 'body' && destinationHasAtmosphere) {
        return true
      }

      // If changing system ...
      if (originNodeData.parent !== destinationNodeData.parent) {
        // ... and the destination is in the orbit of the parent (eg: Earth to LEO)
        if (originNodeData.id === destinationNodeData.parent) {
          return destinationHasAtmosphere
        } else {
          return self.ancestorHasAtmosphere(destinationNodeData)
        }
      }
    },
    nodeSelected: function (node) {
      // unselecting origin
      if (this.path.origin && node.id === this.path.origin.id) {
        this.clearSelectedOrigin()
        return
      }

      // unselecting destination
      if (this.path.destination && node.id === this.path.destination.id) {
        this.clearSelectedDestination()
        return
      }

      // starting over with a new node
      if (this.path.origin && this.path.destination) {
        this.handleBothTerminalsAlreadySelected(node)
        return
      }

      // already have the origin
      if (this.path.origin) {
        this.handleReceivedDestinationTerminal(node)
        return
      }

      this.handleReceivedOriginTerminal(node)
    },
    reverseSelectedNodes: function () {
      const originalA = this.path.origin
      const originalB = this.path.destination
      this.clearPath()
      this.path.origin = originalB
      this.path.destination = originalA
      this.handleReceivedDestinationTerminal(this.path.destination)
    },
    clearPathCommon: function (selected) {
      this.demarkAllEdgesOnPath()
      this.demarkAllNodesOnPath()
      this.path.isSelected = false
      this.path.deltaV = null
      this.path.aerobrakingAvailable = false
      switch (selected) {
        case 'path-origin':
          this.path.origin = false
          break
        case 'path-destination':
          this.path.destination = false
          break
        default:
          this.path.origin = false
          this.path.destination = false
          break
      }
    },
    clearSelectedOrigin: function () {
      this.clearPathCommon('path-origin')
    },
    clearSelectedDestination: function () {
      this.clearPathCommon('path-destination')
    },
    clearPath: function () {
      this.clearPathCommon()
    },
    moveTo: function (nodeX, nodeY) {
      const mapContainer = document.querySelector('.map-container')
      const mapWidth = mapContainer.offsetWidth
      const mapHeight = mapContainer.offsetHeight
      const zoomLevel = 0.3
      // TODO get zoomLevel
      // scale position to current zoom level
      let x = nodeX * zoomLevel
      let y = nodeY * zoomLevel
      // translate position from top left of screen
      x -= mapWidth / 2
      y -= mapHeight / 2
      this.panzoom.moveTo(-x, -y)
    },
    moveToNode: function (node) {
      const x = node.position.x
      const y = node.position.y
      this.moveTo(x, y)
    },
    handleBannerClose: function () {
      localStorage.setItem(this.bannerTitle, 'true')
      setTimeout(_ => {
        this.$forceUpdate()
      }, 250)
    },
    hardRefresh: function () {
      this.$emit('refresh-app')
    }
  },
  mounted () {
    const self = this
    self.createData()
    this.mapSVG = document.getElementById('map')
    const mapSVG = this.mapSVG
    this.mapSVG = mapSVG
    const mapContainer = document.querySelector('.map-container')
    const mapWidth = mapContainer.offsetWidth
    const mapHeight = mapContainer.offsetHeight
    const zoomLevel = 0.3
    const startX = (100 + mapWidth + mapWidth * zoomLevel) / 2 // center
    const startY = (mapHeight + mapHeight * zoomLevel - 100) / 2 // center + offset

    this.panzoom = panzoom(mapSVG, {
      maxZoom: 4,
      minZoom: 0.05,
      onTouch: function (e) {
        if (e.target.classList.contains('click-target')) {
          return false
        } else {
          return true
        }
      },
      onDoubleClick: function (e) {
        if (self.path.isSelected) {
          if (e.target.classList.contains('location__icon')) {
          } else {
          }
        }
      }
    })
    this.panzoom.zoomAbs(startX, startY, zoomLevel)
    this.moveToNode(this.system.finalLocationsObject.SunT)

    setTimeout(_ => {
      this.pageLoaded = true
      this.map.mapX = 1234
    }, 1000)
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '../sass/variables'
@import '../sass/utils/shadow-box.sass'

.u-bg-color-main
  background-color: $color-map-background

.u-bg-color-warn
  background-color: lighten($color-purpley-red, 0%)

*
  box-sizing: border-box
  color: #eee
  font-family: "Roboto", sans-serif
  transition: background-color .25s, border-color .25s, color .25s, opacity .25s, stroke .25s
  transition-timing-function: ease

#page-container
  background-color: $color-map-background
  display: grid
  height: 100vh
  width: 100vw

  a
    color: $color-light

  &.page-loaded:before
    opacity: 1

  &:before
    @extend .u-shadow
    bottom: 0
    content: ''
    left: 0
    position: absolute
    right: 0
    top: 0
    width: $controls-width
    z-index: 2
    opacity: 0

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    grid-auto-rows: 50px minmax(0, 1fr) auto
    &:before
      display: none

  @media #{map-get($display-breakpoints, 'md-and-up')}
    grid-auto-rows: auto minmax(0, 1fr)
    grid-template-columns: $controls-width auto

.intro
  max-width: 500px
  p
    text-align: left

.fade-in
  opacity: 0

.page-loaded
  .fade-in
    opacity: 1
</style>
