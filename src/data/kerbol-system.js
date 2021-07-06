export default {
  applyPositionData: function (deltaVMapPage, locations) {
    // specify the logical positions of locations
    // these will then be translated to pixel coordintates later

    let localY = 0
    const incY = (x = 1) => {
      localY += x
      return localY
    }

    const c = (nodeId, x, y) => {
      const location = locations[nodeId]
      location.position = { x, y }
    }
    incY()
    incY()
    c('Kerbol', 0, incY())
    c('LKerbolO', 0, incY())
    c('KerbolT', 0, incY())

    localY = 7
    const munXCol = 2
    const munX = munXCol
    const minmusX = munX - 1
    const kerbinY = incY()
    const munLO = incY()
    const munY = incY()

    c('MunT', munX, kerbinY)
    c('LMunO', munX, munLO)
    c('Mun', munX, munY)

    c('MinmusT', minmusX, kerbinY)
    c('LMinmusO', minmusX, munLO)
    c('Minmus', minmusX, munY)

    const lkox = munXCol + 1
    c('LKerbinO', lkox, kerbinY)
    c('KKO', lkox, kerbinY - 1)

    c('Kerbin', lkox + 1, kerbinY)
    c('KerbinCE', 0, kerbinY)
  },
  getLocations: function (deltaVMapPage) {
    const array = [
      // kerbol
      { id: 'Kerbol', label: 'Kerbol', nodeType: 'body', parent: 'MilkyWay', color: '#ffc' },
      deltaVMapPage.createLowOrbit('Kerbol', 610),
      { id: 'KerbolT', label: 'Kerbol Transfer', nodeType: 'orbit-transfer', parent: 'Kerbol' },

      // kerbin
      deltaVMapPage.createBody('Kerbin', 'Kerbol', '#59f', true),
      deltaVMapPage.createLowOrbit('Kerbin', 80),
      { id: 'KKO', label: 'Keostationary Kerbin Orbit', nodeType: 'orbit-stationary', parent: 'Kerbin' },
      { id: 'KerbinCE', label: 'Kerbin Capture/Escape', nodeType: 'orbit-capture-escape', parent: 'Kerbin' },

      // mun
      { id: 'MunT', label: 'Mun Transfer', nodeType: 'orbit-transfer', parent: 'Kerbol' },
      deltaVMapPage.createLowOrbit('Mun', 14),
      { id: 'Mun', label: 'Mun', nodeType: 'body', parent: 'Kerbin', color: '#aaa' },

      // minmus
      { id: 'MinmusT', label: 'Minmus Transfer', nodeType: 'orbit-transfer', parent: 'Kerbol' },
      deltaVMapPage.createLowOrbit('Minmus', 10),
      { id: 'Minmus', label: 'Minmus', nodeType: 'body', parent: 'Kerbin', color: '#aaa' }
    ]

    // convert array to object
    const object = {}
    array.map(node => {
      object[node.id] = node
    })

    return object
  },
  getDeltas: function () {
    return [
      ['LKerbolO', 'Kerbol', 67.000, 0],
      ['KerbolT', 'LKerbolO', 13.500, 0],

      ['LKerbinO', 'Kerbin', 3.300, 1],
      ['KKO', 'LKerbinO', 1.115, 0],
      ['MunT', 'LKerbinO', 0.860, 0],
      ['KerbinCE', 'MinmusT', 0.020, 0],
      ['EveT', 'KerbinCE', 0.090, 2],

      ['LMunO', 'Mun', 0.580, 0],
      ['LMunO', 'MunT', 0.310, 0],

      ['LMinmusO', 'Minmus', 0.180, 0],
      ['MinmusT', 'LMinmusO', 0.160, 0],
      ['MinmusT', 'MunT', 0.070, 0]
    ]
  },
  createPlanetSystems: function (deltaVMapPage) {
    const mohoX = deltaVMapPage.map.planetXR
    const mohoY = 6
    deltaVMapPage.createPlanetSystem(
      'Moho',
      false,
      true,
      'KerbolT',
      false,
      3.750,
      null,
      'brown',
      [],
      2.410, 50, 0.870,
      mohoX, mohoY, 1
    )
    const eveX = mohoX
    const eveY = mohoY + 1
    deltaVMapPage.createPlanetSystem(
      'Eve',
      true,
      true,
      'MohoT',
      false,
      0.670,
      0.080,
      'purple',
      [
        { transferDV: 0.060, moonName: 'Gilly', lowOrbitDV: 0.410, lowOrbitAltitude: 10, surfaceDV: 0.030 }
      ],
      1.240, 2000, 8.000,
      eveX, eveY, 1
    )
    const dunaX = eveX
    const dunaY = eveY + 3
    deltaVMapPage.createPlanetSystem(
      'Duna',
      true,
      true,
      'KerbinCE',
      true,
      0.130,
      0.250,
      'orange',
      [
        { transferDV: 0.030, moonName: 'Ike', lowOrbitDV: 0.180, lowOrbitAltitude: 10, surfaceDV: 0.390 }
      ],
      0.330, 60, 1.450,
      dunaX, dunaY, 0
    )

    const dresX = dunaX
    const dresY = dunaY + 1
    deltaVMapPage.createPlanetSystem(
      'Dres',
      false,
      true,
      'DunaT',
      true,
      0.480,
      null,
      'grey',
      [],
      1.290, 12, 0.430,
      dresX, dresY, 0
    )

    const joolX = dresX
    const joolY = dresY + 2
    deltaVMapPage.createPlanetSystem(
      'Jool',
      true,
      true,
      'DresT',
      false,
      0.370,
      0.160,
      'green',
      [
        { transferDV: 0.160, moonName: 'Pol', lowOrbitDV: 0.820, lowOrbitAltitude: 10, surfaceDV: 0.130 },
        { transferDV: 0.060, moonName: 'Bop', lowOrbitDV: 0.900, lowOrbitAltitude: 10, surfaceDV: 0.220 },
        { transferDV: 0.180, moonName: 'Tylo', lowOrbitDV: 1.100, lowOrbitAltitude: 10, surfaceDV: 2.270 },
        { transferDV: 0.220, moonName: 'Vall', lowOrbitDV: 0.910, lowOrbitAltitude: 15, surfaceDV: 0.860 },
        { transferDV: 0.310, moonName: 'Laythe', lowOrbitDV: 1.070, lowOrbitAltitude: 60, surfaceDV: 2.900, hasAtmosphere: true }
      ],
      1.880, 210, 16,
      joolX, joolY, 1
    )

    const eelooX = joolX
    const eelooY = joolY + 1
    deltaVMapPage.createPlanetSystem(
      'Eeloo',
      false,
      false,
      'JoolT',
      true,
      0.11,
      2.7,
      '#372614',
      [],
      0.31, 100, 0.89,
      eelooX, eelooY, 6
    )
  },
  systemName: 'Kerbol',
  star: 'Kerbol'
}
