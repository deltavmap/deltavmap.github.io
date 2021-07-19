<template>
  <div class="hohmann-transfer-calculator">
    <h2>Hohmann Transfer</h2>
    <div class="calculator">
<!--      <v-text-field v-model="primaryBodyMass" label="primary body mass"></v-text-field>-->
      <system-selector label="select system"
                       :initial-system-name="currentSystemName"
                       :systems="systems"
                       v-on:system-name-change="handleSystemNameChange($event)"
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
                         v-on:orbit-value-changed="handleOrbitNameChange('origin', $event)"
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
                         v-on:orbit-value-changed="handleOrbitNameChange('destination', $event)"
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
import axios from 'axios'
import u from '../../utils'
// import Solar from '../../data/systems/solar'
import OM from '../../orital-mechanics'
import OrbitDetails from './OrbitDetails'
import SystemSelector from './SystemSelector'
import HohmannTransferOrbit from './HohmannTransferOrbit'

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
      this.updateURL()
    },
    handleOrbitNameChange: function (orbit, name) {
      if (name) {
        this.orbit[orbit].name = name
        const orbitDetails = this.currentSystem.children[name]
        if (u.defined(orbitDetails)) {
          const radius = orbitDetails.semiMajorAxis
          this.handleOrbitSemiMajorAxisChange(orbit, radius)
        } else {
          console.error('no orbit details for', name)
        }
        this.updateURL()
      } else {
        this.orbit[orbit] = this.createDefaultOrbitObject(orbit)
        this.orbit[orbit].name = name
      }
    },
    handleSystemNameChange: function (newSystemName) {
      if (newSystemName) {
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
        this.updateURL()
      }
    },
    getSystem: function (systemName) {
      if (u.defined(this.systems[systemName])) {
        return this.systems[systemName]
      } else {
        console.error('system name not recognized: ', systemName)
        return false
      }
    },
    updateURL: function () {
      if (u.defined(this.currentSystemName)) {
        let url = '?system=' + this.currentSystemName
        if (this.orbit.origin.name) {
          url += '&origin=' + this.orbit.origin.name
        }
        if (this.orbit.destination.name) {
          url += '&destination=' + this.orbit.destination.name
        }
        window.history.replaceState({}, document.title, url)
      }
    },
    handleDataLoaded: function () {
      this.$set(this, 'currentSystemName', this.$route.query.system || '')
      if (this.currentSystemName) {
        this.$set(this, 'currentSystem', this.getSystem(this.currentSystemName))
      }
      this.handleOrbitNameChange('origin', this.$route.query.origin || '')
      this.handleOrbitNameChange('destination', this.$route.query.destination || '')
    }
  },
  computed: {
    planetMasses: function () { return this.currentSystem.children.map(b => { return b.mass }) }
  },
  mounted () {
    this.handleOrbitNameChange('origin', '')
    this.handleOrbitNameChange('destination', '')
    const planetsApiUrl = 'https://api.le-systeme-solaire.net/rest/bodies?data=id,name,englishName,semimajorAxis,mass,massValue,massExponent,meanRadius,sideralRotation,isPlanet,aroundPlanet,planet,moons,moon'

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
    const planets = []
    const planetsObject = {}
    const planetsFrench = {}
    const moons = []
    const asteroids = []

    axios.get(planetsApiUrl).then(res => {
      const bodies = res.data.bodies
      bodies.forEach(body => {
        const bodyOrbit = {}

        let id = (body.englishName) ? body.englishName : body.name
        id = id.replace(/\s/gi, '').toLowerCase()

        const object = {}
        if (u.allDefinedAndNotNull(body, 'mass', 'massValue') && u.allDefinedAndNotNull(body, 'mass', 'massExponent')) {
          object.mass = body.mass.massValue + 'e' + body.mass.massExponent
        } else {
          console.error('body has no mass value: ', body.name)
          return
        }
        if (u.defined(body.meanRadius)) {
          object.meanRadius = body.meanRadius * 1000
        }
        if (u.defined(body.sideralRotation)) {
          object.siderealRotationPeriod = body.sideralRotation * 3600
        }

        if (u.defined(body.isPlanet)) {
          // handle planet
          if (body.isPlanet === true) {
            // strip numbers from planet name
            id = id.replace(/[^a-zA-Z]/gi, '')
            object.type = 'body-planet'
            planets.push(bodyOrbit)
            planetsObject[id] = bodyOrbit
            planetsFrench[body.id] = bodyOrbit
          } else {
            if (u.definedAndNotNull(body.aroundPlanet) && Object.keys(body.aroundPlanet).length > 0) {
              // handle moon
              object.type = 'body-moon'
              bodyOrbit.parentFrenchId = body.aroundPlanet.planet
              moons.push(bodyOrbit)
            } else {
              // handle asteroid
              object.type = 'body-asteroid'
              asteroids.push(bodyOrbit)
            }
          }
        }
        bodyOrbit.id = id
        bodyOrbit.name = id
        bodyOrbit.frenchId = body.id
        bodyOrbit.object = object
        bodyOrbit.semiMajorAxis = body.semimajorAxis * 1000

        // if the body has moons, record their french Id
        if (u.allDefinedAndNotNull(body, 'moons')) {
          body.moons.forEach(moon => {
            if (u.undefined(bodyOrbit.childrenFrench)) {
              bodyOrbit.childrenFrench = []
            }
            bodyOrbit.childrenFrench.push(moon.moon.toLowerCase())
          })
        }
      })
      // sort the planets in order of size of orbit (distance from sun)
      planets.sort((a, b) => a.semiMajorAxis - b.semiMajorAxis)

      moons.forEach(moon => {
        const planetId = moon.parentFrenchId
        if (u.allDefinedAndNotNull(planetsFrench, planetId, 'name')) {
          // add parent planet name to the moon's name
          moon.name = '' + planetsFrench[planetId].name + ' / ' + moon.name

          // add moons to planets
          const planet = planetsFrench[planetId]
          if (u.undefined(planet.children)) {
            planet.children = {}
          }
          planet.children[moon.id] = moon
        }
      })
      const allBodies = [...planets, ...asteroids]
      system.children = {}
      allBodies.forEach(c => { system.children[c.name] = c })
      console.log('typeof systems', typeof this.systems)
      this.processSystem(this.systems, system, 'sun')
      Object.keys(this.systems).forEach(k => {
        const s = this.getSystem(k)
        console.log(s.name, s.primary.object.mass)
      })
      this.handleDataLoaded()
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
