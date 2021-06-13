<template>
  <div id="page-container" :class="{'page-loaded': pageLoaded}">
    <h1 class="site-title fade-in"><span class="site-icon" style="">Delta V Map</span></h1>

    <div class="controls text-left fade-in">
      <div class="controls__section controls__section--origin" v-show="$vuetify.breakpoint.mdAndUp || !locationOrigin">
        <label class="controls__label">origin</label>
        <div class="controls__value "
             :class="{
               'controls__value--active': locationOrigin,
               'controls__value--is-surface': selectedIsSurface(locationOrigin)
             }"
             @click="handleOriginClick()"
        >
          <span v-show="!locationOriginText"
                class="controls__placeholder controls__placeholder--origin">Select origin</span>
          &#8203;{{ locationOriginText }}
        </div>
      </div>
      <div class="controls__section controls__section--destination" v-show="$vuetify.breakpoint.mdAndUp || (locationOrigin && !locationDestination)">
        <label class="controls__label">destination</label>
        <div class="controls__value "
             :class="{
               'controls__value--active': locationDestination,
               'controls__value--is-surface': selectedIsSurface(locationDestination)
             }"
             @click="handleDestinationClick()"
        >
          <span v-show="!locationDestinationText"
                class="controls__placeholder controls__placeholder--destination">Select destination</span>
          &#8203;{{ locationDestinationText }}
        </div>
      </div>
      <div class="controls__section" v-show="$vuetify.breakpoint.mdAndUp || (locationOrigin && locationDestination)">
        <label class="controls__label">delta v</label>
        <div class="controls__value" :class="{'controls__value--active': deltaV}" >&#8203;{{ deltaVText }}</div>
      </div>
      <div class="controls__section controls__aerobraking"
           :class="{'controls__aerobraking--active': aeroBrakingAvailable}"
           v-show="$vuetify.breakpoint.mdAndUp || (locationOrigin && locationDestination)"
      >
        <div class="controls__value">
          <span class="controls__aerobraking_check">✓</span>
          <span class="controls__aerobraking_label">Aerobraking
            <span v-show="!aeroBrakingAvailable">un</span>available
          </span>
        </div>
      </div>
      <div class="controls__section controls__buttons d-flex justify-space-between">
        <div><v-btn small
                    color="grey lighten-1"
                    :disabled="!locationOrigin || !locationDestination"
                    @click="reverseSelectedNodes">reverse</v-btn></div>
        <div><v-btn small
                    color="grey lighten-1"
                    :disabled="!locationOrigin && !locationDestination"
                    @click="clearPath">clear</v-btn></div>
        <div>
          <about-dialog />
        </div>
      </div>
    </div>
    <banner class="fade-in">
      <p class="px-2 py-2 rounded" style="background-color: #444">
        ⚠ This is app is still in active development.
      </p>
      <p>
        Use this app to: <br>
        <span class="font-weight-medium">calculate the speed required to change orbits</span>.
      </p>
      <p>
        Please view the ABOUT page for more information.
      </p>
    </banner>
    <!-- :class="{'map-container--visible': pageLoaded}" -->
    <div class="map-container fade-in">
<!--      <map-snack>this app to calculate the required speed to change orbits.</map-snack>-->
<!--      viewBox="-3000 -100 3000 4000"-->
      <svg id="map"
           class="map"
           :class="{'path-selected' : pathSelected}"

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
        <g v-for="(edge, edgeIndex) in finalDeltasArray"
           :key="'delta-' + edgeIndex"
           :id="edge.sourceId + '-' + edge.targetId"
           :class="[
             'edge',
             'edge--' + edge.sourceId + '-' + edge.targetId,
             'edge--' + edge.targetId + '-' + edge.sourceId,
             edgeOnPathGraph[edge.sourceId][edge.targetId] ? 'edge-on-path' : ''
           ]"
        >
          <delta :deltaData="edge"
                 :source="getLocationById(edge.sourceId)"
                 :target="getLocationById(edge.targetId)"
          >
          </delta>
        </g>
