<template>
  <div class="distance u-border u-value-display">
    <div class="distance__label"
    >{{ label }}</div>
    <v-text-field readonly hide-details
                  v-model="distanceValue"
                  :label="distanceLabel">
    </v-text-field>
  </div>
</template>
<script>
import Decimal from 'decimal.js'

Decimal.set({ precision: 10 })
const d = Decimal
export default {
  props: {
    distanceMeters: {
      default: 0
    },
    label: {
      default: ''
    }
  },
  data () {
    return {
      distanceLabel: '',
      distanceValue: ''
    }
  },
  methods: {
    handleDistanceMetersChange: function () {
      const dist = d(this.distanceMeters)
      let distanceLabel = ''
      let distanceValue = ''
      if (dist.lt(1000)) {
        distanceLabel = 'm'
        distanceValue = dist
      } else {
        if (dist.lt(1000000)) {
          distanceLabel = 'km'
          distanceValue = dist.div(1000)
        } else {
          if (dist.lt(1000000000)) {
            distanceLabel = 'thousand km'
            distanceValue = dist.div(1000000)
          } else {
            distanceLabel = 'million km'
            distanceValue = dist.div(1000000000)
          }
        }
      }
      distanceValue = distanceValue.toFixed(3)
      this.distanceLabel = distanceLabel
      this.distanceValue = distanceValue
    }
  },
  watch: {
    distanceMeters: function () {
      this.handleDistanceMetersChange()
    }
  },
  mounted () {
    this.handleDistanceMetersChange()
  }

}
</script>
<style lang="sass">
.distance
  &__label
    font-size: x-small
    opacity: .7
    text-transform: uppercase
    letter-spacing: .1em

</style>
