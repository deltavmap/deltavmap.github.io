<template>
  <div id="page-container" :class="{'page-loaded': pageLoaded}">
    <site-title>Delta V Map</site-title>
    <controls :aerobrakingAvailable="path.aerobrakingAvailable"
              :deltaV="path.deltaV"
              :deltaVText="deltaVText"
              :origin="path.origin"
              :originText="pathOriginText"
              :originIsSurface="selectedIsSurface(path.origin)"
              :destination="path.destination"
              :destinationText="pathDestinationText"
              :destinationIsSurface="selectedIsSurface(path.destination)"
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
<!--    <delta-v-map :path-selected="pathSelected"-->
<!--                 :maxX="map.maxX"-->
<!--                 :colDelta="map.colDelta"-->
<!--                 :finalDeltasArray="finalDeltasArray"-->
<!--                 :finalLocationsArray="finalLocationsArray"-->
<!--                 :get-->
<!--                 :edgesOnPathGraph="path.edgesGraph"-->
<!--    ></delta-v-map>-->
    <div class="map-container fade-in">
      <svg id="map"
           class="map"
           :class="{'path-selected' : path.isSelected}"
           :width="(map.maxX + 2 * map.colDelta) + 'px'"
           height="9000px"
      >
        <defs>
          <linearGradient id="gradient-shadow-left" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stop-color="rgba(255,255,255,0.5)" />
            <stop offset="75%" stop-color="rgba(0,0,0.5)" />
          </linearGradient>
          <linearGradient id="gradient-shadow-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stop-color="rgba(255,255,255,0.5)" />
            <stop offset="75%" stop-color="rgba(0,0,0.5)" />
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
        <!--        :transform="'translate(' + orbit.position.x + ',' + orbit.position.y + ')'"-->
        <g v-for="(location, locationIndex) in system.finalLocationsArray"
           :key="locationIndex"
           class="location"
           :id="location.data.id"
           @click="nodeSelected(location)"
           @tap="nodeSelected(location)"
           :class="{
             'origin-node': location.data.id === pathOriginId,
             'destination-node': location.data.id === pathDestinationId,
             'node-on-path': isNodeOnPath(location.data.id)
           }"
        >
          <location :location="location"
                    :label="location.data.label"
                    :location-type="location.data.nodeType"
                    :radius="nodeRadius"
                    :fill-color="getNodeFill(location)"
                    :x-pos="location.position.x"
                    :y-pos="location.position.y"
                    :has-atmosphere="location.data.atmosphere"
                    :sunX="system.locationsObject.Sun.data.position.x"
          ></location>
        </g>
      </svg>
    </div>
    <div id="bottom-scroll-marker"></div>
  </div>
</template>
<script>
import panzoom from 'panzoom'
import dijkstrajs from 'dijkstrajs'

import Locations from './nodes'
import Positions from './positions'
import UnformattedDeltaArrays from './edges'
import CreateOuterPlanets from './create-outer-planets'
import Controls from './Controls'
import Delta from './Delta'
import Location from './Location'
// import DeltaVMap from './DeltaVMap'
import SiteTitle from './SiteTitle'
import Banner from './Banner'

