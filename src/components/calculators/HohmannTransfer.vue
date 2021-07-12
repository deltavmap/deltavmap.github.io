<template>
  <div class="hohmann-transfer-calculator">
    <h2>Hohmann Transfer</h2>
    <div class="calculator">
      <v-select label="select system"
                v-model="system.name"
                :items="systemNames"
                outlined dense clearable
      ></v-select>
      <v-row>
        <v-col class="orbit-column">
          <v-container>
            <v-combobox label="auto-fill orbit A values"
                        v-model="orbit.A.name"
                        :items="orbitNames"
                        outlined dense clearable
            ></v-combobox>
            <distance-display label="mean orbit radius" :distance-meters="orbit.A.meanRadius"></distance-display>
            <time-display label="orbit period" :seconds="orbit.A.period"></time-display>
            <velocity-display label="mean orbital velocity" :velocity-meters-second="orbit.A.velocity"></velocity-display>
          </v-container>
        </v-col>
        <v-col class="orbit-column">
          <v-container>
            <v-combobox label="auto-fill orbit B values"
                        v-model="orbit.B.name"
                        :items="orbitNames"
                        outlined dense clearable
            ></v-combobox>
            <distance-display label="mean orbit radius" :distance-meters="orbit.B.meanRadius"></distance-display>
            <time-display label="orbit period" :seconds="orbit.B.period"></time-display>
            <velocity-display label="mean orbital velocity" :velocity-meters-second="orbit.B.velocity"></velocity-display>
          </v-container>
        </v-col>
      </v-row>
      <div class="u-border pa-4 mt-4">
        <h3>Hohmann Transfer Orbit</h3>
        <!-- <div class="mb-4">Semi Major Axis of transfer ellipse = R1 + R2 / 2</div> -->
        <v-text-field readonly v-model="transferSemiMajorAxisKm" label="Semi-major axis of transfer ellipse (km)"></v-text-field>
        <div class="d-flex">
          <time-display label='transfer orbit period' :seconds="transferOrbit.full.pSecs"></time-display>
          <time-display label="half transfer orbit period" :seconds="transferOrbit.half.pSecs"></time-display>
        </div>
        <v-row>
          <v-col>
            <velocity-display label="velocity at perigee" :velocity-meters-second="transferOrbit.velocityAtPerigee"></velocity-display>
            <velocity-display label="dv required at perigee" :velocity-meters-second="transferOrbit.dv.perigee"></velocity-display>
          </v-col>
          <v-col>
            <velocity-display label="velocity at apogee" :velocity-meters-second="transferOrbit.velocityAtApogee"></velocity-display>
            <velocity-display label="dv required at apogee" :velocity-meters-second="transferOrbit.dv.apogee"></velocity-display>
          </v-col>
        </v-row>
        <velocity-display label="total dv required" :velocity-meters-second="transferOrbit.dv.total"></velocity-display>
      </div>
    </div>
  </div>
</template>
<script>
import Decimal from 'decimal.js'

import Solar from '../../data/systems/solar'
import OM from '../../orital-mechanics'
import DistanceDisplay from './DistanceDisplay'
import TimeDisplay from './TimeDisplay'
import VelocityDisplay from './VelocityDisplay'

Decimal.set({ precision: 10 })
const d = Decimal

