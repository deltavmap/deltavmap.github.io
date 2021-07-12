// values are given in units acceptable to decimal.js
export default {
  name: 'sun',
  type: 'body-star',
  mass: '1.988e30',
  radius: '695.700e3', // km - equatorial radius
  children: [
    {
      name: 'venus',
      type: 'body-planet',
      mass: '4.867e24', // kg
      radius: '6.0518e6', // m
      orbit: {
        radius: '108.21e9' // m
      }
    },
    {
      name: 'earth',
      type: 'body-planet',
      mass: '5.972e24', // kg
      radius: '6.378e6', // m - mean radius
      orbit: {
        radius: '149.60e9' // m
      },
      children: [
        {
          name: 'moon',
          type: 'body-planet',
          mass: '7.342e22', // kg
          radius: '1737.4e3' // m - mean radius
        }
      ]
    },
    {
      name: 'mars',
      type: 'body-planet',
      mass: '6.417e23', // kg
      orbit: {
        radius: '228.9e9' // m
      }
    }
  ]
}
