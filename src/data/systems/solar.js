/**
 * The following object describes the contents of the Solar system
 *
 * values are given in a format acceptable to decimal.js
 * distance values are specified in meters
 * weight values are specified in kilograms
 */
export default {
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
        type: 'body-planet',
        mass: '48.67e23',
        meanRadius: '6.0518e6',
        siderealRotationPeriod: '-20997360'
      },
      semiMajorAxis: '108.2e9',
      apoapsis: '108.94e9',
      periapsis: '107.48e9'
    },
    earth: {
      object: {
        type: 'body-planet',
        mass: '59.72e23',
        meanRadius: '6.378e6',
        siderealRotationPeriod: '86164.2'
      },
      semiMajorAxis: '149.6e9',
      apoapsis: '152.10e9',
      periapsis: '147.10e9',
      children: {
        moon: {
          object: {
            type: 'body-planet',
            mass: '7.342e22',
            meanRadius: '1737.4e3',
            siderealRotationPeriod: '2360620.8'
          },
          semiMajorAxis: '384.748e6'
        },
        'LEO-100': { semiMajorAxis: '6.478e6' },
        'LEO-400': { semiMajorAxis: '6.778e6' },
        GEO: { semiMajorAxis: '42.164e6' }
      }
    },
    mars: {
      object: {
        type: 'body-planet',
        mass: '6.417e23',
        meanRadius: '3389.5e3'
      },
      semiMajorAxis: '228.9e9',
      children: {
        'low-100': { semiMajorAxis: '3489.5e3' },
        deimos: {
          apoapsis: '23470.9e3',
          periapsis: '23455.5e3',
          semiMajorAxis: '23463.2e3',
          object: {
            mass: '1.4762e15',
            type: 'body-moon',
            meanRadius: '6.2e3'
          }
        },
        phobos: {
          object: {
            mass: '10.659e15',
            meanRadius: '11.2667e3'
          },
          semiMajorAxis: '9376e3'
        }
      }
    },
    jupiter: {
      object: {
        type: 'body-planet',
        mass: '18982e23',
        meanRadius: '69.911e6'
      },
      semiMajorAxis: '778.57e9',
      children: {
        'low-1000': {
          semiMajorAxis: '70.011e6'
        },
        europa: { // TODO fix values
          apoapsis: '23470.9e3',
          periapsis: '23455.5e3',
          semiMajorAxis: '23463.2e3',
          object: {
            mass: '1.4762e15',
            type: 'body-moon',
            meanRadius: '1560.8e3'
          }
        },
        io: { // TODO fix values
          object: {
            mass: '10.659e15',
            meanRadius: '1821.6e3'
          },
          semiMajorAxis: '9376e3'
        }
      }
    }
  }
}