export default {
  components: {
    DistanceDisplay,
    TimeDisplay,
    VelocityDisplay
  },
  data () {
    const systems = { solar: this.loadSystem(Solar) }
    const data = {
      system: systems.solar,
      systems,
      orbit: {
        A: {
          name: this.$route.query.orbitAName || '',
          object: { mass: d(0) },
          period: d(0),
          meanRadius: d(0),
          velocity: d(0)
        },
        B: {
          name: this.$route.query.orbitBName || '',
          object: { mass: d(0) },
          period: d(0),
          meanRadius: d(0),
          velocity: d(0)
        }
      },
      transferOrbit: {
        semiMajAxis: d(0),
        velocityAtPerigee: d(0),
        velocityAtApogee: d(0),
        smallOrbit: {},
        largeOrbit: {},
        dv: {
          apogee: d(0),
          perigee: d(0),
          total: d(0)
        },
        full: {
          pSecs: d(0),
          pDays: d(0),
          pYears: d(0)
        },
        half: {
          pSecs: d(0),
          pDays: d(0),
          pYears: d(0)
        }
      }
    }
    return data
  },
  methods: {
    loadSystem: function (system) {
      system.childrenObject = {}
      system.children.forEach(c => { system.childrenObject[c.name] = c })
      system.primary = {
        object: system.object
      }
      return system
    },
    computeTransOrbitSemiMajorAxis: function () {
      if (parseInt(this.orbit.A.meanRadius.toString()) !== 0 && parseInt(this.orbit.B.meanRadius) !== 0) {
        this.transferOrbit.semiMajAxis = OM.transferOrbitSemiMajorAxis(this.orbit.A.meanRadius, this.orbit.B.meanRadius)
        if (this.orbit.A.meanRadius > this.orbit.B.meanRadius) {
          this.transferOrbit.smallOrbit = this.orbit.B
          this.transferOrbit.largeOrbit = this.orbit.A
        } else {
          this.transferOrbit.smallOrbit = this.orbit.A
          this.transferOrbit.largeOrbit = this.orbit.B
        }
      }
    },
    computePeriodOfTransferOrbit: function () {
      this.transferOrbit.full.pSecs = OM.periodOfOrbit(this.system.primary.object.mass, this.transferOrbit.semiMajAxis)
    },
    handleOrbitMeanRadiusChange: function (orbit, newValue) {
      this.orbit[orbit].meanRadius = newValue
      this.orbit[orbit].period = OM.periodOfOrbit(this.system.primary.object.mass, newValue)
      this.orbit[orbit].velocity = OM.orbitMeanVelocity(newValue, this.system.primary.object.mass)
    },
    handleOrbitAMeanRadiusChange: function (newValue) {
      this.handleOrbitMeanRadiusChange('A', newValue)
    },
    handleOrbitBMeanRadiusChange: function (newValue) {
      this.handleOrbitMeanRadiusChange('B', newValue)
    },
    handleOrbitNameChange: function (orbitName) {
      const name = this.orbit[orbitName].name
      if (name) {
        const orbitDetails = this.system.childrenObject[name]
        const radius = orbitDetails.meanRadius
        this.handleOrbitMeanRadiusChange(orbitName, radius)
      }
    }
  },
  computed: {
    orbitNames: function () { return Object.keys(this.system.childrenObject) },
    planetMasses: function () { return this.system.children.map(b => { return b.mass }) },
    systemNames: function () { return Object.keys(this.systems).map(s => { return { header: '', text: this.systems[s].name, value: this.systems[s].name } }) },
    orbitAOrbitRadiusKm: function () { return this.orbit.A.meanRadius / 1000 },
    orbitBOrbitRadiusKm: function () { return this.orbit.B.meanRadius / 1000 },
    transferSemiMajorAxisKm: function () { return this.transferOrbit.semiMajAxis / 1000 }
  },
  watch: {
    'orbit.A.meanRadius': function () { this.computeTransOrbitSemiMajorAxis() },
    'orbit.B.meanRadius': function () { this.computeTransOrbitSemiMajorAxis() },
    'orbit.A.name': function () { this.handleOrbitNameChange('A') },
    'orbit.B.name': function () { this.handleOrbitNameChange('B') },
    'transferOrbit.semiMajAxis': function () {
      this.computePeriodOfTransferOrbit()
      const days = d(this.transferOrbit.full.pSecs.div(86400).toFixed(1))
      const to = this.transferOrbit
      to.full.pDays = days
      to.full.pYears = days.div(365).toFixed(1)
      to.half.pSecs = to.full.pSecs.div(2)
      to.half.pDays = to.full.pDays.div(2)
      to.half.pYears = to.full.pDays.div(365).div(2).toFixed(1)
      to.velocityAtPerigee = OM.velocityAtRadius(to.semiMajAxis, to.full.pSecs, to.smallOrbit.meanRadius)
      to.velocityAtApogee = OM.velocityAtRadius(to.semiMajAxis, to.full.pSecs, to.largeOrbit.meanRadius)
      to.dv.apogee = to.largeOrbit.velocity.minus(to.velocityAtApogee)
      to.dv.perigee = to.velocityAtPerigee.minus(to.smallOrbit.velocity)
      to.dv.total = to.dv.apogee.add(to.dv.perigee)
    }
  },
  mounted () {
    this.computeTransOrbitSemiMajorAxis()
    this.computePeriodOfTransferOrbit()
    this.handleOrbitNameChange('A')
    this.handleOrbitNameChange('B')
  }
}
</script>
<style lang="sass">
@import '../../sass/variables'
.u-border
  border: 1px solid rgba(255,255,255,0.2)
  border-radius: .2rem

.hohmann-transfer-calculator
  h2
    margin: 1rem 0
  .orbit-column
    .container
      @extend .u-border
  .v-subheader
    padding-left: 0
    text-transform: uppercase
    letter-spacing: .1em
  .v-select.v-text-field input,
  .v-select__selections
    text-transform: uppercase
    letter-spacing: .1em
</style>
