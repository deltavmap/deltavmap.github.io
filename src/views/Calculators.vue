<template>
  <v-container>
    <h1><a href="/calculators">Calculators</a></h1>
    <hohmann-transfer></hohmann-transfer>
<!--    <div class="calculators">-->
<!--      <div class="calculator__container">-->
<!--      <h2>Orbital velocity</h2>-->
<!--        <div class="calculator">-->
<!--          <div class="my-4">-->
<!--            Orbital Velocity = Sqrt(Gravitational Constant * Mass / Radius)-->
<!--            <br>-->
<!--            <span>G : {{ G }}</span>-->
<!--          </div>-->
<!--          <v-text-field v-model="ov.ov" label="Orbital velocity (km/s)"></v-text-field>-->
<!--          <v-text-field v-model="ov.m" label="Body Mass (kg)"></v-text-field>-->
<!--          <v-text-field v-model="ov.r" label="Body Radius (km)"></v-text-field>-->
<!--          <v-text-field v-model="ov.alt" label="Altitude (km)"></v-text-field>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="calculator__container">-->
<!--        <h2>Escape velocity</h2>-->
<!--        <div class="calculator">-->
<!--          <div class="my-4">Vorbit = Sqrt(Gravity * Mass / radius)</div>-->
<!--          <span>G : {{ G }}</span>-->
<!--          <v-text-field v-model="ev.ev" label="Escape velocity (km/s)"></v-text-field>-->
<!--          <v-text-field v-model="ev.m" label="Body Mass (kg)"></v-text-field>-->
<!--          <v-text-field v-model="ev.r" label="Body Radius (km)"></v-text-field>-->
<!--        </div>-->
<!--      </div>-->
<!--      <sphere-of-influence></sphere-of-influence>-->
<!--    </div>-->
  </v-container>
</template>
<script>
// import bn from 'bignumber.js'
import Decimal from 'decimal.js'
import OM from '../orital-mechanics'

import HohmannTransfer from '../components/calculators/HohmannTransfer'
// import SphereOfInfluence from '../components/calculators/SphereOfInfluence'
Decimal.set({ precision: 10 })
const d = Decimal
export default {
  components: {
    HohmannTransfer
    // SphereOfInfluence
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
        const final = OM.orbitalMeanVelocity(this.ov.r, this.ov.alt, this.ov.m)
        this.ov.ov = final
      }
    },
    computeEscapeVelocity: function () {
      const ev = OM.escapeVelocity(this.ev.m, this.ev.r)
      this.ev.ev = ev
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
  }
}
</script>
<style lang="sass">
html
  overflow-y: auto !important
$margin: 1rem
h1
  a
    margin-bottom: $margin
    text-decoration: none
    letter-spacing: .08em
    text-transform: uppercase
    font-weight: 400
h2
  letter-spacing: .05em
  font-weight: 400

.calculators
  display: flex
  flex-wrap: wrap
  margin: 1rem -$margin
.calculator__container
  max-width: 350px
  // min-width: 350px
  margin: $margin
</style>
