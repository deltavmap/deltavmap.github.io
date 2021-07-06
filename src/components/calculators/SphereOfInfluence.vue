<template>
  <div class="calculator__container">
    <h2>Sphere of influence</h2>
    <div class="calculator">
      <div class="my-4">Radius of influence of A = Semi-major axis planet * (Mass of A / Mass of B)^2/5</div>
      <v-text-field v-model="r" label="Radius (km)"></v-text-field>
      <v-text-field v-model="ma" label="Mass of A (kg)"></v-text-field>
      <v-text-field v-model="mb" label="Mass of B (kg)"></v-text-field>
      <v-text-field v-model="smaa" label="Semi-major access of A (km)"></v-text-field>
    </div>
  </div>
</template>
<script>
// https://en.wikipedia.org/wiki/Sphere_of_influence_%28astrodynamics%29

import Decimal from 'decimal.js'
Decimal.set({ precision: 10 })
const d = Decimal

export default {
  data () {
    return {
      r: d(0),
      ma: d('5.972e24'),
      mb: d('1.988e30'),
      smaa: d('149.598e6')
    }
  },
  methods: {
    computeSphereOfInfluence: function () {
      // semi-major axis of body A in meters
      const smaam = this.smaa.times('1000')
      // sphere of influence of body in meters
      const soiam = this.ma
        .dividedBy(this.mb)
        .pow(2 / 5)
        .times(smaam)
      this.r = soiam.dividedBy('1000')
    }
  },
  watch: {
    ma: function () { this.computeSphereOfInfluence() },
    mb: function () { this.computeSphereOfInfluence() },
    smaa: function () { this.computeSphereOfInfluence() }
  },
  mounted () {
    this.computeSphereOfInfluence()
  }
}
</script>
