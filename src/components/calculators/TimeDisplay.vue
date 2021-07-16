<template>
  <div class="time">
    <div class="time__label" v-if="label">{{ label }}</div>
    <v-row>
      <v-col><v-text-field readonly v-model="secsFormatted" label="secs"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="mins" label="mins"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="hours" label="hours"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="days" label="days"></v-text-field></v-col>
      <v-col><v-text-field readonly v-model="years" label="years"></v-text-field></v-col>
    </v-row>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
Decimal.set({ precision: 10 })
const d = Decimal
export default {
  props: {
    seconds: { default: 0 },
    label: { default: '' }
  },
  methods: {
    blankIfZero: function (value) {
      if (this.seconds && this.seconds > 0) {
        return value
      } else return ''
    }
  },
  computed: {
    secsFormatted: function () {
      if (this.seconds > 0) {
        return d(this.seconds).toFixed(1)
      } else return ''
    },
    mins: function () { return this.blankIfZero(d(this.seconds).div(60).toFixed(2)) },
    days: function () { return this.blankIfZero(d(this.seconds).div(86400).toFixed(2)) },
    hours: function () { return this.blankIfZero(d(this.seconds).div(3600).toFixed(1)) },
    years: function () { return this.blankIfZero(d(this.seconds).div(86400).div(365).toFixed(2)) }
  }
}
</script>
<style lang="sass">
.time
  &__label
    font-size: x-small
    opacity: .7
    text-transform: uppercase
    letter-spacing: .1em
</style>
