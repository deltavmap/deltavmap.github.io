<template>
  <div class="u-border px-4 pt-2 pb-4 mt-6" v-if="showHohmannTransferOrbitDetails">
    <h3>Hohmann Transfer Orbit</h3>
    <!-- <div class="mb-4">Semi Major Axis of transfer ellipse = R1 + R2 / 2</div> -->
    <v-row>
      <v-col>
        <time-display label='period'
                      :seconds="full.pSecs">
        </time-display>
      </v-col>
      <v-col>
        <time-display label="half period"
                      :seconds="half.pSecs">
        </time-display>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="u-border">
          <h4>Perigee</h4>
          <v-row>
            <v-col class="pr-2">
              <velocity-display label="velocity at perigee"
                                :velocity-meters-second="velocityAtPerigee">
              </velocity-display>
            </v-col>
            <v-col class="pl-2">
              <velocity-display label="dv required at perigee"
                                :velocity-meters-second="dv.perigee">
              </velocity-display>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col>
        <div class="u-border">
          <h4>Apogee</h4>
          <v-row>
            <v-col class="pr-2">
              <velocity-display label="velocity at apogee"
                                :velocity-meters-second="velocityAtApogee">
              </velocity-display>
            </v-col>
            <v-col class="pl-2">
              <velocity-display label="dv required at apogee"
                                :velocity-meters-second="dv.apogee">
              </velocity-display>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <distance-display readonly
                          :distance-meters="semiMajAxis"
                          label="Semi-major axis">
        </distance-display>
      </v-col>
      <v-col>
        <velocity-display label="total dv required"
                          class="ml-auto"
                          :velocity-meters-second="dv.total">
        </velocity-display>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
// import { VueMathjax } from 'vue-mathjax'

import u from '../../utils/utils'
import OM from '../../utils/orbital-mechanics'

import DistanceDisplay from './DistanceDisplay'
import TimeDisplay from './TimeDisplay'
import VelocityDisplay from './VelocityDisplay'

Decimal.set({ precision: 10 })
const d = Decimal

export default {
  components: {
    TimeDisplay,
    DistanceDisplay,
    VelocityDisplay // ,
    // 'vue-mathjax': VueMathjax
  },
  props: ['originOrbit', 'destinationOrbit', 'primarySystemMass'],
  data () {
    const defaults = this.createDefaultTransferOrbit()
    return { ...defaults }
  },
  computed: {
    showHohmannTransferOrbitDetails: function () {
      return d(this.originOrbit.semiMajorAxis).valueOf() !== '0' &&
        d(this.destinationOrbit.semiMajorAxis).valueOf() !== '0' &&
        d(this.primarySystemMass).valueOf() !== '0'
    }
  },
  methods: {
    createDefaultTransferOrbit: function () {
      return {
        semiMajAxis: d(0),
        velocityAtPerigee: d(0),
        velocityAtApogee: d(0),
        dv: { apogee: d(0), perigee: d(0), total: d(0) },
        full: { pSecs: d(0), pDays: d(0), pYears: d(0) },
        half: { pSecs: d(0), pDays: d(0), pYears: d(0) }
      }
    },
    computeTransOrbitSemiMajorAxis: function () {
      // abort if the semi major axis has not been specified for both orbits
      if (u.undefined(this.originOrbit.semiMajorAxis) ||
        u.undefined(this.destinationOrbit.semiMajorAxis)) {
        return
      }

      const aSemiMajorAxis = parseFloat(this.originOrbit.semiMajorAxis.toString())
      const bSemiMajorAxis = parseFloat(this.destinationOrbit.semiMajorAxis.toString())

      if (aSemiMajorAxis !== 0 && bSemiMajorAxis !== 0) {
        // compute the semi-major axis of the transfer orbit
        this.semiMajAxis = OM.transferOrbitSemiMajorAxis(
          this.originOrbit.semiMajorAxis,
          this.destinationOrbit.semiMajorAxis
        )
      }
    },
    computePeriodOfTransferOrbit: function () {
      if (d(this.primarySystemMass).gt(0)) {
        this.full.pSecs = OM.periodOfOrbit(this.primarySystemMass, this.semiMajAxis)
      }
    },
    handleSemiMajorAxisChange: function () {
      this.computePeriodOfTransferOrbit()
      const days = d(this.full.pSecs.div(86400).toFixed(1))
      this.full.pDays = days
      this.full.pYears = days.div(365).toFixed(1)
      this.half.pSecs = this.full.pSecs.div(2)
      this.half.pDays = this.full.pDays.div(2)
      this.half.pYears = this.full.pDays.div(365).div(2).toFixed(1)
      this.velocityAtPerigee = OM.velocityAtRadius(this.semiMajAxis, this.full.pSecs, this.originOrbit.semiMajorAxis)
      this.velocityAtApogee = OM.velocityAtRadius(this.semiMajAxis, this.full.pSecs, this.destinationOrbit.semiMajorAxis)
      this.dv.apogee = this.destinationOrbit.velocity.minus(this.velocityAtApogee)
      this.dv.perigee = this.velocityAtPerigee.minus(this.originOrbit.velocity)
      this.dv.total = this.dv.apogee.abs().add(this.dv.perigee.abs())
    }
  },
  watch: {
    'originOrbit.semiMajorAxis': function () { this.computeTransOrbitSemiMajorAxis() },
    'destinationOrbit.semiMajorAxis': function () { this.computeTransOrbitSemiMajorAxis() },
    semiMajAxis: function () {
      this.handleSemiMajorAxisChange()
    }
  },
  mounted () {
    this.computeTransOrbitSemiMajorAxis()
    this.computePeriodOfTransferOrbit()
    this.handleSemiMajorAxisChange()
  }
}
</script>
<style lang="sass">
  .row + .row
    margin-top: .25rem
</style>
