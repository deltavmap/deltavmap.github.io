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
        <v-col class="body-column">
          <v-container>
            <v-combobox label="auto-fill body A values"
                        v-model="body.A.name"
                        :items="bodyNames"
                        outlined dense clearable
            ></v-combobox>
            <distance-display label="mean orbit radius" :distance-meters="body.A.orbit.radius"></distance-display>
            <time-display label="orbit period" :seconds="body.A.orbit.period"></time-display>
            <velocity-display label="mean orbital velocity" :velocity-meters-second="body.A.orbit.velocity"></velocity-display>
          </v-container>
        </v-col>
        <v-col class="body-column">
          <v-container>
            <v-combobox label="auto-fill body B values"
                        v-model="body.B.name"
                        :items="bodyNames"
                        outlined dense clearable
            ></v-combobox>
            <distance-display label="mean orbit radius" :distance-meters="body.B.orbit.radius"></distance-display>
            <time-display label="orbit period" :seconds="body.B.orbit.period"></time-display>
            <velocity-display label="mean orbital velocity" :velocity-meters-second="body.B.orbit.velocity"></velocity-display>
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
      body: {
        A: {
          mass: d(0),
          name: this.$route.query.bodyAName || '',
          orbit: {
            period: d(0),
            radius: d(0),
            velocity: d(0)
          },
          radius: d(0)
        },
        B: {
          mass: d(0),
          name: this.$route.query.bodyBName || '',
          orbit: {
            period: d(0),
            radius: d(0),
            velocity: d(0)
          },
          radius: d(0)
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
        name: system.name,
        mass: system.mass,
        radius: system.radius,
        type: system.type
      }
      return system
    },
    computeTransOrbitSemiMajorAxis: function () {
      if (parseInt(this.body.A.orbit.radius.toString()) !== 0 && parseInt(this.body.B.orbit.radius) !== 0) {
        this.transferOrbit.semiMajAxis = OM.transferOrbitSemiMajorAxis(this.body.A.orbit.radius, this.body.B.orbit.radius)
        if (this.body.A.orbit.radius > this.body.B.orbit.radius) {
          this.transferOrbit.smallOrbit = this.body.B.orbit
          this.transferOrbit.largeOrbit = this.body.A.orbit
        } else {
          this.transferOrbit.smallOrbit = this.body.A.orbit
          this.transferOrbit.largeOrbit = this.body.B.orbit
        }
      }
    },
    computePeriodOfTransferOrbit: function () {
      this.transferOrbit.full.pSecs = OM.periodOfOrbit(this.system.primary.mass, this.transferOrbit.semiMajAxis)
    },
    handleBodyMeanRadiusChange: function (body, newValue) {
      this.body[body].orbit.radius = newValue
      this.body[body].orbit.period = OM.periodOfOrbit(this.system.primary.mass, newValue)
      this.body[body].orbit.velocity = OM.orbitMeanVelocity(newValue, this.system.primary.mass)
    },
    handleBodyAMeanRadiusChange: function (newValue) {
      this.handleBodyMeanRadiusChange('A', newValue)
    },
    handleBodyBMeanRadiusChange: function (newValue) {
      this.handleBodyMeanRadiusChange('B', newValue)
    },
    handleBodyNameChange: function (bodyName) {
      const name = this.body[bodyName].name
      if (name) {
        const bodyDetails = this.system.childrenObject[name]
        const radius = bodyDetails.orbit.radius
        this.handleBodyMeanRadiusChange(bodyName, radius)
      }
    }
  },
  computed: {
    bodyNames: function () { return Object.keys(this.system.childrenObject) },
    planetMasses: function () { return this.system.children.map(b => { return b.mass }) },
    systemNames: function () { return Object.keys(this.systems).map(s => { return { header: '', text: this.systems[s].name, value: this.systems[s].name } }) },
    bodyAOrbitRadiusKm: function () { return this.body.A.orbit.radius / 1000 },
    bodyBOrbitRadiusKm: function () { return this.body.B.orbit.radius / 1000 },
    transferSemiMajorAxisKm: function () { return this.transferOrbit.semiMajAxis / 1000 }
  },
  watch: {
    'body.A.orbit.radius': function () { this.computeTransOrbitSemiMajorAxis() },
    'body.B.orbit.radius': function () { this.computeTransOrbitSemiMajorAxis() },
    'body.A.name': function () { this.handleBodyNameChange('A') },
    'body.B.name': function () { this.handleBodyNameChange('B') },
    'transferOrbit.semiMajAxis': function () {
      this.computePeriodOfTransferOrbit()
      const days = d(this.transferOrbit.full.pSecs.div(86400).toFixed(1))
      const to = this.transferOrbit
      to.full.pDays = days
      to.full.pYears = days.div(365).toFixed(1)
      to.half.pSecs = to.full.pSecs.div(2)
      to.half.pDays = to.full.pDays.div(2)
      to.half.pYears = to.full.pDays.div(365).div(2).toFixed(1)
      to.velocityAtPerigee = OM.velocityAtRadius(to.semiMajAxis, to.full.pSecs, to.smallOrbit.radius)
      to.velocityAtApogee = OM.velocityAtRadius(to.semiMajAxis, to.full.pSecs, to.largeOrbit.radius)
      to.dv.apogee = to.largeOrbit.velocity.minus(to.velocityAtApogee)
      to.dv.perigee = to.velocityAtPerigee.minus(to.smallOrbit.velocity)
      to.dv.total = to.dv.apogee.add(to.dv.perigee)
    }
  },
  mounted () {
    this.computeTransOrbitSemiMajorAxis()
    this.computePeriodOfTransferOrbit()
    this.handleBodyNameChange('A')
    this.handleBodyNameChange('B')
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
  .body-column
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
