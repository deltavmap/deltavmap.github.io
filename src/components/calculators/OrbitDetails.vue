<template>
  <v-container>
    <h3>{{ header }}</h3>
    <v-autocomplete label="select orbit"
              v-model="orbitName"
              :items="orbitNames"
              outlined dense clearable hide-details
              :disabled="!currentSystemName"
    ></v-autocomplete>
<!--    -->
    <distance-display label="semi major axis (km)"
                      class="my-4"
                      v-if="showSMA"
                      :distance-meters="orbitSemiMajorAxis"></distance-display>
    <time-display label="period"
                  class="my-4"
                  v-if="showPeriod"
                  :seconds="orbitPeriod"></time-display>
    <velocity-display label="mean velocity"
                      class="my-4"
                      v-if="showVelocity"
                      :velocity-meters-second="orbitVelocity"></velocity-display>
  </v-container>
</template>
<script>
import u from '../../utils/utils'
import DistanceDisplay from './DistanceDisplay'
import TimeDisplay from './TimeDisplay'
import VelocityDisplay from './VelocityDisplay'

import Decimal from 'decimal.js'
Decimal.set({ precision: 10 })
const d = Decimal
export default {
  components: {
    DistanceDisplay,
    TimeDisplay,
    VelocityDisplay
  },
  props: {
    header: {
      default: ''
    },
    initialOrbitName: {
      default: ''
    },
    orbitVelocity: {
      default: 0
    },
    orbitPeriod: {
      default: 0
    },
    orbitSemiMajorAxis: {
      default: 0
    },
    orbitEccentricity: {
      default: 0
    },
    system: {
      default: {}
    },
    currentSystemName: {
      default: ''
    }
  },
  data () {
    return {
      orbitName: this.initialOrbitName
    }
  },
  watch: {
    initialOrbitName: function (newValue) {
      this.$set(this, 'orbitName', newValue)
    },
    orbitName: function (newValue) {
      this.$emit('orbit-value-changed', newValue)
    }
  },
  computed: {
    showSMA: function () { return d(this.orbitSemiMajorAxis).gt(0) },
    showPeriod: function () { return d(this.orbitPeriod).gt(0) },
    showVelocity: function () { return d(this.orbitVelocity).gt(0) },
    orbitNames: function () {
      if (this.system) {
        if (u.defined(this.system.children)) {
          return Object.keys(this.system.children).map(k => {
            const c = this.system.children[k]
            const text = (u.defined(c.label)) ? c.label : k
            return {
              text,
              value: k
            }
          })
        }
      }
      return []
    }
  }
}
</script>
<style lang="sass" scoped>
.container
  padding: .5rem 1rem
h3
  margin: 0 0 1em
  text-transform: uppercase
  letter-spacing: .1em
  font-weight: 400
</style>
