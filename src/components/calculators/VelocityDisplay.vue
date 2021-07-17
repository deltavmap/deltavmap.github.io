<template>
  <div class="velocity u-border my-4 mx-0">
    <div class="velocity__label">{{ label }}</div>
    <v-row>
      <v-col v-if="kmsFormatted">
        <v-text-field readonly hide-details
                      reverse v-model="kmsFormatted"
                      label="km/s">
        </v-text-field>
      </v-col>
      <v-col v-if="msFormatted">
        <v-text-field readonly hide-details
                      v-model="msFormatted"
                      label="m/s">
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
    velocityMetersSecond: { default: 0 },
    label: { default: '' }
  },
  data () {
    return { kms: '', ms: '' }
  },
  methods: {
    blankIfZero: function (value) {
      if (value && d(value).gt(0)) {
        return value
      } else return ''
    },
    handleVelocityMetersSecondChange: function () {
      this.$set(this, 'kms', d(this.velocityMetersSecond).div(1000).floor())
      this.$set(this, 'ms', d(this.velocityMetersSecond).mod(1000))
    }
  },
  computed: {
    msFormatted: function () {
      if (this.blankIfZero(this.ms)) {
        const value = this.ms.toFixed(2).valueOf()
        const padded = value.padStart(6, '0')
        return padded
      } else return ''
    },
    kmsFormatted: function () {
      return this.blankIfZero(this.kms)
    }
  },
  watch: {
    velocityMetersSecond: function () {
      this.handleVelocityMetersSecondChange()
    }
  },
  mounted () {
    this.handleVelocityMetersSecondChange()
  }
}
</script>
<style lang="sass">
.velocity
  max-width: 200px
  &__label
    font-size: x-small
    opacity: .7
    text-transform: uppercase
    letter-spacing: .1em
</style>