export default {
  components: {
    Banner,
    Controls,
    // DeltaVMap,
    SiteTitle,
    Delta,
    Location
  },
  data () {
    return {
      pageLoaded: false,
      // updateAvailable: false,
      bannerTitle: 'banner-intro-hide',
      mapSVG: null,
      panzoom: null,
      nodeRadius: 40,

      // system data
      system: {
        fixedNodeConstraints: [],
        locationsObject: {},
        formattedDeltaObjectsArray: [],
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
    pathOriginText: function () {
      return (this.path.origin) ? this.path.origin.label : ''
    },
    pathDestinationText: function () {
      return (this.path.destination) ? this.path.destination.label : ''
    },
    pathOriginId: function () {
      return (typeof this.path.origin === 'object') ? this.path.origin.id : ''
    },
    pathDestinationId: function () {
      return (typeof this.path.destination === 'object') ? this.path.destination.id : ''
    },
    deltaVText: function () {
      return (this.path.deltaV) ? this.path.deltaV.toFixed(3) + ' km/s' : ''
    }
  },
  methods: {
    isUndefined: function (thing) {
      return typeof thing === 'undefined'
    },
    isDefined: function (thing) {
      return !this.isUndefined(thing)
    },
    displayBanner: function () {
      return (this.$parent.$parent.updateExists || localStorage.getItem(this.bannerTitle) !== 'true')
    },
    col: function (n, localXOffset = 0) {
      const x = n * this.map.colDelta + this.map.globalXOffset + localXOffset
      if (x > this.map.maxX) this.map.maxX = x
      if (x < this.map.minX) this.map.minX = x
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
    getLocationById: function (nodeId) {
      return this.system.finalLocationsObject[nodeId]
    },
    hasAtmosphere: function (nodeData) {
      if (this.isDefined(nodeData) && this.isDefined(nodeData.atmosphere)) {
        return nodeData.atmosphere
      } else {
        return false
      }
    },
    ancestorHasAtmosphere: function (nodeData) {
      if (this.isUndefined(this.system.finalLocationsObject[nodeData.parent])) {
        return false
      } else {
        const ancestor = this.system.finalLocationsObject[nodeData.parent]
        return this.hasAtmosphere(ancestor.data)
      }
    },
    getNodeFill: function (node) {
      switch (node.data.nodeType) {
        case 'surface':
          return node.data.color
        default:
          return 'rgba(0,0,0,0)' // TODO add to sass
      }
    },
    // nodeIsSurface: function (node) { return (node.data.nodeType === 'surface') },
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
    getFixedNodeConstraints: function () { return this.system.fixedNodeConstraints },
    addFixedNodeConstraint: function (c) { this.system.fixedNodeConstraints.push(c) },
    addFixedNodeConstraints: function (a) { a.forEach(c => this.addFixedNodeConstraint(c)) },
    createSystem: function (id, label, parent = null) {
      return {
        id,
        label,
        parent,
        selected: false,
        nodeType: 'system'
      }
    },
    createFurnishedSystem: function (id, label, parent = null) {
      return this.furnishSystemObject(
        this.formatData(this.createSystem(id, label, parent))
      )
    },
    createPlanetSystem: function (
      planetName, alignLeft, hasAtmosphere,
      predecessorTransferOrbitId, predecessorHasAtmosphere,
      outerPlanetTransferDV, outerPlanetCaptureDV,
      color, moonsArray,
      lowOrbitDV, lowOrbitAltitude,
      surfaceDV,
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
      const planetSurface = this.furnishedLocationObject({
        id: planetName, label: planetName, nodeType: 'surface', parent: 'Sun', color, atmosphere: hasAtmosphere
      })
      this.addLocation(planetSurface)

      // create the outer planet transfer orbit and delta
      const transferName = planetName + 'T'
      const outerPlanetTransfer = this.furnishedLocationObject(
        {
          id: transferName,
          label: planetName + ' Transfer',
          nodeType: 'orbit-transfer',
          parent: 'Sun'
        }
      )
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
      const captureName = planetName + 'CE'
      const outerPlanetCaptureEscape = this.furnishedLocationObject(
        {
          id: captureName,
          label: planetName + ' Capture/Escape',
          nodeType: 'orbit-capture-escape',
          parent: planetName
        }
      )

      updateCurrentCol()
      addPositionData(outerPlanetCaptureEscape, col(currentCol), layoutStartY)
      this.addLocation(outerPlanetCaptureEscape)

      const outerPlanetCaptureDeltaObject = this.createDeltaObject(
        transferName, captureName, outerPlanetCaptureDV, planetAB
      )
      updateCurrentCol()
      const moonHighTransferY = layoutStartY
      // const modifier = -dir
      const modifier = 1
      const moonCaptureY = moonHighTransferY + (modifier * this.map.planetYDelta)
      const moonLowOrbitY = moonCaptureY + (modifier * this.map.planetYDelta)
      const moonSurfaceY = moonLowOrbitY + (modifier * this.map.planetYDelta)
      let prevSource = outerPlanetCaptureEscape

      moonsArray.map(m => {
        const moonName = m[1]
        const ab = (this.isDefined(m[6])) ? m[6] : false // moon aeroBraking availability
        const moonHighTransfer = this.furnishedLocationObject({ id: moonName + 'T', label: moonName + ' Transfer', nodeType: 'orbit-transfer', parent: planetName })
        addPositionData(moonHighTransfer, col(currentCol), moonHighTransferY)
        const moonHighTransferDelta = this.createDeltaObject(prevSource.data.id, moonHighTransfer.data.id, m[0], planetAB)
        const moonCapture = this.furnishedLocationObject({ id: moonName + 'CE', label: moonName + ' Capture/Escape', nodeType: 'orbit-capture-escape', parent: planetName })
        addPositionData(moonCapture, col(currentCol), moonCaptureY)
        const moonCaptureDelta = this.createDeltaObject(moonHighTransfer.data.id, moonCapture.data.id, m[2], ab)

        const moonLowOrbit = this.furnishedLocationObject({ id: 'L' + moonName + 'O', label: 'Low ' + moonName + ' Orbit', nodeType: 'orbit', parent: planetName, altitude: m[4] })
        addPositionData(moonLowOrbit, col(currentCol), moonLowOrbitY)
        const moonLowDelta = this.createDeltaObject(moonCapture.data.id, moonLowOrbit.data.id, m[3], ab)

        const atmosphere = (this.isDefined(m[7]) && m[7] === true)
        const moonSurface = this.furnishedLocationObject({ id: moonName, label: moonName, nodeType: 'surface', parent: planetName, color: '#807E7F', atmosphere })
        addPositionData(moonSurface, col(currentCol), moonSurfaceY)
        const moonSurfaceDelta = this.createDeltaObject(moonLowOrbit.data.id, moonSurface.data.id, m[5], ab)

        prevSource = moonHighTransfer
        updateCurrentCol()

        this.addLocation(moonHighTransfer)
        this.addFormattedDeltaObject(moonHighTransferDelta)
        this.addFormattedDeltaObject(moonCaptureDelta)
        this.addLocation(moonCapture)
        this.addFormattedDeltaObject(moonLowDelta)
        this.addLocation(moonLowOrbit)
        this.addLocation(moonSurface)
        this.addFormattedDeltaObject(moonSurfaceDelta)
      })

      const lowOrbitName = 'L' + planetName + 'O'
      const lowOrbit = this.furnishedLocationObject({
        id: lowOrbitName, label: 'Low ' + planetName + ' Orbit', nodeType: 'orbit', parent: planetName, altitude: lowOrbitAltitude
      })
      addPositionData(lowOrbit, col(currentCol), layoutStartY)
      addPositionData(planetSurface, col(updateCurrentCol()), layoutStartY)
      this.addFormattedDeltaObject(outerPlanetTransferDeltaObject)
      this.addFormattedDeltaObject(outerPlanetCaptureDeltaObject)
      this.addLocation(lowOrbit)
      this.addFormattedDeltaObject(this.createDeltaObject(prevSource.data.id, lowOrbitName, lowOrbitDV, planetAB))
      this.addFormattedDeltaObject(this.createDeltaObject(lowOrbitName, planetName, surfaceDV, planetAB))
    },
    formatData: function (o) {
      return { data: o }
    },
    furnishSystemObject: function (formatedSystemObject) {
      const o = formatedSystemObject
      o.events = false
      o.classes = 'top-center'
      o.grabbable = false
      o.selectable = false
      o.pannable = true
      return o
    },
    furnishedSystemObject: function (unformatedSystemObject) {
      return this.furnishSystemObject(this.formatData(unformatedSystemObject))
    },
    formatSystems: function (unformatedSystemsArray) {
      return unformatedSystemsArray.map(o => this.furnishedSystemObject(o))
    },
    furnishLocationObject: function (formatedObject) {
      const o = formatedObject
      o.classes = 'top-center'
      o.grabbable = false
      o.selectable = false
      if (this.isDefined(o.data.altitude)) {
        o.data.label = o.data.label + ' (' + o.data.altitude + 'km)'
      }
      o.position = o.data.position
      return o
    },
    furnishedLocationObject: function (unformatedLocationObject) {
      return this.furnishLocationObject(this.formatData(unformatedLocationObject))
    },
    formatLocations: function (unformattedLocationDataObject) {
      Object.keys(unformattedLocationDataObject).map((id) => {
        const location = unformattedLocationDataObject[id]
        unformattedLocationDataObject[id] = this.furnishedLocationObject(location)
      })
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
    furnishDeltaObject: function (unfurnishedDeltaObject) {
      const o = unfurnishedDeltaObject
      // TODO perhaps remove all 'furnishing'
      return o
    },
    formatDeltasArray: function (locationsObject, deltaArrays) {
      // convert array to objects
      return deltaArrays.map(o => this.furnishDeltaObject(o))
    },
    addLocation: function (locationData) {
      this.system.locationsObject[locationData.data.id] = locationData
    },
    addFormattedDeltaObject: function (formattedDeltaObject) {
      this.system.formattedDeltaObjectsArray.push(formattedDeltaObject)
    },
    addUnformattedDeltaArray: function (unformattedDeltaArray) {
      const deltaObject = this.createDeltaObjectFromArray(unformattedDeltaArray)
      const formattedDeltaObject = this.furnishDeltaObject(deltaObject)
      this.addFormattedDeltaObject(formattedDeltaObject)
    },
    createData: function () {
      this.system.locationsObject = Locations
      this.applyPositionDataToLocations(this.system.locationsObject)
      this.formatLocations(this.system.locationsObject)

      CreateOuterPlanets(this)

      const finalLocationsArray = Object.values(this.system.locationsObject)

      UnformattedDeltaArrays.forEach((arr) => {
        this.addUnformattedDeltaArray(arr)
      })
      this.system.finalDeltasArray = this.system.formattedDeltaObjectsArray
      const edgeGraph = {}
      const edgesOnPathGraph = {}
      this.system.formattedDeltaObjectsArray.map(d => {
        const source = d.sourceId
        const target = d.targetId
        const dv = d.dv
        if (this.isUndefined(edgeGraph[source])) {
          edgeGraph[source] = {}
          edgesOnPathGraph[source] = {}
        }
        if (this.isUndefined(edgeGraph[target])) {
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
    isNodeOnPath: function (nodeId) {
      return (this.isDefined(this.path.nodes[nodeId]) && this.path.nodes[nodeId])
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
          this.markEdgeOnPath(previousNode.data.id, node.data.id)

          // increase the delta v running total
          delta += this.system.finalEdgeGraph[previousNode.data.id][node.data.id]
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

      // If landing on a surface with an atmosphere,
      // then aerobraking is available
      if (destinationNodeData.nodeType === 'surface' && destinationHasAtmosphere) {
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
      const nodeData = node.data

      if (nodeData.nodeType === 'system') {
        this.clearPath()
        return
      }

      // unselecting origin
      if (this.path.origin && nodeData.id === this.path.origin.id) {
        this.clearSelectedOrigin()
        return
      }

      // unselecting destination
      if (this.path.destination && nodeData.id === this.path.destination.id) {
        this.clearSelectedDestination()
        return
      }

      // starting over with a new node
      if (this.path.origin && this.path.destination) {
        this.handleBothTerminalsAlreadySelected(nodeData)
        return
      }

      // already have the origin
      if (this.path.origin) {
        this.handleReceivedDestinationTerminal(nodeData)
        return
      }

      this.handleReceivedOriginTerminal(nodeData)
    },
    selectedIsSurface: function (nodeData) {
      return (nodeData && this.isDefined(nodeData.nodeType) && nodeData.nodeType === 'surface')
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
    this.map = this.mapSVG
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
        if (e.target.classList.contains('location__icon')) {
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
  transition: background-color .25s, color .25s, opacity .25s, stroke .25s
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

.map-container
  background: $color-map-background
  background-image: linear-gradient(179deg, $color-map-background, $color-map-background-darker)
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

.fade-in
  opacity: 0
.page-loaded
  .fade-in
    opacity: 1
</style>
