<template>
  <div id="page-container" :class="{'page-loaded': pageLoaded}">
    <site-title>Delta V Map</site-title>
    <controls :path="path"
              :system="system"
              :systemNames="Object.keys(systemBuilders).map(x => systemBuilders[x].systemName)"
              :system-change-handler="handleSystemChange"
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
                 :calculate-x-pos="calculateXPos"
                 :calculate-y-pos="calculateYPos"
    ></delta-v-map>
    <div id="bottom-scroll-marker"></div>
  </div>
</template>
<script>
import panzoom from 'panzoom'
import dijkstrajs from 'dijkstrajs'

import Utils from '../components/utils'
import SolarSystem from '../data/solar-system'
import KerbolSystem from '../data/kerbol-system'
import Controls from '../components/Controls'
import DeltaVMap from '../components/DeltaVMap'
import SiteTitle from '../components/SiteTitle'
import Banner from '../components/Banner'

export default {
  components: {
    Banner,
    Controls,
    DeltaVMap,
    SiteTitle
  },
  data () {
    const systemBuilders = {
      Solar: SolarSystem,
      Kerbol: KerbolSystem
    }
    let currentSystemName
    debugger
    if (Utils.isDefined(this.$route.params.name)) {
      currentSystemName = this.$route.params.name
    } else {
      const localStorageSystemName = localStorage.getItem('system-name')
      currentSystemName = localStorageSystemName || 'Solar'
    }

    // const currentSystemName = 'Solar'
    const dataObject = {
      pageLoaded: false,
      bannerTitle: 'banner-intro-hide',
      mapSVG: null,
      panzoom: null,
      // system data
      systemBuilders,
      currentSystemBuilder: systemBuilders[currentSystemName],
      system: this.resetSystemDataStructures(systemBuilders[currentSystemName]),
      // map position
      map: {
        globalXOffset: 3000,
        globalYOffset: 300,
        maxX: 0,
        minX: 0,
        currentY: 0,
        yDelta: 350,
        xDelta: 250
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

    return dataObject
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
    resetSystemDataStructures: function (systemBuilder) {
      const system = {
        name: systemBuilder.systemName,
        star: systemBuilder.star,
        locationsObject: {},
        deltaObjectsArray: [],
        edgeGraph: {}
      }
      this.system = system
      localStorage.setItem('system-name', systemBuilder.systemName)
      return system
    },
    displayBanner: function () {
      return (this.$parent.$parent.updateExists || localStorage.getItem(this.bannerTitle) !== 'true')
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
    handleSystemChange: function (systemName) {
      this.clearPath()
      this.createData(systemName)
      this.moveToStartingPosition()
    },
    hasAtmosphere: function (nodeData) {
      if (Utils.isDefined(nodeData) && Utils.isDefined(nodeData.atmosphere)) {
        return nodeData.atmosphere
      } else {
        return false
      }
    },
    ancestorHasAtmosphere: function (nodeData) {
      if (Utils.isUndefined(this.system.locationsObject[nodeData.parent])) {
        return false
      } else {
        const ancestor = this.system.locationsObject[nodeData.parent]
        return this.hasAtmosphere(ancestor)
      }
    },
    applyPositionDataToLocations: function (locations) {

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
      planetTransferDV, planetCaptureDV,
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
      let currentCol = 0
      const dir = (alignLeft) ? -1 : 1
      const updateCurrentCol = (i = 1) => {
        currentCol += (dir * i)
        return currentCol
      }

      // create outer planet
      const planetBody = this.createBody(
        planetName,
        // 'Sun',
        this.system.star,
        color,
        hasAtmosphere
      )
      this.addLocation(planetBody)

      let prevSource

      // create the outer planet transfer orbit and delta
      const planetTransfer = this.createTransferOrbit(
        planetName,
        // 'Sun',
        this.system.star
      )
      prevSource = planetTransfer
      const transferName = planetTransfer.id
      addPositionData(planetTransfer, 0, layoutStartY)
      this.addLocation(planetTransfer)

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
      const planetTransferDeltaObject = this.createDeltaObject(
        transferName, predecessorTransferOrbitId, planetTransferDV, predecessorTransferAB
      )
      this.addDeltaObject(planetTransferDeltaObject)

      // create outer planet capture orbit and delta
      if (planetCaptureDV) {
        const planetCaptureEscape = this.createCaptureEscapeOrbit(planetName)
        prevSource = planetCaptureEscape
        const captureName = planetCaptureEscape.id
        updateCurrentCol()
        addPositionData(planetCaptureEscape, currentCol, layoutStartY)
        this.addLocation(planetCaptureEscape)

        // create planet capture delta object
        const planetCaptureDeltaObject = this.createDeltaObject(
          transferName, captureName, planetCaptureDV, planetAB
        )
        this.addDeltaObject(planetCaptureDeltaObject)
      }

      updateCurrentCol()
      const moonTransferY = layoutStartY
      // const modifier = -dir
      // const modifier = 1
      // const moonCaptureY = moonTransferY + (modifier * 1)
      // const moonLowOrbitY = moonCaptureY + (modifier * 1)
      // const moonBodyY = moonLowOrbitY + (modifier * 1)

      if (Array.isArray(moonsArray)) {
        moonsArray.map(m => {
          let currentY = moonTransferY
          let moonName, aerobrakingAvailable, transferDV, captureDV, lowOrbitDV, lowOrbitAltitude, surfaceDV, hasAtmosphere
          if (Array.isArray(m)) {
            transferDV = m[0]
            moonName = m[1]
            captureDV = m[2]
            lowOrbitDV = m[3]
            lowOrbitAltitude = m[4]
            surfaceDV = m[5]
            aerobrakingAvailable = (Utils.isDefined(m[6])) ? m[6] : false
            hasAtmosphere = (Utils.isDefined(m[7]) && m[7] === true)
          } else {
            moonName = m.moonName
            transferDV = m.transferDV
            captureDV = m.captureDV
            lowOrbitDV = m.lowOrbitDV
            lowOrbitAltitude = m.lowOrbitAltitude
            surfaceDV = m.surfaceDV
            aerobrakingAvailable = m.aerobrakingAvailable
            hasAtmosphere = m.hasAtmosphere
          }

          const moonTransfer = this.createTransferOrbit(moonName, planetName)
          addPositionData(moonTransfer, currentCol, currentY++)
          const moonTransferDelta = this.createDeltaObject(prevSource.id, moonTransfer.id, transferDV, planetAB)
          this.addLocation(moonTransfer)
          this.addDeltaObject(moonTransferDelta)
          let preLowOrbitLocation = moonTransfer

          if (Utils.isDefined(captureDV)) {
            const moonCapture = this.createCaptureEscapeOrbit(moonName)
            addPositionData(moonCapture, currentCol, currentY++)
            const moonCaptureDelta = this.createDeltaObject(moonTransfer.id, moonCapture.id, captureDV, aerobrakingAvailable)
            this.addLocation(moonCapture)
            this.addDeltaObject(moonCaptureDelta)
            preLowOrbitLocation = moonCapture
          }

          const moonLowOrbit = this.createLowOrbit(moonName, lowOrbitAltitude)
          addPositionData(moonLowOrbit, currentCol, currentY++)
          const moonLowOrbitDelta = this.createDeltaObject(preLowOrbitLocation.id, moonLowOrbit.id, lowOrbitDV, aerobrakingAvailable)
          this.addDeltaObject(moonLowOrbitDelta)
          this.addLocation(moonLowOrbit)

          const moonBody = this.createBody(
            moonName,
            planetName,
            '#807E7F',
            hasAtmosphere
          )
          addPositionData(moonBody, currentCol, currentY)
          const moonBodyDelta = this.createDeltaObject(moonLowOrbit.id, moonBody.id, surfaceDV, aerobrakingAvailable)
          this.addLocation(moonBody)
          this.addDeltaObject(moonBodyDelta)

          prevSource = moonTransfer
          updateCurrentCol()
        })
      }

      const lowOrbit = this.createLowOrbit(planetName, lowOrbitAltitude)
      addPositionData(lowOrbit, currentCol, layoutStartY)
      addPositionData(planetBody, updateCurrentCol(), layoutStartY)
      this.addLocation(lowOrbit)
      this.addDeltaObject(this.createDeltaObject(prevSource.id, lowOrbit.id, lowOrbitDV, planetAB))
      this.addDeltaObject(this.createDeltaObject(lowOrbit.id, planetName, bodyDV, planetAB))
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
      // record the delta object
      this.system.deltaObjectsArray.push(deltaObject)

      // create delta v and active path graph
      const source = deltaObject.sourceId
      const target = deltaObject.targetId
      const dv = deltaObject.dv
      if (Utils.isUndefined(this.system.edgeGraph[source])) {
        this.system.edgeGraph[source] = {}
        this.path.edgesGraph[source] = {}
      }
      if (Utils.isUndefined(this.system.edgeGraph[target])) {
        this.system.edgeGraph[target] = {}
        this.path.edgesGraph[target] = {}
      }
      this.system.edgeGraph[source][target] = dv
      this.system.edgeGraph[target][source] = dv
      this.path.edgesGraph[source][target] = false
      this.path.edgesGraph[target][source] = false
    },
    addDeltaArray: function (deltaArray) {
      const deltaObject = this.createDeltaObjectFromArray(deltaArray)
      this.addDeltaObject(deltaObject)
    },
    createData: function (systemName) {
      const systemBuilder = this.systemBuilders[systemName]
      this.resetSystemDataStructures(systemBuilder)

      // load manual locations data
      this.system.locationsObject = systemBuilder.getLocations(this)

      // apply position data to locations
      systemBuilder.applyPositionData(this, this.system.locationsObject)

      // add edges
      systemBuilder.getDeltas().forEach((arr) => { this.addDeltaArray(arr) })

      // automatically create planet systems
      systemBuilder.createPlanetSystems(this)
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

      const shortestPath = dijkstrajs.find_path(this.system.edgeGraph, originId, destinationId)

      let previousNode = null
      let delta = 0

      // let lastEdge
      shortestPath.forEach(nodeId => {
        // handle node
        const node = self.system.locationsObject[nodeId]
        this.markNodeOnPath(nodeId)

        // handle edge
        if (previousNode) {
          // mark the edge SVGs that are on path with .edge-on-path class
          this.markEdgeOnPath(previousNode.id, node.id)

          // increase the delta v running total
          const dv = this.system.edgeGraph[previousNode.id][node.id]
          delta += dv
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
      const zoomLevel = this.panzoom.getTransform().scale
      // scale position to current zoom level
      let x = nodeX * zoomLevel
      let y = nodeY * zoomLevel
      // translate position from top left of screen
      x -= mapWidth / 2
      y -= mapHeight / 2
      this.panzoom.moveTo(-x, -y)
    },
    moveToNode: function (node) {
      const x = this.calculateXPos(node.position.x)
      const y = this.calculateYPos(node.position.y)
      this.moveTo(x, y)
    },
    moveToStartingPosition: function () {
      const po = this.system.star
      const locationId = po + 'T'
      this.panzoom.zoomAbs(0, 0, 0.3)
      this.moveToNode(this.system.locationsObject[locationId])
      setTimeout(_ => {
        this.pageLoaded = true
      }, 1000)
    },
    handleBannerClose: function () {
      localStorage.setItem(this.bannerTitle, 'true')
      setTimeout(_ => {
        this.$forceUpdate()
      }, 250)
    },
    hardRefresh: function () {
      this.$emit('refresh-app')
    },
    calculateXPos: function (n) {
      const x = n * this.map.xDelta + this.map.globalXOffset
      if (x > this.map.maxX) {
        this.map.maxX = x
      }

      if (x < this.map.minX) {
        this.map.minX = x
      }

      return x
    },
    calculateYPos: function (n) {
      const y = n * this.map.yDelta + this.map.globalYOffset
      if (y > this.map.maxY) {
        this.map.maxY = y
      }

      if (y < this.map.minY) {
        this.map.minY = y
      }

      return y
    }
  },
  mounted () {
    const self = this
    self.createData(this.system.name)
    self.mapSVG = document.getElementById('map')
    const mapContainer = document.querySelector('.map-container')
    const mapWidth = mapContainer.offsetWidth
    const mapHeight = mapContainer.offsetHeight
    const zoomLevel = 0.3
    const startX = (100 + mapWidth + mapWidth * zoomLevel) / 2 // center
    const startY = (mapHeight + mapHeight * zoomLevel - 100) / 2 // center + offset

    self.panzoom = panzoom(self.mapSVG, {
      maxZoom: 4,
      minZoom: 0.05,
      onTouch: function (e) {
        return !e.target.classList.contains('click-target')
      }
    })
    self.panzoom.zoomAbs(startX, startY, zoomLevel)
    self.moveToStartingPosition()
    setTimeout(_ => {
      this.pageLoaded = true
    }, 1000)
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '../sass/variables'
@import '../sass/utils/shadow-box'

html
  overflow-y: hidden !important

.u-bg-color-main
  background-color: $color-map-background

.u-bg-color-warn
  background-color: lighten($color-purpley-red, 0%)

*
  box-sizing: border-box
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
