<template>
  <v-container>
    <h1>Calculators</h1>
    <div class="calculators">
      <div class="calculator__container">
      <h2>Orbital velocity</h2>
        <div class="calculator">
          <div class="my-4">
            Orbital Velocity = Sqrt(Gravitational Constant * Mass / Radius)
            <br>
            <span>G : {{ G }}</span>
          </div>
          <v-text-field v-model="ov.ov" label="Orbital velocity (km/s)"></v-text-field>
          <v-text-field v-model="ov.m" label="Body Mass (kg)"></v-text-field>
          <v-text-field v-model="ov.r" label="Body Radius (km)"></v-text-field>
          <v-text-field v-model="ov.alt" label="Altitude (km)"></v-text-field>
        </div>
      </div>
      <div class="calculator__container">
        <h2>Escape velocity</h2>
        <div class="calculator">
          <div class="my-4">Vorbit = Sqrt(Gravity * Mass / radius)</div>
          <span>G : {{ G }}</span>
          <v-text-field v-model="ev.ev" label="Escape velocity (km/s)"></v-text-field>
          <v-text-field v-model="ev.m" label="Body Mass (kg)"></v-text-field>
          <v-text-field v-model="ev.r" label="Body Radius (m)"></v-text-field>
        </div>
      </div>
      <sphere-of-influence></sphere-of-influence>
    </div>
  </v-container>
</template>
<script>
// import bn from 'bignumber.js'
import Decimal from 'decimal.js'

import SphereOfInfluence from '../components/calculators/SphereOfInfluence'
Decimal.set({ precision: 10 })
const d = Decimal
export default {
  components: {
    SphereOfInfluence
  },
  data () {
    return {
      G: d('6.674e-11'),
      ov: {
        ov: d(0),
        r: d('6.378e3'),
        m: d('5.972e24'),
        alt: d('200')
      },
      ev: {
        ev: d(0),
        r: d('6.371e3'),
        m: d('5.972e24')
      }
    }
  },
  methods: {
    computeOrbitalVelocity: function () {
      if (this.ov.alt) {
        const effectiveRadius = this.ov.r.times('1000').add(d(this.ov.alt).times('1000'))
        console.log('effective radius', effectiveRadius.toString())

        const gtimesm = this.ov.ov = this.G.times(this.ov.m)
        console.log('g times m', gtimesm.toString())

        const fraction = gtimesm.div(effectiveRadius)
        console.log('fraction', fraction.toString())

        const sqrt = fraction.sqrt()
        console.log('sqrt', sqrt.toString())

        const final = sqrt.div('1000').toFixed(3)
        this.ov.ov = final
      }
    },
    computeEscapeVelocity: function () {
      this.ev.ev = this.G
        .times(this.ev.m)
        .dividedBy(this.ev.r.times('1000'))
        .times(2)
        .squareRoot()
        .dividedBy(1000).toFixed(3)
    }
  },
  watch: {
    'ov.r': function () { this.computeOrbitalVelocity() },
    'ov.g': function () { this.computeOrbitalVelocity() },
    'ov.m': function () { this.computeOrbitalVelocity() },
    'ov.alt': function () { this.computeOrbitalVelocity() },
    'ev.r': function () { this.computeEscapeVelocity() },
    'ev.g': function () { this.computeEscapeVelocity() },
    'ev.m': function () { this.computeEscapeVelocity() }
  },
  mounted () {
    this.computeOrbitalVelocity()
    this.computeEscapeVelocity()
    console.log(d('9').squareRoot().toString())
    console.log(d('27').cubeRoot().toString())
    console.log(d('32').pow(2 / 5).toString())
  }
}
</script>
<style lang="sass">
html
  overflow-y: auto !important
$margin: 1rem
h1
  margin-bottom: $margin
.calculators
  display: flex
  flex-wrap: wrap
  margin: 0 -$margin
.calculator__container
  max-width: 350px
  // min-width: 350px
  margin: $margin
</style>
