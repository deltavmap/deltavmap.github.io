export default {
  applyPositionData: function (deltaVMap, locations) {
    // specify the logical positions of locations
    // these will then be translated to pixel coordintates later

    const planetXL = -3
    const planetXR = 3

    const incY = (x = 1) => {
      deltaVMap.map.currentY += x
      return deltaVMap.map.currentY
    }
    const lOrbitXL = -2
    const lOrbitXR = 2
    const captureXL = -1
    const captureXR = 1
    const transferX = 0

    const c = (nodeId, x, y) => {
      const location = locations[nodeId.toLowerCase()]
      location.position = { x, y }
    }
    incY()
    c('Sun', 0, deltaVMap.map.currentY)
    // c('Test', 0), -1)
    c('LSunO', 0, incY())
    c('SunT', 0, incY())

    c('Mercury', planetXL, incY())
    c('LMercuryO', lOrbitXL, deltaVMap.map.currentY)
    c('MercuryCE', captureXL, deltaVMap.map.currentY)
    c('MercuryT', transferX, deltaVMap.map.currentY)

    c('Venus', planetXR, incY())
    c('LVenusO', lOrbitXR, deltaVMap.map.currentY)
    c('VenusCE', captureXR, deltaVMap.map.currentY)
    c('VenusT', transferX, deltaVMap.map.currentY)

    const moonXCol = -2
    const moonX = moonXCol
    const earthY = incY()
    const moonLY = incY()
    const moonXDelta = 0.3
    c('MoonT', moonX, earthY)
    c('EarthMoonL1', moonXCol + moonXDelta, moonLY)
    c('EarthMoonL2', moonXCol + 3 * moonXDelta, moonLY)
    c('MoonCE', moonXCol - moonXDelta, moonLY)
    c('LMoonO', moonX, incY())
    c('NRHO', moonXCol - 3 * moonXDelta, moonLY)
    c('Moon', moonX, incY())

    c('EarthCE', -1, earthY)
    c('GEO', moonXCol - 1, earthY - 1)
    c('GTO', moonXCol - 1, earthY)
    c('LEO', moonXCol - 2, earthY)
    c('Earth', moonXCol - 3, earthY)

    const marsY = earthY + 1

    const vestaY = incY()
    c('VestaT', 0, vestaY)
    c('VestaCE', captureXL, vestaY)
    c('LVestaO', lOrbitXL, vestaY)
    c('Vesta', planetXL, vestaY)

    const ceresY = incY()
    c('CeresT', 0, ceresY)
    c('CeresCE', captureXR, ceresY)
    c('LCeresO', lOrbitXR, ceresY)
    c('Ceres', planetXR, ceresY)

    incY()
    deltaVMap.map.planetXR = 0
    deltaVMap.map.currentY = marsY
  },
  getLocations: function () {
    const array = [
      { id: 'Sun', label: 'Sun', nodeType: 'body', parent: 'MilkyWay', color: '#ffc' },
      { id: 'LSunO', label: 'Low Sun Orbit', nodeType: 'orbit', parent: 'Sun', altitude: '10000' },
      { id: 'SunT', label: 'Sun Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

      { id: 'Mercury', label: 'Mercury', nodeType: 'body', parent: 'Sun', color: '#7E7878' },
      { id: 'LMercuryO', label: 'Low Mercury Orbit', nodeType: 'orbit', parent: 'Mercury', altitude: '100' },
      { id: 'MercuryCE', label: 'Mercury Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Mercury' },
      { id: 'MercuryT', label: 'Mercury Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

      { id: 'Venus', label: 'Venus', nodeType: 'body', parent: 'Sun', color: '#D7C9AF', atmosphere: true },
      { id: 'LVenusO', label: 'Low Venus Orbit', nodeType: 'orbit', parent: 'Venus', altitude: '400' },
      { id: 'VenusCE', label: 'Venus Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Venus' },
      { id: 'VenusT', label: 'Venus Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

      { id: 'Earth', label: 'Earth', nodeType: 'body', parent: 'Sun', color: '#539DE4', atmosphere: true },
      { id: 'LEO', label: 'Low Earth Orbit', nodeType: 'orbit', parent: 'Earth', altitude: 250 },
      { id: 'GTO', label: 'Geostationary Transfer Orbit', nodeType: 'orbit-transfer', parent: 'Earth' },
      { id: 'GEO', label: 'Geostationary Earth Orbit', nodeType: 'orbit-stationary', parent: 'Earth' },
      { id: 'EarthCE', label: 'Earth Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Earth' },
      { id: 'MoonT', label: 'Moon Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

      { id: 'Moon', label: 'Moon', nodeType: 'body', parent: 'Earth', color: '#aaa' },
      { id: 'LMoonO', label: 'Low Moon Orbit', nodeType: 'orbit', parent: 'Moon' },
      { id: 'MoonCE', label: 'Moon Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Moon' },
      { id: 'EarthMoonL1', label: 'Earth Moon L1', nodeType: 'orbit-l1', parent: 'Moon' },
      { id: 'EarthMoonL2', label: 'Earth Moon L2', nodeType: 'orbit-l2', parent: 'Moon' },
      { id: 'NRHO', label: 'Near Rectilinear Halo Orbit', nodeType: 'orbit-nrho', parent: 'Moon' },

      { id: 'Vesta', label: 'Vesta', nodeType: 'body', parent: 'Sun', color: 'grey' },
      { id: 'LVestaO', label: 'Low Vesta Orbit', nodeType: 'orbit', parent: 'Vesta', altitude: 20 },
      { id: 'VestaCE', label: 'Vesta Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Vesta' },
      { id: 'VestaT', label: 'Vesta Transfer', nodeType: 'orbit-transfer', parent: 'Sun' },

      { id: 'Ceres', label: 'Ceres', nodeType: 'body', parent: 'Sun', color: 'grey' },
      { id: 'LCeresO', label: 'Low Ceres Orbit', nodeType: 'orbit', parent: 'Ceres', altitude: 20 },
      { id: 'CeresCE', label: 'Ceres Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Ceres' },
      { id: 'CeresT', label: 'Ceres Transfer', nodeType: 'orbit-transfer', parent: 'Sun' }
    ]

    // convert array to object
    const object = {}
    array.map(node => {
      object[node.id.toLowerCase()] = node
    })

    return object
  },
  getDeltas: function () {
    return [
      ['LSunO', 'Sun', 440, 0],
      ['SunT', 'LSunO', 178, 0],
      ['SunT', 'MercuryT', 15.74, 0],

      ['LMercuryO', 'Mercury', 3.06, 0],
      ['MercuryCE', 'LMercuryO', 1.22, 0],
      ['MercuryT', 'MercuryCE', 6.31, 0],

      ['MercuryT', 'VenusT', 2.06, 1],
      ['LVenusO', 'Venus', 27, 1],
      ['VenusCE', 'LVenusO', 2.94, 0],
      ['VenusT', 'VenusCE', 0.36, 1],

      ['LEO', 'Earth', 9, 1],
      ['GTO', 'LEO', 2.44, 0],
      ['GEO', 'GTO', 1.47, 0],
      ['MoonT', 'GTO', 0.68, 0],
      ['EarthCE', 'MoonT', 0.09, 0],
      ['VenusT', 'EarthCE', 0.28, 2],

      ['LMoonO', 'Moon', 1.72, 0],
      ['MoonCE', 'LMoonO', 0.68, 0],
      ['MoonT', 'MoonCE', 0.14, 0],
      ['MoonT', 'EarthMoonL1', 0.58, 0],
      ['MoonT', 'EarthMoonL2', 0.35, 0],
      ['EarthMoonL1', 'LMoonO', 0.64, 0],
      ['EarthMoonL2', 'LMoonO', 0.64, 0],
      ['LMoonO', 'NRHO', 0.73, 0],
      ['MoonT', 'NRHO', 0.83, 0],

      ['LVestaO', 'Vesta', 0.16, 0],
      ['VestaCE', 'LVestaO', 0.1, 0],
      ['VestaT', 'VestaCE', 4.11, 0],

      ['LCeresO', 'Ceres', 0.27, 0],
      ['CeresCE', 'LCeresO', 0.15, 0],
      ['CeresT', 'CeresCE', 4.39, 0],

      ['VestaT', 'MarsT', 0.92, 0],
      ['CeresT', 'VestaT', 0.38]
    ]
  },
  createPlanetSystems: function (deltaVMap) {
    const marsX = deltaVMap.map.planetXR
    const marsY = deltaVMap.map.currentY
    deltaVMap.createPlanetSystem(
      'Mars',
      false,
      true,
      'EarthCE',
      true,
      0.39,
      0.67,
      'orange',
      [
        [0.34, 'Deimos', 0.65, 0.002, 1, 0.004],
        [0.4, 'Phobos', 0.54, 0.003, 1, 0.005]
      ],
      0.7, 200, 3.6,
      marsX, marsY, 0
    )

    const jupiterX = marsX
    const jupiterY = marsY + 5
    deltaVMap.createPlanetSystem(
      'Jupiter',
      true,
      true,
      'CeresT',
      false,
      1.4,
      0.27,
      'orange',
      [
        [0.19, 'Himalia', 2.87, 0.02, 5, 0.04],
        [0.93, 'Calisto', 4.03, 0.7, 100, 1.75],
        [0.8, 'Ganymede', 4.79, 0.79, 100, 1.95],
        [1.06, 'Europa', 5.92, 0.58, 100, 1.44],
        [1.56, 'Io', 5.79, 0.73, 100, 1.78],
        [4.65, 'Almathea', 6.31, 0.01, 10, 0.02]
      ],
      8.02, 2000, 33,
      jupiterX, jupiterY, 1
    )
    const saturnX = jupiterX
    const saturnY = jupiterY + 1
    deltaVMap.createPlanetSystem(
      'Saturn',
      false,
      true,
      'JupiterT',
      true,
      0.99,
      0.42,
      'burlywood',
      [
        [0.3, 'Iapetus', 2.16, 0.16, 50, 0.41],
        [0.56, 'Titan', 2.2, 0.66, 1000, 7.6, 1, true],
        [1.04, 'Rhea', 4.01, 0.18, 50, 0.45],
        [0.67, 'Dione', 4.23, 0.14, 50, 0.36],
        [0.62, 'Tethys', 4.29, 0.11, 50, 0.27],
        [0.64, 'Enceladus', 4.27, 0.07, 20, 0.16],
        [0.87, 'Mimas', 4.02, 0.04, 20, 0.1]
      ],
      5.52, 2000, 19,
      saturnX, saturnY, 0
    )
    const uranusX = jupiterX
    const uranusY = saturnY + 3
    deltaVMap.createPlanetSystem(
      'Uranus',
      true,
      true,
      'SaturnT',
      true,
      0.69,
      0.51,
      '#C6ECEF',
      [
        [0.46, 'Oberon', 1.63, 0.21, 50, 0.53],
        [0.15, 'Titania', 1.78, 0.22, 50, 0.56],
        [0.36, 'Umbriel', 2.24, 0.15, 50, 0.37],
        [0.35, 'Ariel', 2.31, 0.16, 50, 0.39],
        [0.55, 'Miranda', 2.61, 0.05, 20, 0.13]
      ],
      4.26, 1000, 15,
      uranusX, uranusY, 2
    )

    const neptuneX = jupiterX
    const neptuneY = uranusY + 1
    deltaVMap.createPlanetSystem(
      'Neptune',
      false,
      true,
      'UranusT',
      true,
      0.27,
      0.35,
      '#66A4FE',
      [
        [0.05, 'Nereid', 0.87, 0.04, 10, 0.09],
        [0.74, 'Triton', 1.71, 0.41, 100, 1.05],
        [1.38, 'Proteus', 2.9, 0.05, 20, 0.11]
      ],
      4.58, 1000, 16,
      neptuneX, neptuneY, 4
    )

    const plutoX = jupiterX
    const plutoY = neptuneY + 3
    deltaVMap.createPlanetSystem(
      'Pluto',
      true,
      false,
      'NeptuneT',
      true,
      0.11,
      2.7,
      '#372614',
      [
        [0.04, 'Charon', 0.02, 0.16, 50, 0.42]
      ],
      0.31, 100, 0.89,
      plutoX, plutoY, 6
    )

    const haumeaX = jupiterX
    const haumeaY = plutoY + 1
    deltaVMap.createPlanetSystem(
      'Haumea',
      false,
      false,
      'PlutoT',
      false,
      0.03,
      2.92,
      'grey',
      [],
      0.21, 50, 0.1,
      haumeaX, haumeaY, 7
    )

    const makemakeX = jupiterX
    const makemakeY = haumeaY + 1
    deltaVMap.createPlanetSystem(
      'Makemake',
      false,
      false,
      'HaumeaT',
      false,
      0.02,
      2.86,
      'grey',
      [],
      0.21, 50, 0.36,
      makemakeX, makemakeY, 7
    )
  },
  systemName: 'Solar',
  star: 'Sun'
}
