<template>
  <div class="hohmann-transfer-calculator">
    <h2>Hohmann Transfer</h2>
    <div class="calculator">
<!--      <v-text-field v-model="primaryBodyMass" label="primary body mass"></v-text-field>-->
      <system-selector label="select system"
                       :initial-system-name="currentSystemName"
                       :systems="systems"
                       v-on:system-name-change="handleSystemNameChange($event)"
      ></system-selector>
      <v-row v-if="currentSystemName">
        <v-col class="orbit-column">
          <orbit-details header="Origin orbit"
                         :initial-orbit-name="orbit.origin.name"
                         :orbit-velocity="orbit.origin.velocity"
                         :orbit-period="orbit.origin.period"
                         :orbit-semi-major-axis="orbit.origin.semiMajorAxis"
                         :system="currentSystem"
                         :current-system-name="currentSystemName"
                         v-on:orbit-value-changed="handleOrbitNameChange('origin', $event)"
          ></orbit-details>
        </v-col>
        <v-col class="orbit-column">
          <orbit-details header="Destination orbit"
                         :initial-orbit-name="orbit.destination.name"
                         :orbit-name="orbit.destination.name"
                         :orbit-velocity="orbit.destination.velocity"
                         :orbit-period="orbit.destination.period"
                         :orbit-semi-major-axis="orbit.destination.semiMajorAxis"
                         :system="currentSystem"
                         :current-system-name="currentSystemName"
                         v-on:orbit-value-changed="handleOrbitNameChange('destination', $event)"
          ></orbit-details>
        </v-col>
      </v-row>
      <div class="u-border pa-4 mt-4" v-if="showHohmannTransferOrbitDetails">
        <h3>Hohmann Transfer Orbit</h3>
        <!-- <div class="mb-4">Semi Major Axis of transfer ellipse = R1 + R2 / 2</div> -->
        <distance-display readonly
                          :distance-meters="transferOrbit.semiMajAxis"
                          label="Semi-major axis of transfer ellipse (km)">
        </distance-display>
        <v-row>
          <v-col>
            <time-display label='transfer orbit period'
                          :seconds="transferOrbit.full.pSecs">
            </time-display>
          </v-col>
          <v-col>
            <time-display label="half transfer orbit period"
                          :seconds="transferOrbit.half.pSecs">
            </time-display>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="u-border">
              <h4>Perigee</h4>
              <velocity-display label="velocity at perigee"
                                :velocity-meters-second="transferOrbit.velocityAtPerigee">
              </velocity-display>
              <velocity-display label="dv required at perigee"
                                :velocity-meters-second="transferOrbit.dv.perigee">
              </velocity-display>
            </div>
          </v-col>
          <v-col>
            <div class="u-border">
              <h4>Apogee</h4>
              <velocity-display label="velocity at apogee"
                                :velocity-meters-second="transferOrbit.velocityAtApogee">
              </velocity-display>
              <velocity-display label="dv required at apogee"
                                :velocity-meters-second="transferOrbit.dv.apogee">
              </velocity-display>
            </div>
          </v-col>
        </v-row>
        <velocity-display label="total dv required"
                          :velocity-meters-second="transferOrbit.dv.total">
        </velocity-display>
      </div>
    </div>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
import u from '../../utils'
import Solar from '../../data/systems/solar'
import OM from '../../orital-mechanics'
import OrbitDetails from './OrbitDetails'
import DistanceDisplay from './DistanceDisplay'
import TimeDisplay from './TimeDisplay'
import VelocityDisplay from './VelocityDisplay'
import SystemSelector from './SystemSelector'

Decimal.set({ precision: 10 })
const d = Decimal

