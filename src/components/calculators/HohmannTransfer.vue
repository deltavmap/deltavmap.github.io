<template>
  <div class="hohmann-transfer-calculator">
    <h2>Hohmann Transfer</h2>
    <div class="calculator">
<!--      <v-text-field v-model="primaryBodyMass" label="primary body mass"></v-text-field>-->
      <system-selector label="select system"
                       :initial-system-name="currentSystemName"
                       :systems="systems"
                       v-on:system-name-change="handleSystemNameChange($event, true)"
      ></system-selector>
      <v-row v-if="currentSystemName">
        <v-col class="orbit-column">
          <orbit-details header="Origin orbit"
                         :initial-orbit-name="orbit.origin.name"
                         :orbit-velocity="orbit.origin.velocity"
                         :orbit-period="orbit.origin.period"
                         :orbit-semi-major-axis="orbit.origin.semiMajorAxis"
                         :system="currentSystem"
                         :current-system-name="currentSystemName"
                         v-on:orbit-value-changed="handleOrbitNameChange('origin', $event, true)"
          ></orbit-details>
        </v-col>
        <v-col class="orbit-column">
          <orbit-details header="Destination orbit"
                         :initial-orbit-name="orbit.destination.name"
                         :orbit-name="orbit.destination.name"
                         :orbit-velocity="orbit.destination.velocity"
                         :orbit-period="orbit.destination.period"
                         :orbit-semi-major-axis="orbit.destination.semiMajorAxis"
                         :system="currentSystem"
                         :current-system-name="currentSystemName"
                         v-on:orbit-value-changed="handleOrbitNameChange('destination', $event, true)"
          ></orbit-details>
        </v-col>
      </v-row>
      <hohmann-transfer-orbit :origin-orbit="orbit.origin"
                              :destination-orbit="orbit.destination"
                              :primary-system-mass="currentSystem.primary.object.mass"
      ></hohmann-transfer-orbit>
    </div>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
import u from '../../utils'
import OM from '../../orital-mechanics'
import OrbitDetails from './OrbitDetails'
import SystemSelector from './SystemSelector'
import HohmannTransferOrbit from './HohmannTransferOrbit'
import SolarSystemAPI from '../../utils/solar-system-api'
Decimal.set({ precision: 10 })
const d = Decimal

