<template>
  <div class="velocity u-border u-value-display mx-0">
    <div class="velocity__label">{{ label }}</div>
      <v-text-field readonly hide-details
                    reverse v-model="velocityValue"
                    :label="velocityLabel">
      </v-text-field>
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
    return {
      velocityLabel: '',
      velocityValue: ''
    }
  },
  methods: {
    handleVelocityMetersSecondChange: function () {
      const velocity = d(this.velocityMetersSecond)
      let velocityLabel = ''
      let velocityValue = ''
      if (velocity.lt(1000)) {
        velocityValue = velocity
        velocityLabel = 'm/s'
      } else {
        velocityLabel = 'km/s'
        velocityValue = velocity.div(1000)
      }
      velocityValue = velocityValue.toFixed(3)
      this.velocityLabel = velocityLabel
      this.velocityValue = velocityValue
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
  &__label
    font-size: x-small
    opacity: .7
    text-transform: uppercase
    letter-spacing: .1em
</style>
