<template>
  <div class="hohmann-transfer-calculator">
    <h2>Hohmann Transfer</h2>
    <v-dialog
      class="about-dialog"
      v-model="aboutDialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="about-dialog__button u-button"
          outlined
          dark
          elevation="0"
          v-bind="attrs"
          v-on="on"
        >
          About
        </v-btn>
      </template>

      <v-card class="about-dialog__body">
        <v-card-title class="text-h5 dark">
          About
        </v-card-title>

        <v-card-text>
          <div class="mb-4 pa-4" style>
            <v-row>
              <v-col>
                <p>The following tool calculates the delta-v requirements for a Hohmann transfer orbit.</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>Approximations:
                <ul>
                  <li>Orbits are circular</li>
                  <li>Period and velocity computed from the semi-major axis</li>
                  <li>Orbit inclinations not considered</li>
                </ul>
                </p>
              </v-col>
              <v-col>
                To use:
                <ol>
                  <li>Select a system</li>
                  <li>Select an origin orbit</li>
                  <li>Select a destination orbit</li>
                </ol>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="aboutDialog = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import u from '../../utils/utils'
import OM from '../../utils/orbital-mechanics'
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
      },
      aboutDialog: false
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
    addChild: function (system, name, child, label = '') {
      if (label) {
        this.$set(child, 'label', label)
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
        // only create an SOI orbit if the SOI is greater than the
        // mean radius of the body
        if (d(semiMajorAxis).gt(system.object.meanRadius)) {
          this.addChild(system, 'soi', { semiMajorAxis })
        }
      }
    },
    createSyncOrbit: function (system) {
      const object = system.object
      if (u.defined(object.siderealRotationPeriod) &&
        object.siderealRotationPeriod &&
        u.defined(object.mass) &&
        object.mass
      ) {
        const combinedMass = d(object.mass)
        const semiMajorAxis = OM.semiMajorAxis(object.siderealRotationPeriod, combinedMass)
        if (d(semiMajorAxis).lt(system.children.soi.semiMajorAxis)) {
          this.addChild(system, 'sync', { semiMajorAxis }, 'synchronous orbit')
        }
      }
    },
    createOrbit: function (system, altitude) {
      altitude = d(altitude)
      let name
      if (altitude.lt(1000)) {
        name = altitude + 'M'
      } else {
        const value = parseInt(altitude.div(1000).valueOf())
        name = value.toLocaleString('en-US') + 'K'
      }

      if (u.defined(system.object.meanRadius)) {
        const semiMajorAxis = d(system.object.meanRadius).plus(altitude)
        this.addChild(system, name, { semiMajorAxis })
      } else {
        console.error('object has no meanRadius')
      }
    },
    createVariousOrbits: function (system) {
      const altitudes = [
        100, 200, 500, // 100M
        1000, 2000, 5000, // 1K
        10000, 20000, 50000, // 10K
        100000, 200000, 500000, // 100K
        1000000, 2000000, 5000000, // 1000K
        10000000, 20000000, 50000000, // 10,000K
        100000000, 200000000, 500000000, // 100,000K
        1000000000, 2000000000, 5000000000, // 1,000,000K
        10000000000, 20000000000, 50000000000, // 10,000,000K
        100000000000, 200000000000, 500000000000 // 100,000,000K
      ]
      const soi = d(system.children.soi.semiMajorAxis)
      altitudes.forEach(altitude => {
        const orbitRadius = d(system.object.meanRadius).plus(altitude)
        const orbitWithinSOI = orbitRadius.lte(soi)

        if (orbitWithinSOI) {
          if (u.allDefined(system, 'object', 'atmosphere', 'karman')) {
            if (d(system.object.meanRadius).plus(system.object.atmosphere.karman).lte(orbitRadius)) {
              this.createOrbit(system, altitude)
            }
          } else {
            this.createOrbit(system, altitude)
          }
        }
      })
    },
    processSystem: function (allSystemsObject, newSystem, newSystemName) {
      if (u.defined(allSystemsObject[newSystemName])) {
        return console.error(this.temp++, 'duplicate body name in system', newSystemName)
      }

      this.$set(allSystemsObject, newSystemName, newSystem)

      // create an alias for the primary system object
      newSystem.primary = { object: newSystem.object }

      if (u.defined(newSystem.eccentricity)) {
        // compute semiMinorAxis
        newSystem.semiMinorAxis = OM.semiMinorAxis(newSystem.semiMajorAxis, newSystem.eccentricity)
        // compute meanRadius of orbit
        newSystem.meanRadius = OM.meanRadius(newSystem.semiMajorAxis, newSystem.semiMinorAxis)
      }

      if (u.defined(newSystem.children)) {
        // process children
        Object.keys(newSystem.children).forEach(name => {
          const child = newSystem.children[name]

          if (u.defined(child.object)) {
            this.createSOIOrbit(child, newSystem.object.mass)
            // if an object does not have an SOI it is because
            // the theoretical SOI would be within the radius of the body
            // ie no stable orbits are possible for this body
            // so don't try to create any
            if (u.allDefined(child, 'children', 'soi')) {
              this.createSyncOrbit(child)
              this.createVariousOrbits(child)
              this.processSystem(allSystemsObject, child, name)
            }
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
        if (u.allDefined(this.currentSystem, 'children', name, 'semiMajorAxis')) {
          const radius = this.currentSystem.children[name].semiMajorAxis
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
      children: {
        venus: {
          object: {
            atmosphere: {
              karman: '280e3'
            },
            type: 'body-planet-rocky'
          }
        },
        earth: {
          object: {
            atmosphere: {
              karman: '100e3'
            },
            type: 'body-planet-rocky'
          }
        },
        mars: {
          object: {
            atmosphere: {
              karman: '80e3'
            },
            type: 'body-planet-rocky'
          }
        },
        jupiter: {
          object: {
            atmosphere: {
              karman: '500e3'
            },
            type: 'body-planet-gas'
          }
        },
        saturn: {
          object: {
            atmosphere: {
              karman: '500e3'
            },
            type: 'body-planet-gas'
          },
          children: {
            titan: {
              object: {
                atmosphere: {
                  karman: '50e3'
                }
              }
            }
          }
        },
        uranus: {
          object: {
            atmosphere: {
              karman: '500e3'
            },
            type: 'body-planet-gas'
          }
        },
        neptune: {
          object: {
            atmosphere: {
              karman: '500e3'
            },
            type: 'body-planet-gas'
          }
        }
      }
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
  position: relative
  letter-spacing: .1em
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

.about-dialog
  &__body.v-card
    p,ul,ol
      letter-spacing: .1em
  &__button.v-btn
    &.theme--dark.v-btn
      color: rgba(255,255,255,.2)
      transition: color .1s, border-color .1s
      &:hover
        color: rgba(255,255,255,1)
    position: absolute
    right: 0
    top: 0

.velocity-display--total-dv-required
  box-shadow: 0 0 8px 0 rgba(0,0,0,.2)
</style>
