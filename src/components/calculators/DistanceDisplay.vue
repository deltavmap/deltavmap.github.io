<template>
  <div class="distance">
    <div class="distance__label" v-if="label">{{ label }}</div>
    <v-row>
      <v-col><v-text-field readonly v-model="distanceMeters" label="meters"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="distanceKilometers" label="kilometers"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="distanceMillionKilometers" label="million kilometers"></v-text-field></v-col>
    </v-row>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
Decimal.set({ precision: 10 })
const d = Decimal
export default {
  props: [
    'distanceMeters',
    'label'
  ],
  computed: {
    distanceKilometers: function () { return d(this.distanceMeters).div(1000).toFixed(1) },
    distanceMillionKilometers: function () { return d(this.distanceMeters).div(1000).div(1000000).toFixed(1) }
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