export default {
  components: {
    OrbitDetails,
    SystemSelector,
    HohmannTransferOrbit
  },
  data () {
    const systems = {}

    const currentSystemName = ''
    const currentSystem = this.createDefaultSystem()
    const orbitA = this.createDefaultOrbitObject('origin')
    const orbitB = this.createDefaultOrbitObject('destination')

    return {
      temp: 0,
      currentSystemName,
      currentSystem,
      systems,
      orbit: {
        origin: orbitA,
        destination: orbitB
      }
    }
  },
  methods: {
    createSystemNameObject: function (name) {
      return { header: '', text: name, value: name }
    },
    createDefaultSystem: function () {
      return { primary: { object: { mass: d(0) } } }
    },
    createDefaultOrbitObject: function (orbit = '', name = '') {
      return {
        name,
        object: { mass: d(0) },
        period: d(0),
        semiMajorAxis: d(0),
        velocity: d(0)
      }
    },
    addChild: function (system, name, child) {
      if (u.undefined(system.children)) {
        this.$set(system, 'children', {})
      }
      u.setIfUndefined(system, 'children', {})
      this.$set(system.children, name, child)
    },
    createSOIOrbit: function (system, parentMass) {
      if (u.allDefined(system, 'object', 'mass')) {
        const semiMajorAxis = OM.sphereOfInfluence(
          system.semiMajorAxis,
          system.object.mass,
          parentMass
        )
        this.addChild(system, 'soi', { semiMajorAxis })
      }
    },
    createSyncOrbit: function (system) {
      const object = system.object
      if (u.defined(object.siderealRotationPeriod) && u.defined(object.mass)) {
        const combinedMass = d(object.mass)
        const semiMajorAxis = OM.semiMajorAxis(object.siderealRotationPeriod, combinedMass)
        this.addChild(system, 'sync', { semiMajorAxis })
      }
    },
    createOrbit: function (system, altitude, exponent = 0) {
      const object = system.object
      altitude = '' + altitude
      let label
      if (exponent === 0) {
        exponent = ''
        label = 'M'
      }
      if (exponent === 3) {
        exponent = 'e3'
        label = 'K'
      }
      if (u.defined(object.meanRadius)) {
        const semiMajorAxis = d(object.meanRadius).plus(altitude + exponent)
        this.addChild(system, altitude + label, { semiMajorAxis })
      } else {
        console.error('object has no meanRadius')
      }
    },
    createVariousOrbits: function (system) {
      if (u.allDefined(system, 'children', 'soi')) {
        this.createOrbit(system, 100)
        this.createOrbit(system, 500)
        this.createOrbit(system, 1, 3)
        this.createOrbit(system, 2, 3)
        this.createOrbit(system, 5, 3)
        this.createOrbit(system, 10, 3)
        this.createOrbit(system, 100, 3)
        this.createOrbit(system, 200, 3)
        this.createOrbit(system, 500, 3)
        this.createOrbit(system, 1000, 3)
        this.createOrbit(system, 2000, 3)
        this.createOrbit(system, 5000, 3)
      }
    },
    processSystem: function (allSystemsObject, newSystem, newSystemName) {
      if (u.defined(allSystemsObject[newSystemName])) {
        return console.error(this.temp++, 'duplicate body name in system', newSystemName)
      }

      this.$set(allSystemsObject, newSystemName, newSystem)

      // create an alias for the primary system object
      newSystem.primary = { object: newSystem.object }

      if (u.defined(newSystem.children)) {
        // process children
        Object.keys(newSystem.children).forEach(name => {
          const child = newSystem.children[name]

          if (u.defined(child.object)) {
            // find subsystems
            this.processSystem(allSystemsObject, child, name)
            this.createSyncOrbit(child)
            this.createSOIOrbit(child, newSystem.object.mass)
            this.createVariousOrbits(child)
          }
        })
      }
    },
    handleOrbitSemiMajorAxisChange: function (orbit, newValue) {
      this.$set(this.orbit[orbit], 'semiMajorAxis', newValue)
      this.$set(this.orbit[orbit], 'period', OM.periodOfOrbit(this.currentSystem.primary.object.mass, newValue))
      this.$set(this.orbit[orbit], 'velocity', OM.orbitMeanVelocity(newValue, this.currentSystem.primary.object.mass))
    },
    handleOrbitNameChange: function (orbit, name, updateURL = false) {
      if (name) {
        this.orbit[orbit].name = name
        const orbitDetails = this.currentSystem.children[name]
        if (u.defined(orbitDetails)) {
          const radius = orbitDetails.semiMajorAxis
          this.handleOrbitSemiMajorAxisChange(orbit, radius)
        } else {
          console.error('no orbit details for', name)
        }
      } else {
        this.orbit[orbit] = this.createDefaultOrbitObject(orbit)
        this.orbit[orbit].name = name
      }
      if (updateURL) {
        this.updateURL()
      }
    },
    handleSystemNameChange: function (newSystemName, updateURL = false) {
      const newSystem = this.getSystem(newSystemName)
      if (newSystem) {
        this.currentSystemName = newSystemName
        this.currentSystem = newSystem
      } else {
        this.currentSystemName = ''
        this.currentSystem = this.createDefaultSystem()
      }
      this.$set(this.orbit, 'origin', this.createDefaultOrbitObject('origin'))
      this.$set(this.orbit, 'destination', this.createDefaultOrbitObject('destination'))
      if (updateURL) {
        this.updateURL()
      }
    },
    getSystem: function (systemName) {
      if (systemName) {
        if (u.defined(this.systems[systemName])) {
          return this.systems[systemName]
        } else {
          console.error('system name not recognized: ', systemName)
        }
      }
      return false
    },
    updateURL: function () {
      let url = ''
      if (u.defined(this.currentSystemName) && this.currentSystemName) {
        url = '?system=' + this.currentSystemName
        if (this.orbit.origin.name) {
          url += '&origin=' + this.orbit.origin.name
        }
        if (this.orbit.destination.name) {
          url += '&destination=' + this.orbit.destination.name
        }
      }
      window.history.replaceState({}, document.title, url)
    },
    handleDataLoaded: function () {
      this.$set(this, 'currentSystemName', u.getQuery('system') || '')
      if (this.currentSystemName) {
        this.$set(this, 'currentSystem', this.getSystem(this.currentSystemName))
      }
      this.handleOrbitNameChange('origin', u.getQuery('origin') || '')
      this.handleOrbitNameChange('destination', u.getQuery('destination') || '')
      this.updateURL()
    }
  },
  computed: {
    planetMasses: function () { return this.currentSystem.children.map(b => { return b.mass }) }
  },
  mounted () {
    this.handleOrbitNameChange('origin', '')
    this.handleOrbitNameChange('destination', '')

    const system = {
      name: 'sun',
      object: {
        mass: '1.988e30',
        type: 'body-star',
        meanRadius: '695.700e6',
        siderealRotationPeriod: '2192832'
      },
      children: {}
    }
    const self = this
    SolarSystemAPI.getPlanetData(system, function () {
      self.processSystem(self.systems, system, 'sun')
      self.handleDataLoaded()
    })
  }
}
</script>
<style lang="sass">
@import '../../sass/variables'
.u-border
  border: 1px solid rgba(255,255,255,0.2)
  border-radius: .2rem
  padding: .5rem 1rem 1rem

.u-value-display
  $spacing: .25rem
  > .row
    justify-content: flex-end
    margin-left: - $spacing
    margin-right: - $spacing
    > .col
      max-width: 100px
      padding-left: $spacing
      padding-right: $spacing

.hohmann-transfer-calculator
  h2,h3,h4
    margin: 0 0 .75em
  .orbit-column
    .container
      @extend .u-border
  .v-subheader
    padding-left: 0
    text-transform: uppercase
    letter-spacing: .1em
  .v-select.v-text-field input,
  .v-select__selections,
  h3,h4
    font-weight: 400
    text-transform: uppercase
    letter-spacing: .1em

  .orbit-column
    min-width: 350px
</style>
