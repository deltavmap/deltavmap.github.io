import axios from 'axios'
import u from './utils'
export default {
  getPlanetData: function (system, callback) {
    const planets = []
    const planetsObject = {}
    const planetsFrench = {}
    const moons = []
    const asteroids = []
    const planetsApiUrl = 'https://api.le-systeme-solaire.net/rest/bodies?data=id,name,englishName,semimajorAxis,mass,massValue,massExponent,meanRadius,sideralRotation,isPlanet,aroundPlanet,planet,moons,moon'
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
          // don't record bodies that have no mass value
          return
        }
        // set the body mean radius
        if (u.defined(body.meanRadius)) {
          object.meanRadius = body.meanRadius * 1000
        }
        // set the body sidereal rotation period
        if (u.defined(body.sideralRotation)) {
          object.siderealRotationPeriod = body.sideralRotation * 3600
        }

        if (u.defined(body.isPlanet)) {
          // handle planet body
          if (body.isPlanet === true) {
            // strip numbers from planet name
            id = id.replace(/[^a-zA-Z]/gi, '')
            object.type = 'body-planet-rocky'
            planets.push(bodyOrbit)
            planetsObject[id] = bodyOrbit
            planetsFrench[body.id] = bodyOrbit
          } else {
            if (u.definedAndNotNull(body.aroundPlanet) && Object.keys(body.aroundPlanet).length > 0) {
              // handle moon body
              object.type = 'body-moon'
              bodyOrbit.parentFrenchId = body.aroundPlanet.planet
              moons.push(bodyOrbit)
            } else {
              // handle asteroid body
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
            u.setIfUndefined(bodyOrbit, 'childrenFrench', [])
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
          u.setIfUndefined(planet, 'children', {})
          planet.children[moon.id] = moon
        }
      })
      const allBodies = [...planets, ...asteroids]
      u.setIfUndefined(system, 'children', {})

      // merge the pre-existing planet data into the API planet data
      allBodies.forEach(body => {
        system.children[body.name] = u.deepMerge(body, system.children[body.name])
      })
      callback()
    })
  }
}
