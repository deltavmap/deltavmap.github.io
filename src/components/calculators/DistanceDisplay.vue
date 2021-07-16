<template>
  <div class="distance">
    <div class="distance__label" v-if="label">{{ label }}</div>
    <v-row>
      <v-col><v-text-field readonly v-model="distanceMetersFormatted" label="meters"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="distanceKilometers" label="km"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="distanceThousandKilometers" label="thousand km"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="distanceMillionKilometers" label="million km"></v-text-field></v-col>
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
  methods: {
    blankIfZero: function (value) {
      // console.log('distance display blankIfZero', value)
      if (this.distanceMeters && d(this.distanceMeters).gt(0)) {
        return value
      } else return ''
    }
  },
  computed: {
    distanceMetersFormatted: function () {
      return this.blankIfZero(d(this.distanceMeters).toFixed(2))
    },
    distanceKilometers: function () {
      return this.blankIfZero(d(this.distanceMeters).div(1000).toFixed(2))
    },
    distanceThousandKilometers: function () {
      return this.blankIfZero(d(this.distanceMeters).div(1000).div(1000).toFixed(2))
    },
    distanceMillionKilometers: function () {
      return this.blankIfZero(d(this.distanceMeters).div(1000).div(1000000).toFixed(2))
    }
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
  .col
    min-width: 100px
</style>