export default {
  components: {
    OrbitDetails,
    TimeDisplay,
    DistanceDisplay,
    VelocityDisplay,
    SystemSelector
  },
  data () {
    const systems = {}
    this.processSystem(systems, Solar, 'sun')
    const currentSystemName = this.$route.query.system || ''
    const currentSystem = systems[currentSystemName] || {}

    const orbitA = this.createDefaultOrbitObject('origin', this.$route.query.origin || '')
    const orbitB = this.createDefaultOrbitObject('destination', this.$route.query.destination || '')
    // const orbitNames = this.generateOrbitNamesArray(currentSystemName, systems)
    const transferOrbit = this.createDefaultTransferOrbit()
    return {
      primaryBodyMass: d(0),
      currentSystemName,
      currentSystem,
      systems,
      orbit: {
        origin: orbitA,
        destination: orbitB
      },
      transferOrbit
    }
  },
  methods: {
    createSystemNameObject: function (name) {
      return { header: '', text: name, value: name }
    },
    createDefaultOrbitObject: function (orbit = '', name = '') {
      // console.log('createDefaultOrbitObject', orbit, name)
      return {
        name,
        object: { mass: d(0) },
        period: d(0),
        semiMajorAxis: d(0),
        velocity: d(0)
      }
    },
    createDefaultTransferOrbit: function () {
      return {
        semiMajAxis: d(0),
        velocityAtPerigee: d(0),
        velocityAtApogee: d(0),
        originOrbit: { semiMajorAxis: d(0), velocity: d(0) },
        destinationOrbit: { semiMajorAxis: d(0), velocity: d(0) },
        dv: { apogee: d(0), perigee: d(0), total: d(0) },
        full: { pSecs: d(0), pDays: d(0), pYears: d(0) },
        half: { pSecs: d(0), pDays: d(0), pYears: d(0) }
      }
    },
    addChild: function (system, name, child) {
      if (u.undefined(system.children)) {
        this.$set(system, 'children', {})
      }
      this.$set(system.children, name, child)
    },
    createSOIOrbit: function (system, parentMass) {
      if (u.allDefined(system, 'object', 'mass')) {
        const semiMajorAxis = OM.sphereOfInfluence(
          system.semiMajorAxis,
          system.object.mass,
          parentMass
        )
        this.addChild(system, 'soi', { semiMajorAxis })
      }
    },
    createSyncOrbit: function (system) {
      const object = system.object
      if (u.defined(object.siderealRotationPeriod)) {
        const combinedMass = d(object.mass)
        const semiMajorAxis = OM.semiMajorAxis(object.siderealRotationPeriod, combinedMass)
        this.addChild(system, 'sync', { semiMajorAxis })
      }
    },
    createOrbit: function (system, altitude, exponent = 0) {
      const object = system.object
      altitude = '' + altitude
      let label
      if (exponent === 0) {
        exponent = ''
        label = 'M'
      }
      if (exponent === 3) {
        exponent = 'e3'
        label = 'K'
      }
      if (u.defined(object.meanRadius)) {
        const semiMajorAxis = d(object.meanRadius).plus(altitude + exponent)
        this.addChild(system, altitude + label, { semiMajorAxis })
      } else {
        console.error('object has no meanRadius')
      }
    },
    createVariousOrbits: function (system) {
      if (u.allDefined(system, 'children', 'soi')) {
        this.createOrbit(system, 100)
        this.createOrbit(system, 500)
        this.createOrbit(system, 1, 3)
        this.createOrbit(system, 2, 3)
        this.createOrbit(system, 5, 3)
        this.createOrbit(system, 10, 3)
      }
    },
    processSystem: function (allSystemsObject, newSystem, newSystemName) {
      if (u.defined(allSystemsObject[newSystemName])) {
        throw Error('duplicate body name in system')
      }
      this.$set(allSystemsObject, newSystemName, newSystem)

      // create an alias for the primary system object
      newSystem.primary = { object: newSystem.object }

      if (u.defined(newSystem.children)) {
        // process children
        Object.keys(newSystem.children).forEach(name => {
          const child = newSystem.children[name]

          if (u.defined(child.object)) {
            // find subsystems
            this.processSystem(allSystemsObject, child, name)
            this.createSyncOrbit(child)
            this.createSOIOrbit(child, newSystem.object.mass)
            this.createVariousOrbits(child)
          }
        })
      }
    },
    computeTransOrbitSemiMajorAxis: function () {
      // abort if the semi major axis has not been specified for both orbits
      if (u.undefined(this.orbit.origin.semiMajorAxis) ||
        u.undefined(this.orbit.destination.semiMajorAxis)) {
        return
      }

      const aSemiMajorAxis = parseFloat(this.orbit.origin.semiMajorAxis.toString())
      const bSemiMajorAxis = parseFloat(this.orbit.destination.semiMajorAxis.toString())

      if (aSemiMajorAxis !== 0 && bSemiMajorAxis !== 0) {
        // compute the semi-major axis of the transfer orbit
        this.transferOrbit.semiMajAxis = OM.transferOrbitSemiMajorAxis(
          this.orbit.origin.semiMajorAxis,
          this.orbit.destination.semiMajorAxis
        )
        // work out which orbit is bigger and smaller and record it as such
        // if (d(this.orbit.origin.semiMajorAxis).greaterThan(this.orbit.destination.semiMajorAxis)) {
        //  this.transferOrbit.originOrbit = this.orbit.destination
        //  this.transferOrbit.destinationOrbit = this.orbit.origin
        // } else {
        this.transferOrbit.originOrbit = this.orbit.origin
        this.transferOrbit.destinationOrbit = this.orbit.destination
        // }
      }
    },
    computePeriodOfTransferOrbit: function () {
      if (u.defined(this.currentSystem) && u.defined(this.currentSystem.primary)) {
        this.transferOrbit.full.pSecs = OM.periodOfOrbit(this.currentSystem.primary.object.mass, this.transferOrbit.semiMajAxis)
      }
    },
    handleOrbitSemiMajorAxisChange: function (orbit, newValue) {
      this.$set(this.orbit[orbit], 'semiMajorAxis', newValue)
      this.$set(this.orbit[orbit], 'period', OM.periodOfOrbit(this.currentSystem.primary.object.mass, newValue))
      this.$set(this.orbit[orbit], 'velocity', OM.orbitMeanVelocity(newValue, this.currentSystem.primary.object.mass))
      this.updateURL()
    },
    handleOrbitNameChange: function (orbit, name) {
      if (name) {
        this.orbit[orbit].name = name
        const orbitDetails = this.currentSystem.children[name]
        if (u.defined(orbitDetails)) {
          const radius = orbitDetails.semiMajorAxis
          this.handleOrbitSemiMajorAxisChange(orbit, radius)
        } else {
          console.error('no orbit details for', name)
        }
        this.updateURL()
      } else {
        this.orbit[orbit] = this.createDefaultOrbitObject(orbit)
        this.orbit[orbit].name = name
      }
    },
    handleSystemNameChange: function (newSystemName) {
      if (newSystemName) {
        const newSystem = this.systems[newSystemName]
        if (newSystem) {
          this.currentSystemName = newSystemName
          this.currentSystem = newSystem
        }
      } else {
        this.currentSystemName = ''
        this.currentSystem = ''
      }
      this.$set(this.orbit, 'origin', this.createDefaultOrbitObject('origin'))
      this.$set(this.orbit, 'destination', this.createDefaultOrbitObject('destination'))
      this.$set(this, 'transferOrbit', this.createDefaultTransferOrbit())

      this.updateURL()
    },
    updateURL: function () {
      if (u.defined(this.currentSystemName)) {
        let url = '?system=' + this.currentSystemName
        if (this.orbit.origin.name) {
          url += '&origin=' + this.orbit.origin.name
        }
        if (this.orbit.destination.name) {
          url += '&destination=' + this.orbit.destination.name
        }
        window.history.replaceState({}, document.title, url)
      }
    }
  },
  computed: {
    planetMasses: function () { return this.currentSystem.children.map(b => { return b.mass }) },
    showHohmannTransferOrbitDetails: function () {
      return this.orbit.origin.semiMajorAxis.valueOf() !== '0' && this.orbit.destination.semiMajorAxis.valueOf() !== '0'
    }
  },
  watch: {
    'orbit.origin.semiMajorAxis': function () { this.computeTransOrbitSemiMajorAxis() },
    'orbit.destination.semiMajorAxis': function () { this.computeTransOrbitSemiMajorAxis() },
    'transferOrbit.semiMajAxis': function () {
      // console.log('watch transferOrbit.semiMajAxis')
      this.computePeriodOfTransferOrbit()
      const days = d(this.transferOrbit.full.pSecs.div(86400).toFixed(1))
      const to = this.transferOrbit
      to.full.pDays = days
      to.full.pYears = days.div(365).toFixed(1)
      to.half.pSecs = to.full.pSecs.div(2)
      to.half.pDays = to.full.pDays.div(2)
      to.half.pYears = to.full.pDays.div(365).div(2).toFixed(1)
      debugger
      to.velocityAtPerigee = OM.velocityAtRadius(to.semiMajAxis, to.full.pSecs, to.originOrbit.semiMajorAxis)
      console.log('velocityAtPerigee', to.velocityAtPerigee.valueOf())
      to.velocityAtApogee = OM.velocityAtRadius(to.semiMajAxis, to.full.pSecs, to.destinationOrbit.semiMajorAxis)
      console.log('velocityAtApogee', to.velocityAtApogee.valueOf())
      to.dv.apogee = to.destinationOrbit.velocity.minus(to.velocityAtApogee)
      console.log('to.dv.apogee', to.dv.apogee.valueOf())
      to.dv.perigee = to.velocityAtPerigee.minus(to.originOrbit.velocity)
      console.log('to.dv.perigee', to.dv.perigee.valueOf())
      to.dv.total = to.dv.apogee.abs().add(to.dv.perigee.abs())
    }
  },
  mounted () {
    this.computeTransOrbitSemiMajorAxis()
    this.computePeriodOfTransferOrbit()
    this.handleOrbitNameChange('origin', this.$route.query.origin || '')
    this.handleOrbitNameChange('destination', this.$route.query.destination || '')
  }
}
</script>
<style lang="sass">
@import '../../sass/variables'
.u-border
  border: 1px solid rgba(255,255,255,0.2)
  border-radius: .2rem
  padding: .5rem 1rem 1rem

.hohmann-transfer-calculator
  h2,h3
    margin: 0 0 1em
  .orbit-column
    .container
      @extend .u-border
  .v-subheader
    padding-left: 0
    text-transform: uppercase
    letter-spacing: .1em
  .v-select.v-text-field input,
  .v-select__selections,
  h3,h4
    font-weight: 400
    text-transform: uppercase
    letter-spacing: .1em

  .orbit-column
    min-width: 350px
</style>
