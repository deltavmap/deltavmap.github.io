// values are given in units acceptable to decimal.js
// distance values are specified in meters
// weight values are specified in kilograms
export default {
  name: 'sun',
  object: {
    mass: '1.988e30',
    type: 'body-star',
    meanRadius: '695.700e6'
  },
  children: [
    {
      name: 'venus',
      object: {
        type: 'body-planet',
        mass: '4.867e24',
        meanRadius: '6.0518e6'
      },
      meanRadius: '108.21e9'
    },
    {
      name: 'earth',
      object: {
        type: 'body-planet',
        mass: '5.972e24',
        meanRadius: '6.378e6'
      },
      meanRadius: '149.60e9',
      children: [
        {
          name: 'moon',
          object: {
            type: 'body-planet',
            mass: '7.342e22',
            meanRadius: '1737.4e3'
          },
          meanRadius: '385e6'
        },
        {
          name: 'LEO-100',
          meanRadius: '6.478e6'
        },
        {
          name: 'LEO-400',
          meanRadius: '6.778e6'
        },
        {
          name: 'GEO',
          meanRadius: '42.164e6'
        }
      ]
    },
    {
      name: 'mars',
      object: {
        type: 'body-planet',
        mass: '6.417e23'
      },
      meanRadius: '228.9e9'
    }
  ]
}
