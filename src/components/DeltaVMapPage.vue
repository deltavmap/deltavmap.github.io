<template>
  <div id="page-container" :class="{'page-loaded': pageLoaded}">
    <h1 class="site-title fade-in"><span class="site-icon" style="">Delta V Map</span></h1>

    <div class="controls text-left fade-in">
      <div class="controls__section controls__section--origin" v-show="$vuetify.breakpoint.mdAndUp || !selectedA">
        <label class="controls__label">origin</label>
        <div class="controls__value "
             :class="{
               'controls__value--active': selectedA,
               'controls__value--is-surface': selectedIsSurface(selectedA)
             }">
          <span v-show="!selectedAText"
                class="controls__placeholder controls__placeholder--origin">Select origin</span>
          &#8203;{{ selectedAText }}
        </div>
      </div>
      <div class="controls__section controls__section--destination" v-show="$vuetify.breakpoint.mdAndUp || (selectedA && !selectedB)">
        <label class="controls__label">destination</label>
        <div class="controls__value "
             :class="{
               'controls__value--active': selectedB,
               'controls__value--is-surface': selectedIsSurface(selectedB)
             }">
          <span v-show="!selectedBText"
                class="controls__placeholder controls__placeholder--destination">Select destination</span>
          &#8203;{{ selectedBText }}
        </div>
      </div>
      <div class="controls__section" v-show="$vuetify.breakpoint.mdAndUp || (selectedA && selectedB)">
        <label class="controls__label">delta v</label>
        <div class="controls__value" :class="{'controls__value--active': deltaV}" >&#8203;{{ deltaVText }}</div>
      </div>
      <div class="controls__section controls__aerobraking"
           :class="{'controls__aerobraking--active': aeroBrakingAvailable}"
           v-show="$vuetify.breakpoint.mdAndUp || (selectedA && selectedB)"
      >
        <div class="controls__value">
          <span class="controls__aerobraking_check">✓</span>
          <span class="controls__aerobraking_label">Aero-breaking
            <span v-show="!aeroBrakingAvailable">un</span>available
          </span>
        </div>
      </div>
      <div class="controls__section controls__buttons d-flex justify-space-between">
        <div><v-btn small
                    color="grey lighten-1"
                    :disabled="!selectedA || !selectedB"
                    @click="reverseSelectedNodes">reverse</v-btn></div>
        <div><v-btn small
                    color="grey lighten-1"
                    :disabled="!selectedA && !selectedB"
                    @click="clearSelectedNodes">clear</v-btn></div>
        <div>
          <about-dialog />
        </div>
      </div>
    </div>
<!--    <delta-v-map path-selected="pathSelected"></delta-v-map>-->
    <banner class="fade-in">
      <p>
        Use this app to <span class="font-weight-medium">calculate the speed required to change orbits</span>.
      </p>
      <p>
        See the ABOUT page for more information.
      </p>
      <p class="px-2 py-1 rounded" style="background-color: #444">⚠️This is app is still in active development.
        Currently it does not render well 💩 for certain combinations of <span style="color: crimson">Safari/iOS.</span>
        Please try another browser/OS combination for now.
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
            <stop offset="0%" style="stop-color:rgb(255,255,255,0.1); stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(0,0,0,0.2);stop-opacity:1" />
          </radialGradient>
          <radialGradient id="gradient-sun-corona" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style="stop-color:rgb(255,255,255,0.5); stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,255,255,0.5);stop-opacity:0" />
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
                 :source="getOrbitById(edge.sourceId)"
                 :target="getOrbitById(edge.targetId)"
          >
          </delta>
        </g>