<!--        :transform="'translate(' + orbit.position.x + ',' + orbit.position.y + ')'"-->
        <g v-for="(location, locationIndex) in finalLocationsArray"
           :key="locationIndex"
           class="location"
           :id="location.data.id"
           @click="nodeSelected(location)"
           @tap="nodeSelected(location)"
           :class="{
             'origin-node': location.data.id === locationOriginId,
             'destination-node': location.data.id === locationDestinationId,
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
          ></location>
        </g>
      </svg>
    </div>
    <div id="bottom-scroll-marker"></div>
  </div>
</template>
<script>
// import DeltaVMap from './DeltaVMap'
import panzoom from 'panzoom'
import dijkstrajs from 'dijkstrajs'
import Locations from './nodes'
import UnformattedDeltaArrays from './edges'
import CreateOuterPlanets from './create-outer-planets'
import AboutDialog from './AboutDialog'
import Location from './Location'
import Delta from './Delta'
// import MapSnack from './MapSnack'
import Banner from './Banner'

export default {
  components: {
    // MapSnack,
    // DeltaVMap,
    AboutDialog,
    Delta,
    Location,
    Banner
  },
  data () {
    return {
      mapSnack: true,
      mapSVG: null,
      nodeRadius: 40,
      locationOrigin: false,
      locationDestination: false,
      deltaV: null,
      fixedNodeConstraints: [],
      systemsObject: {},
      locationsObject: {},
      formattedDeltaObjectsArray: [],
      finalLocationsArray: [],
      finalDeltasArray: [],
      finalEdgeGraph: {},
      edgeOnPathGraph: {},
      edgeOnPathList: [],
      nodesOnPath: {},
      colDelta: 250,
      planetY: 0,
      planetYDelta: 350,
      pathSelected: false,
      aeroBrakingAvailable: false,
      pageLoaded: false
    }
  },
  computed: {
    locationOriginText: function () { return (this.locationOrigin) ? this.locationOrigin.label : '' },
    locationDestinationText: function () { return (this.locationDestination) ? this.locationDestination.label : '' },
    locationOriginId: function () {
      return (typeof this.locationOrigin === 'object') ? this.locationOrigin.id : ''
    },
    locationDestinationId: function () {
      return (typeof this.locationDestination === 'object') ? this.locationDestination.id : ''
    },
    deltaVText: function () { return (this.deltaV) ? this.deltaV.toFixed(3) + ' km/s' : '' }
  },
  methods: {
    isUndefined: function (thing) {
      return typeof thing === 'undefined'
    },
    isDefined: function (thing) {
      return !this.isUndefined(thing)
    },
    handleOriginClick: function () {
      if (this.locationOrigin) { // TODO necessary?
        this.clearSelectedOrigin()
      }
    },
    handleDestinationClick: function () {
      if (this.locationDestination) { // TODO necessary?
        this.clearSelectedDestination()
      }
    },
    getLocationById: function (nodeId) {
      return this.finalLocationsObject[nodeId]
    },
    getPosOfLocation: function (nodeId) {
      return this.getLocationById(nodeId).position
    },
    getYPosOfLocation: function (nodeId) {
      return this.getPosOfLocation(nodeId).y
    },
    hasAtmosphere: function (nodeData) {
      if (this.isDefined(nodeData) && this.isDefined(nodeData.atmosphere)) {
        return nodeData.atmosphere
      } else {
        return false
      }
    },
    ancestorHasAtmosphere: function (nodeData) {
      if (this.isUndefined(this.finalLocationsObject[nodeData.parent])) {
        return false
      } else {
        const ancestor = this.finalLocationsObject[nodeData.parent]
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
      this.planetY = amount
      return this.planetY
    },
    incPlanetYDelta: function (amount = this.planetYDelta) {
      return this.setPlanetY(this.planetY + amount)
    },
    applyPositionDataToLocations: function (locations) {
      const col = n => n * this.colDelta
      const planetXL = col(-3)
      const planetXR = col(3)
      const incY = this.incPlanetYDelta
      const lOrbitXL = col(-2)
      const lOrbitXR = col(2)
      const captureXL = col(-1)
      const captureXR = col(1)
      const transferX = col(0)

      const constraints = [] // position constrains
      const c = (nodeId, x, y) => {
        const location = locations[nodeId]
        location.position = { x, y }
      }
      c('Sun', col(0), this.planetY)
      c('LSunO', col(0), incY())
      c('SunT', col(0), incY())

      c('Merc', planetXL, incY())
      c('LMercO', lOrbitXL, this.planetY)
      c('MercCE', captureXL, this.planetY)
      c('MercT', transferX, this.planetY)

      c('Venus', planetXR, incY())
      c('LVenusO', lOrbitXR, this.planetY)
      c('VenusCE', captureXR, this.planetY)
      c('VenusT', transferX, this.planetY)

      const moonX = col(-2)
      const earthY = incY()
      const moonLY = incY()
      c('MoonT', moonX, earthY)
      c('EarthMoonL1', col(-3), moonLY)
      c('EarthMoonL2', col(-1), moonLY)
      c('MoonCE', moonX, this.planetY)
      c('LMoonO', moonX, incY())
      c('NRHOT', col(-3), this.planetY)
      c('NRHO', col(-4), this.planetY)
      c('Moon', moonX, incY())

      c('EarthCE', col(-1), earthY)
      c('GEO', col(-3), earthY - this.planetYDelta)
      c('GTO', col(-3), earthY)
      c('LEO', col(-4), earthY)
      c('Earth', col(-5), earthY)

      this.marsY = earthY + this.planetYDelta

      const vestaY = incY()
      c('VestaT', 0, vestaY)
      c('VestaCE', captureXL, vestaY)
      c('LVestaO', lOrbitXL, vestaY)
      c('Vesta', planetXL, vestaY)

      const ceresY = incY()
      c('CeresT', 0, ceresY)
      c('CeresCE', captureXR, ceresY)
      c('LCeresO', lOrbitXR, ceresY)
      c('Ceres', planetXR, ceresY)

      incY()
      this.planetXR = 0 // col(8)
      return constraints
    },
    getFixedNodeConstraints: function () { return this.fixedNodeConstraints },
    addFixedNodeConstraint: function (c) { this.fixedNodeConstraints.push(c) },
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
      const col = n => layoutStartX + (n * this.colDelta)
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
      const moonCaptureY = moonHighTransferY + (modifier * this.planetYDelta)
      const moonLowOrbitY = moonCaptureY + (modifier * this.planetYDelta)
      const moonSurfaceY = moonLowOrbitY + (modifier * this.planetYDelta)
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
      this.locationsObject[locationData.data.id] = locationData
    },
    addFormattedDeltaObject: function (formattedDeltaObject) {
      this.formattedDeltaObjectsArray.push(formattedDeltaObject)
    },
    addUnformattedDeltaArray: function (unformattedDeltaArray) {
      const deltaObject = this.createDeltaObjectFromArray(unformattedDeltaArray)
      const formattedDeltaObject = this.furnishDeltaObject(deltaObject)
      this.addFormattedDeltaObject(formattedDeltaObject)
    },
    createData: function () {
      this.locationsObject = Locations
      this.applyPositionDataToLocations(this.locationsObject)
      this.formatLocations(this.locationsObject)

      CreateOuterPlanets(this)

      const finalLocationsArray = Object.values(this.locationsObject)

      UnformattedDeltaArrays.forEach((arr) => {
        this.addUnformattedDeltaArray(arr)
      })
      this.finalDeltasArray = this.formattedDeltaObjectsArray
      const edgeGraph = {}
      const edgeOnPathGraph = {}
      this.formattedDeltaObjectsArray.map(d => {
        const source = d.sourceId
        const target = d.targetId
        const dv = d.dv
        if (this.isUndefined(edgeGraph[source])) {
          edgeGraph[source] = {}
          edgeOnPathGraph[source] = {}
        }
        if (this.isUndefined(edgeGraph[target])) {
          edgeGraph[target] = {}
          edgeOnPathGraph[target] = {}
        }
        edgeGraph[source][target] = dv
        edgeGraph[target][source] = dv
        edgeOnPathGraph[source][target] = false
        edgeOnPathGraph[target][source] = false
      })

      this.finalEdgeGraph = edgeGraph
      this.edgeOnPathGraph = edgeOnPathGraph
      this.finalLocationsObject = this.locationsObject
      this.finalLocationsArray = finalLocationsArray
    },
    handleBothTerminalsAlreadySelected: function (nodeData) {
      this.clearPath()
      this.locationOrigin = nodeData
      this.locationDestination = false
      this.deltaV = null
    },
    handleReceivedOriginTerminal: function (nodeData) {
      this.locationOrigin = nodeData

      if (this.locationOrigin && this.locationDestination) {
        this.computePath()
      }
    },
    testIfAeroBrakingIsAvailable: function (edge, previousNode) {
      if (edge.ab === 'both') {
        this.aeroBrakingAvailable = true
      } else {
        // delta is going with the path direction
        if (previousNode.id === edge.sourceId && edge.ab === 'true') {
          this.aeroBrakingAvailable = true
        }

        // delta is going against the path direction
        if (previousNode.id === edge.targetId && edge.ab === 'reverse') {
          this.aeroBrakingAvailable = true
        }
      }
    },
    markEdgeOnPath: function (sourceId, targetId) {
      this.edgeOnPathGraph[sourceId][targetId] = true
      this.edgeOnPathGraph[targetId][sourceId] = true
      this.edgeOnPathList.push([sourceId, targetId])
    },
    demarkAllEdgesOnPath: function () {
      this.edgeOnPathList.map(a => {
        const sourceId = a[0]
        const targetId = a[1]
        this.edgeOnPathGraph[sourceId][targetId] = false
        this.edgeOnPathGraph[targetId][sourceId] = false
      })
    },
    markNodeOnPath: function (nodeId) {
      this.nodesOnPath[nodeId] = true
    },
    demarkAllNodesOnPath: function () {
      Object.keys(this.nodesOnPath).map(k => { this.nodesOnPath[k] = false })
    },
    isNodeOnPath: function (nodeId) {
      return (this.isDefined(this.nodesOnPath[nodeId]) && this.nodesOnPath[nodeId])
    },
    computePath: function () {
      const self = this
      self.aeroBrakingAvailable = false
      self.pathSelected = true

      const originNodeData = self.locationOrigin
      const originId = self.locationOrigin.id
      const destinationNodeData = self.locationDestination
      const destinationId = self.locationDestination.id

      const shortestPath = dijkstrajs.find_path(this.finalEdgeGraph, originId, destinationId)

      let previousNode = null
      let delta = 0
      // let lastEdge
      shortestPath.forEach(nodeId => {
        // handle node
        const node = self.finalLocationsObject[nodeId]
        this.markNodeOnPath(nodeId)

        // handle edge
        if (previousNode) {
          // mark the edge SVGs that are on path with .edge-on-path class
          this.markEdgeOnPath(previousNode.data.id, node.data.id)

          // increase the delta v running total
          delta += this.finalEdgeGraph[previousNode.data.id][node.data.id]
        }

        // keep a record the current node so the relevant edges can be identified
        previousNode = node
      })

      self.aeroBrakingAvailable = this.calculateIfAeroBrakingIsAvailable(originNodeData, destinationNodeData)
      self.deltaV = delta
    },
    handleReceivedDestinationTerminal: function (nodeData) {
      this.locationDestination = nodeData
      if (this.locationOrigin && this.locationDestination) {
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
      if (this.locationOrigin && nodeData.id === this.locationOrigin.id) {
        this.clearSelectedOrigin()
        return
      }

      // unselecting destination
      if (this.locationDestination && nodeData.id === this.locationDestination.id) {
        this.clearSelectedDestination()
        return
      }

      // starting over with a new node
      if (this.locationOrigin && this.locationDestination) {
        this.handleBothTerminalsAlreadySelected(nodeData)
        return
      }

      // already have the origin
      if (this.locationOrigin) {
        this.handleReceivedDestinationTerminal(nodeData)
        return
      }

      this.handleReceivedOriginTerminal(nodeData)
    },
    selectedIsSurface: function (nodeData) {
      return (nodeData && this.isDefined(nodeData.nodeType) && nodeData.nodeType === 'surface')
    },
    reverseSelectedNodes: function () {
      const originalA = this.locationOrigin
      const originalB = this.locationDestination
      this.clearPath()
      this.locationOrigin = originalB
      this.locationDestination = originalA
      this.handleReceivedDestinationTerminal(this.locationDestination)
    },
    clearPathCommon: function (selected) {
      this.demarkAllEdgesOnPath()
      this.demarkAllNodesOnPath()
      this.pathSelected = false
      this.deltaV = null
      this.aeroBrakingAvailable = false
      switch (selected) {
        case 'locationOrigin':
          this.locationOrigin = false
          break
        case 'locationDestination':
          this.locationDestination = false
          break
        default:
          this.locationOrigin = false
          this.locationDestination = false
          break
      }
    },
    clearSelectedOrigin: function () {
      this.clearPathCommon('locationOrigin')
    },
    clearSelectedDestination: function () {
      this.clearPathCommon('locationDestination')
    },
    clearPath: function () {
      this.clearPathCommon()
    }
  },
  mounted () {
    const self = this
    self.createData()
    this.mapSVG = document.getElementById('map')
    this.map = this.mapSVG
    const mapSVG = this.mapSVG
    this.mapSVG = mapSVG
    const zoomLevel = 0.3
    const clientY = 200
    let mapWidth = document.querySelector('.map-container').offsetWidth
    mapWidth = 100 + mapWidth + mapWidth * zoomLevel
    this.panzoom = panzoom(mapSVG, {
      maxZoom: 4,
      minZoom: 0.025,
      onTouch: function (e) {
        if (e.target.classList.contains('location__icon')) {
          return false
        } else {
          return true
        }
      },
      onDoubleClick: function (e) {
        if (self.pathSelected) {
          if (e.target.classList.contains('location__icon')) {
          } else {
          }
        }
      }
    }).zoomAbs(
      (mapWidth / 2),
      clientY,
      zoomLevel
    )
    setTimeout(_ => {
      this.pageLoaded = true
    }, 1000)
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'
@import '@/sass/utils/shadow-box.sass'

*
  box-sizing: border-box
  font-family: "Roboto", sans-serif
  transition: background-color .25s, color .25s, opacity .25s, stroke .25s
  transition-timing-function: ease

#page-container
  background-color: $color-map-background
  display: grid
  height: 100vh
  width: 100vw

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

.site-title
  @extend .u-shadow
  color: rgba(0,0,0,.85)
  background-color: $color-panel-background
  position: relative
  text-transform: uppercase
  z-index: 2

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    grid-row-start: 1
    grid-row-end: 1
    grid-column-start: 1
    grid-column-end: 1

  &-container
    background-color: $color-light
    display: flex
    align-items: center
    justify-content: space-between
    z-index: 3
  @media #{map-get($display-breakpoints, 'sm-and-down')}
    font-size: 1.25rem
    line-height: 2.25rem
    padding: .5rem 1rem
    text-align: left

  @media #{map-get($display-breakpoints, 'md-and-up')}
    box-shadow: none
    font-size: 1.5rem
    grid-column-start: 1
    grid-column-end: 1
    padding: 1rem 0
    text-align: center
    width: $controls-width

.site-icon
  color: $color-dark-text
  display: inline-block
  position: relative
  &:before
    content: ' '
    width: 1.4em
    height: 1.4em
    background-image: url(/img/icons/mstile-70x70.png)
    background-position: center
    background-size: cover
    display: block
    float: left
    position: relative
    top: .15em

    @media #{map-get($display-breakpoints, 'sm-and-down')}
      margin-left: -0.4em

    @media #{map-get($display-breakpoints, 'md-and-up')}
      top: 0
      display: inline-block
      position: absolute
      left: -1.4em

.controls
  @extend .u-shadow
  $shadow: 2px
  background-color: $color-panel-background
  color: $color-dark-text
  display: flex
  z-index: 2
  @media #{map-get($display-breakpoints, 'sm-and-down')}
    display: flex
    flex-wrap: wrap
    grid-row: 3
    justify-content: center
    padding: .5rem 0
    width: 100%
    position: fixed
    bottom: 0
  @media #{map-get($display-breakpoints, 'md-and-up')}
    box-shadow: none
    display: flex
    flex-direction: column
    grid-column: 1
    grid-row: 2
    padding: 0 1rem
    width: $controls-width

  .row
    padding: .5rem

  .controls
    &__section
      @media #{map-get($display-breakpoints, 'sm-and-down')}
        align-items: center
        display: flex
        margin: .5rem 1rem

      @media #{map-get($display-breakpoints, 'md-and-up')}
        margin-top: .5rem

      &--origin, &--destination
        .controls__value
          &--active
            overflow: hidden
            position: relative
            &:before
              content: ''
              position: absolute
              display: inline-block
              width: 5px
              left: 0
              top: 0
              bottom: 0
              background-color: $color-dark
            //border-style: solid
            //border-width: 2px
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            background-color: $color-dark
            border-radius: .5rem
            color: $color-light
            padding-left: .75rem
            position: relative
            &:before
              content: ''
              position: absolute
              display: inline-block
              width: .25rem
              left: 0
              top: 0
              bottom: 0

      &--origin
        .controls__value
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            border: 2px solid $color-origin
            color: $color-white
          &--active
            //border-color: $color-origin
            //color: $color-origin
            &:before
              background-color: $color-origin
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            //&:before
            //  background-color: $color-origin

      &--destination
        .controls__value
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            border: 2px solid $color-destination
            color: $color-white
          &--active
            //border-color: $color-destination
            //color: $color-destination
            &:before
              background-color: $color-destination
          @media #{map-get($display-breakpoints, 'sm-and-down')}
            //&:before
            //  background-color: $color-destination

    &__label
      text-transform: capitalize
      @media #{map-get($display-breakpoints, 'sm-and-down')}
        display: none
        margin-right: 1rem
      @media #{map-get($display-breakpoints, 'md-and-up')}
        min-width: 6rem

    &__value
      border: 1px solid #bbb
      border-radius: .25rem
      min-width: 8rem
      overflow: hidden
      padding: .25rem .5rem
      text-align: center
      &--active
        background-color: $color-dark
        color: $color-light
      &--is-surface
        text-transform: uppercase
        letter-spacing: .2em

    &__placeholder
      opacity: 0.7
      @media #{map-get($display-breakpoints, 'md-and-up')}
        display: none

    &__aerobraking
      opacity: 0.5
      text-align: left

      .controls__value
        border: 0
        padding-left: 0
        text-align: left

      &_check
        color: transparent
        display: inline-block
        margin-right: .5em
        border: 2px solid $color-dark
        border-radius: 2px
        width: 20px
        height: 20px
        line-height: 17px
        padding-left: 2px

      &--active
        opacity: 1
        color: $color-dark
        .controls__aerobraking_check
          color: $color-dark

    &__buttons
      > *
        @media #{map-get($display-breakpoints, 'sm-and-down')}
          margin-right: 1rem

.intro
  max-width: 500px
  p
    text-align: left

.map-container
  background: $color-map-background
  background-image: linear-gradient(179deg, $color-map-background, darken($color-map-background, 10%))
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
