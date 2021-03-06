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
    <v-row>
      <v-col class="pr-2">
        <distance-display label="semi-major axis"
                          class="mt-4"
                          v-if="showSMA"
                          :distance-meters="orbitSemiMajorAxis"></distance-display>
      </v-col>
      <v-col class="pl-2">
        <velocity-display label="mean velocity"
                          class="mt-4"
                          v-if="showVelocity"
                          :velocity-meters-second="orbitVelocity"></velocity-display>
      </v-col>
    </v-row>
    <time-display label="period"
                  class="mt-4 mb-0"
                  v-if="showPeriod"
                  :seconds="orbitPeriod"></time-display>

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
          const children = Object.values(this.system.children)
          children.sort((a, b) => {
            return parseInt(d(a.semiMajorAxis).minus(b.semiMajorAxis).valueOf())
          })
          return children.map(c => {
            let text
            if (u.defined(c.label)) {
              text = c.label
            } else {
              text = c.name
            }
            return {
              text,
              value: c.name
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
h3
  margin: 0 0 1em
  text-transform: uppercase
  letter-spacing: .1em
  font-weight: 400
</style>
