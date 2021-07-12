<template>
  <div class="velocity">
    <div class="velocity__label" v-if="label">{{ label }}</div>
    <v-row>
      <v-col><v-text-field readonly v-model="velocityMetersSecondFormatted" label="m/s"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="velocityKilometersSecond" label="km/s"></v-text-field></v-col>
    </v-row>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
Decimal.set({ precision: 10 })
const d = Decimal
export default {
  props: [
    'velocity-meters-second',
    'label'
  ],
  computed: {
    velocityMetersSecondFormatted: function () { return d(this.velocityMetersSecond).toFixed(1) },
    velocityKilometersSecond: function () { return d(this.velocityMetersSecond).div(1000).toFixed(3) }
  }
}
</script>
<style lang="sass">
.velocity
  &__label
    font-size: x-small
    opacity: .7
    text-transform: uppercase
    letter-spacing: .1em
</style>
