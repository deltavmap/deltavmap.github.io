<template>
  <v-container>
    <h3>{{ header }}</h3>
    <v-combobox label="auto-fill origin orbit values"
              v-model="orbit.name"
              :items="orbitNames"
              outlined dense clearable
              :disabled="!currentSystemName"
    ></v-combobox>
    <distance-display label="semi major axis"
                      :distance-meters="orbit.semiMajorAxis"></distance-display>
    <time-display label="orbit period"
                  :seconds="orbit.period"></time-display>
    <velocity-display label="mean orbital velocity"
                      :velocity-meters-second="orbit.velocity"></velocity-display>
  </v-container>
</template>
<script>
import DistanceDisplay from './DistanceDisplay'
import TimeDisplay from './TimeDisplay'
import VelocityDisplay from './VelocityDisplay'

export default {
  components: {
    DistanceDisplay,
    TimeDisplay,
    VelocityDisplay
  },
  props: ['header', 'orbit', 'orbitNames', 'currentSystemName']
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
