<template>
  <div class="time u-border u-value-display">
    <div class="time__label">{{ label }}</div>
    <v-row>
      <v-col v-if="yearsFormatted">
        <v-text-field readonly hide-details
                      v-model="yearsFormatted"
                      :label="labelYearsFormatted"
        ></v-text-field>
      </v-col>
      <v-col v-if="daysFormatted || yearsFormatted">
        <v-text-field readonly hide-details
                      v-model="daysFormatted"
                      :label="labelDaysFormatted">
        </v-text-field>
      </v-col>
      <v-col v-if="hoursFormatted || daysFormatted">
        <v-text-field readonly hide-details
                      v-model="hoursFormatted"
                      :label="labelHoursFormatted">
        </v-text-field>
      </v-col>
      <v-col v-if="minsFormatted || hoursFormatted">
        <v-text-field readonly hide-details
                      v-model="minsFormatted"
                      :label="labelMinsFormatted">
        </v-text-field>
      </v-col>
      <v-col v-if="secsFormatted || minsFormatted">
        <v-text-field readonly hide-details
                      v-model="secsFormatted"
                      :label="labelSecsFormatted">
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
    seconds: { default: 0 },
    label: { default: '' }
  },
  methods: {
    blankIfZero: function (value) {
      if (value && !d(value).eq(0)) {
        return value
      } else return 0
    },
    handleSecondsChange: function () {
      const minInSeconds = 60
      const hourInSeconds = minInSeconds * 60
      const dayInSeconds = hourInSeconds * 24
      const yearInSeconds = dayInSeconds * 365.25
      const seconds = d(this.seconds)
      const years = seconds.div(yearInSeconds).floor().valueOf()
      let secondsRemaining = seconds.mod(yearInSeconds)
      const days = secondsRemaining.div(dayInSeconds).floor().valueOf()
      secondsRemaining = seconds.mod(dayInSeconds)
      const hours = secondsRemaining.div(hourInSeconds).floor().valueOf()
      secondsRemaining = seconds.mod(hourInSeconds)
      const mins = secondsRemaining.div(minInSeconds).floor().valueOf()
      secondsRemaining = seconds.mod(minInSeconds)
      this.$set(this, 'years', years)
      this.$set(this, 'days', days)
      this.$set(this, 'hours', hours)
      this.$set(this, 'mins', mins)
      this.$set(this, 'secs', secondsRemaining)
    }
  },
  data () {
    return { years: '', days: '', hours: '', mins: '', secs: '' }
  },
  computed: {
    labelYearsFormatted: function () { return (this.yearsFormatted) ? 'years' : 'years' },
    labelDaysFormatted: function () { return (this.daysFormatted) ? 'days' : 'days' },
    labelHoursFormatted: function () { return (this.hoursFormatted) ? 'hours' : 'hours' },
    labelMinsFormatted: function () { return (this.minsFormatted) ? 'mins' : 'mins' },
    labelSecsFormatted: function () { return (this.secsFormatted) ? 'secs' : 'secs' },
    secsFormatted: function () {
      if (this.blankIfZero(this.secs)) {
        return this.secs.toFixed(1)
      } else return ''
    },
    minsFormatted: function () { return this.blankIfZero(this.mins) },
    daysFormatted: function () { return this.blankIfZero(this.days) },
    hoursFormatted: function () { return this.blankIfZero(this.hours) },
    yearsFormatted: function () { return this.blankIfZero(this.years) }
  },
  watch: {
    seconds: function () {
      this.handleSecondsChange()
    }
  },
  mounted () {
    this.handleSecondsChange()
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
  .col
    max-width: 100px
</style>