<!--        :transform="'translate(' + orbit.position.x + ',' + orbit.position.y + ')'"-->
        <g v-for="(orbit, orbitIndex) in finalOrbitsArray"
           :key="orbitIndex"
           class="orbit"
           :id="orbit.data.id"
           @click="nodeSelected(orbit)"
           @tap="nodeSelected(orbit)"

        >
          <location :orbit="orbit"
                    :label="orbit.data.label"
                    :orbit-type="orbit.data.nodeType"
                    :radius="nodeRadius"
                    :fill-color="getNodeFill(orbit)"
                    :x-pos="orbit.position.x"
                    :y-pos="orbit.position.y"
                    :has-atmosphere="orbit.data.atmosphere"
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
import Orbits from './nodes'
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
      selectedA: null,
      selectedB: null,
      deltaV: null,
      fixedNodeConstraints: [],
      systemsObject: {},
      orbitsObject: {},
      formattedDeltaObjectsArray: [],
      finalOrbitsArray: [],
      finalDeltasArray: [],
      finalEdgeGraph: {},
      edgeOnPathGraph: {},
      edgeOnPathList: [],
      colDelta: 250,
      planetY: 0,
      planetYDelta: 350,
      pathSelected: false,
      aeroBrakingAvailable: false,
      pageLoaded: false
    }
  },
  computed: {
    selectedAText: function () { return (this.selectedA) ? this.selectedA.label : '' },
    selectedBText: function () { return (this.selectedB) ? this.selectedB.label : '' },
    deltaVText: function () { return (this.deltaV) ? this.deltaV.toFixed(3) + ' km/s' : '' }
  },
  methods: {
    getOrbitById: function (nodeId) {
      return this.finalOrbitsObject[nodeId]
    },
    getPosOfOrbit: function (nodeId) {
      return this.getOrbitById(nodeId).position
    },
    getYPosOfOrbit: function (nodeId) {
      return this.getPosOfOrbit(nodeId).y
    },
    hasAtmosphere: function (nodeData) {
      if (typeof nodeData !== 'undefined' && typeof nodeData.atmosphere !== 'undefined') {
        return nodeData.atmosphere
      } else {
        return false
      }
    },
    ancestorHasAtmosphere: function (nodeData) {
      if (typeof this.finalOrbitsObject[nodeData.parent] === 'undefined') {
        return false
      } else {
        const ancestor = this.finalOrbitsObject[nodeData.parent]
        if (this.hasAtmosphere(ancestor.data)) {
          return true
        }
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
      this.setPlanetY(this.planetY + amount); return this.planetY
    },
    applyPositionDataToOrbits: function (orbits) {
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
        const orbit = orbits[nodeId]
        orbit.position = { x, y }
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
    addFixedNodeConstraints: function (a) { a.map(c => this.addFixedNodeConstraint(c)) },
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
      const planetSurface = this.furnishedOrbitObject({
        id: planetName, label: planetName, nodeType: 'surface', parent: 'Sun', color, atmosphere: hasAtmosphere
      })
      this.addOrbit(planetSurface)

      // create the outer planet transfer orbit and delta
      const transferName = planetName + 'T'
      const outerPlanetTransfer = this.furnishedOrbitObject(
        {
          id: transferName,
          label: planetName + ' Transfer',
          nodeType: 'orbit-transfer',
          parent: 'Sun'
        }
      )
      addPositionData(outerPlanetTransfer, col(0), layoutStartY)
      this.addOrbit(outerPlanetTransfer)

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
      const outerPlanetCaptureEscape = this.furnishedOrbitObject(
        {
          id: captureName,
          label: planetName + ' Capture/Escape',
          nodeType: 'orbit-capture-escape',
          parent: planetName
        }
      )

      updateCurrentCol()
      addPositionData(outerPlanetCaptureEscape, col(currentCol), layoutStartY)
      this.addOrbit(outerPlanetCaptureEscape)

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
        const ab = (typeof m[6] !== 'undefined') ? m[6] : false // moon aeroBraking availability
        const moonHighTransfer = this.furnishedOrbitObject({ id: moonName + 'T', label: moonName + ' Transfer', nodeType: 'orbit-transfer', parent: planetName })
        addPositionData(moonHighTransfer, col(currentCol), moonHighTransferY)
        const moonHighTransferDelta = this.createDeltaObject(prevSource.data.id, moonHighTransfer.data.id, m[0], planetAB)
        const moonCapture = this.furnishedOrbitObject({ id: moonName + 'CE', label: moonName + ' Capture/Escape', nodeType: 'orbit-capture-escape', parent: planetName })
        addPositionData(moonCapture, col(currentCol), moonCaptureY)
        const moonCaptureDelta = this.createDeltaObject(moonHighTransfer.data.id, moonCapture.data.id, m[2], ab)

        const moonLowOrbit = this.furnishedOrbitObject({ id: 'L' + moonName + 'O', label: 'Low ' + moonName + ' Orbit', nodeType: 'orbit', parent: planetName, altitude: m[4] })
        addPositionData(moonLowOrbit, col(currentCol), moonLowOrbitY)
        const moonLowDelta = this.createDeltaObject(moonCapture.data.id, moonLowOrbit.data.id, m[3], ab)

        const atmosphere = (typeof m[7] !== 'undefined' && m[7] === true)
        const moonSurface = this.furnishedOrbitObject({ id: moonName, label: moonName, nodeType: 'surface', parent: planetName, color: '#807E7F', atmosphere })
        addPositionData(moonSurface, col(currentCol), moonSurfaceY)
        const moonSurfaceDelta = this.createDeltaObject(moonLowOrbit.data.id, moonSurface.data.id, m[5], ab)

        prevSource = moonHighTransfer
        updateCurrentCol()

        this.addOrbit(moonHighTransfer)
        this.addFormattedDeltaObject(moonHighTransferDelta)
        this.addFormattedDeltaObject(moonCaptureDelta)
        this.addOrbit(moonCapture)
        this.addFormattedDeltaObject(moonLowDelta)
        this.addOrbit(moonLowOrbit)
        this.addOrbit(moonSurface)
        this.addFormattedDeltaObject(moonSurfaceDelta)
      })

      const lowOrbitName = 'L' + planetName + 'O'
      const lowOrbit = this.furnishedOrbitObject({
        id: lowOrbitName, label: 'Low ' + planetName + ' Orbit', nodeType: 'orbit', parent: planetName, altitude: lowOrbitAltitude
      })
      addPositionData(lowOrbit, col(currentCol), layoutStartY)
      addPositionData(planetSurface, col(updateCurrentCol()), layoutStartY)
      this.addFormattedDeltaObject(outerPlanetTransferDeltaObject)
      this.addFormattedDeltaObject(outerPlanetCaptureDeltaObject)
      this.addOrbit(lowOrbit)
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
      return unformatedSystemsArray.map(o => {
        return this.furnishedSystemObject(o)
      })
    },
    furnishOrbitObject: function (formatedObject) {
      const o = formatedObject
      o.classes = 'top-center'
      o.grabbable = false
      o.selectable = false
      if (typeof o.data.altitude !== 'undefined') {
        o.data.label = o.data.label + ' (' + o.data.altitude + 'km)'
      }
      o.position = o.data.position
      return o
    },
    furnishedOrbitObject: function (unformatedOrbitObject) {
      return this.furnishOrbitObject(this.formatData(unformatedOrbitObject))
    },
    formatOrbits: function (unformattedOrbitDataObject) {
      Object.keys(unformattedOrbitDataObject).map((id) => {
        const orbit = unformattedOrbitDataObject[id]
        unformattedOrbitDataObject[id] = this.furnishedOrbitObject(orbit)
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
    formatDeltasArray: function (orbitsObject, deltaArrays) {
      // convert array to objects
      return deltaArrays.map(o => {
        return this.furnishDeltaObject(o)
      })
    },
    addOrbit: function (orbitData) {
      this.orbitsObject[orbitData.data.id] = orbitData
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
      this.orbitsObject = Orbits
      this.applyPositionDataToOrbits(this.orbitsObject)
      this.formatOrbits(this.orbitsObject)

      CreateOuterPlanets(this)

      const finalOrbitsArray = Object.values(this.orbitsObject)

      UnformattedDeltaArrays.map((arr) => {
        this.addUnformattedDeltaArray(arr)
      })
      this.finalDeltasArray = this.formattedDeltaObjectsArray
      const edgeGraph = {}
      const edgeOnPathGraph = {}
      this.formattedDeltaObjectsArray.map(d => {
        const source = d.sourceId
        const target = d.targetId
        const dv = d.dv
        if (typeof edgeGraph[source] === 'undefined') {
          edgeGraph[source] = {}
          edgeOnPathGraph[source] = {}
        }
        if (typeof edgeGraph[target] === 'undefined') {
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
      this.finalOrbitsObject = this.orbitsObject
      this.finalOrbitsArray = finalOrbitsArray
    },
    handleBothTerminalsAlreadySelected: function (nodeData) {
      this.clearSelectedNodes()
      this.selectedA = nodeData
      this.selectedB = null
      this.deltaV = null
      const node = this.mapSVG.querySelector('#' + nodeData.id)
      node.classList.add('node-on-path')
      node.classList.add('origin-node')
    },
    handleReceivedOriginTerminal: function (nodeData) {
      this.selectedA = nodeData
      const node = this.mapSVG.querySelector('#' + nodeData.id)
      node.classList.add('node-on-path')
      node.classList.add('origin-node')
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
    handleReceivedDestinationTerminal: function (nodeData) {
      const self = this
      if (this.selectedA.id === nodeData.id) {
        return
      }

      self.selectedB = nodeData
      self.aeroBrakingAvailable = false
      self.pathSelected = true

      const originNodeData = self.selectedA
      const originId = self.selectedA.id
      const destinationNodeData = self.selectedB
      const destinationId = self.selectedB.id

      self.mapSVG.querySelector('#' + destinationId).classList.add('destination-node')
      const shortestPath = dijkstrajs.find_path(this.finalEdgeGraph, originId, destinationId)

      let previousNode = null
      let delta = 0
      // let lastEdge
      shortestPath.map(nodeId => {
        // handle node
        const node = self.finalOrbitsObject[nodeId]
        self.mapSVG.querySelector('#' + nodeId)
          .classList.add('node-on-path')

        // handle edge
        if (previousNode) {
          // mark the edge SVGs that are on path with .edge-on-path class
          // const cssSelector = '.edge--' + previousNode.data.id + '-' + node.data.id
          // lastEdge = self.mapSVG.querySelector(cssSelector)
          // lastEdge.classList.add('edge-on-path')
          this.markEdgeOnPath(previousNode.data.id, node.data.id)

          // increase the delta v running total
          delta += this.finalEdgeGraph[previousNode.data.id][node.data.id]
        }

        // keep a record the current node so the relevant edges can be identified
        previousNode = node
      })

      self.aeroBrakingAvailable = this.calculateIfAeroBrakingIsAvailable(originNodeData, destinationNodeData)
      self.deltaV = delta
      setTimeout(_ => this.$forceUpdate(), 1000)
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
          if (destinationHasAtmosphere) {
            return true
          } else {
            return false
          }
        } else {
          // ... and the destination is not in the orbit of the parent
          if (self.ancestorHasAtmosphere(destinationNodeData)) {
            return true
          } else {
            return false
          }
        }
      }
    },
    nodeSelected: function (node) {
      const nodeData = node.data

      if (nodeData.nodeType === 'system') {
        this.clearSelectedNodes()
        return
      }

      // restarting again
      if (this.selectedA && this.selectedB) {
        this.handleBothTerminalsAlreadySelected(nodeData)
      } else {
        // already have the origin
        if (this.selectedA) {
          this.handleReceivedDestinationTerminal(nodeData)
        } else {
          this.handleReceivedOriginTerminal(nodeData)
        }
      }
    },
    selectedIsSurface: function (nodeData) {
      return (nodeData && typeof nodeData.nodeType !== 'undefined' && nodeData.nodeType === 'surface')
    },
    findById: function (id) {
      return this.mapSVG.querySelector('#' + id)
    },
    findByClass: function (className) {
      return document.querySelectorAll('.' + className)
    },
    findAndRemoveClass: function (className) {
      const els = this.findByClass(className)
      els.forEach(el => { el.classList.remove(className) })
    },
    reverseSelectedNodes: function () {
      const originalA = this.selectedA
      const originalB = this.selectedB
      this.findAndRemoveClass('origin-node')
      this.findAndRemoveClass('destination-node')
      // this.clearSelectedNodes()
      this.selectedA = originalB
      this.selectedB = originalA
      this.findById(this.selectedA.id).classList.add('origin-node')
      this.findById(this.selectedB.id).classList.add('destination-node')
      this.handleReceivedDestinationTerminal(this.selectedB)
    },
    clearSelectedNodes: function () {
      this.pathSelected = false
      this.selectedA = null
      this.selectedB = null
      this.deltaV = null
      this.aeroBrakingAvailable = false
      clearInterval(this.interval)
      this.findAndRemoveClass('origin-node')
      this.findAndRemoveClass('destination-node')
      this.findAndRemoveClass('node-on-path')
      // this.findAndRemoveClass('edge-on-path')
      this.demarkAllEdgesOnPath()
      this.findAndRemoveClass('path-selected')
    }
  },
  mounted () {
    const self = this
    self.createData()
    this.mapSVG = document.getElementById('map')
    this.map = this.mapSVG
    const mapSVG = this.mapSVG
    this.mapSVG = mapSVG
    // earthX = -500
    // const zoomY = 500
    panzoom(mapSVG, {
      maxZoom: 4,
      minZoom: 0.025,
      onTouch: function (e) {
        if (e.target.classList.contains('orbit__icon')) {
          return false
        } else {
          return true
        }
      },
      onDoubleClick: function (e) {
        if (self.pathSelected) {
          if (e.target.classList.contains('orbit__icon')) {
          } else {
          }
        }
      }
    }).zoomAbs(
      2300, // (window.innerWidth / 2) * 1.1,
      -2000,
      0.6)
    setTimeout(_ => {
      this.pageLoaded = true
    }, 1000)
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'
@import '@/sass/variables'

.light-box-shadow
  box-shadow: 0 1px 20px 0 rgba(0,0,0,.1)

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
    @extend .light-box-shadow
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
  @extend .light-box-shadow
  color: rgba(0,0,0,.85)
  background-color: $color-light
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

    @media #{map-get($display-breakpoints, 'md-and-up')}
      top: 0
      display: inline-block
      position: absolute
      left: -1.4em

.controls
  @extend .light-box-shadow
  $shadow: 2px
  background-color: $color-light
  color: $color-dark
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
    @extend .light-box-shadow
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
  background-color: $color-map-background
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
