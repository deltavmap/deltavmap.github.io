<template>
  <div class="distance u-border u-value-display">
    <div class="distance__label"
    >{{ label }}</div>
    <v-row>
      <v-col v-if="distanceMillionKilometersFormatted">
        <v-text-field readonly hide-details
                      v-model="distanceMillionKilometersFormatted"
                      label="million">
        </v-text-field>
      </v-col>
      <v-col v-if="distanceThousandKilometersFormatted || distanceMillionKilometersFormatted">
        <v-text-field readonly hide-details
                      v-model="distanceThousandKilometersFormatted"
                      label="thousand"
        ></v-text-field>
      </v-col>
      <v-col v-if="distanceKilometersFormatted || distanceMetersFormatted">
        <v-text-field readonly hide-details
                      v-model="distanceKilometersFormatted"
                      label="km">
        </v-text-field>
      </v-col>
      <v-col v-if="distanceMetersFormatted">
        <v-text-field readonly hide-details
                      v-model="distanceMetersFormatted"
                      label="meters">
        </v-text-field>
      </v-col>
    </v-row>
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
    return { m: '', km: '', tkm: '', mkm: '' }
  },
  methods: {
    blankIfZero: function (value) {
      if (value && !d(value).eq(0)) {
        return value
      } else return ''
    },
    handleDistanceMetersChange: function () {
      const kilometers = 1000
      const thousandKilometers = kilometers * 1000
      const millionKilometers = thousandKilometers * 1000

      const meters = d(this.distanceMeters)
      const mkm = meters.div(millionKilometers).floor().valueOf()
      let remainingMeters = meters.mod(millionKilometers)
      const tkm = remainingMeters.div(thousandKilometers).floor().valueOf()
      remainingMeters = meters.mod(thousandKilometers)
      const km = remainingMeters.div(kilometers).floor().valueOf()
      remainingMeters = meters.mod(kilometers)

      this.$set(this, 'mkm', mkm)
      this.$set(this, 'tkm', tkm)
      this.$set(this, 'km', km)
      this.$set(this, 'm', remainingMeters)
    }
  },
  computed: {
    distanceMetersFormatted: function () {
      if (this.blankIfZero(this.m)) {
        return this.m.toFixed(2)
      } else return ''
    },
    distanceKilometersFormatted: function () {
      return this.blankIfZero(this.km)
    },
    distanceThousandKilometersFormatted: function () {
      return this.blankIfZero(this.tkm)
    },
    distanceMillionKilometersFormatted: function () {
      return this.blankIfZero(this.mkm)
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
