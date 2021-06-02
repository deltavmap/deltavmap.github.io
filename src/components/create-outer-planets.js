export default function (deltaVMap) {
  console.log('data() creating jupiterSystem')
  const jupiterX = deltaVMap.planetX
  const jupiterY = deltaVMap.planetY
  deltaVMap.jupiterSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Jupiter',
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
  deltaVMap.addFixedNodeConstraints(deltaVMap.jupiterSystem.positionConstraints)

  const saturnX = jupiterX
  const saturnY = deltaVMap.planetY - (4 * deltaVMap.planetYDelta)
  deltaVMap.saturnSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Saturn',
    true,
    'JupiterT',
    true,
    0.99,
    0.42,
    'burlywood',
    [
      [0.3, 'Iapetus', 2.16, 0.16, 50, 0.41],
      [0.56, 'Titan', 2.2, 0.66, 1000, 7.6, 1],
      [1.04, 'Rhea', 4.01, 0.18, 50, 0.45],
      [0.67, 'Dione', 4.23, 0.14, 50, 0.36],
      [0.62, 'Tethys', 4.29, 0.11, 50, 0.27],
      [0.64, 'Enceladus', 4.27, 0.07, 20, 0.16],
      [0.87, 'Mimas', 4.02, 0.04, 20, 0.1]
    ],
    5.52, 2000, 19,
    saturnX, saturnY, 0
  )
  deltaVMap.addFixedNodeConstraints(deltaVMap.saturnSystem.positionConstraints)

  const uranusX = jupiterX
  const uranusY = saturnY - (4 * deltaVMap.planetYDelta)
  deltaVMap.uranusSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Uranus',
    true,
    'SaturnT',
    true,
    0.69,
    0.51,
    '#C6ECEF',
    [
      [0.46, 'Oberon', 1.63, 0.21, 50, 0.53],
      [0.15, 'Titania', 1.78, 0.22, 50, 56],
      [0.36, 'Umbriel', 2.24, 0.15, 50, 0.37],
      [0.35, 'Ariel', 2.31, 0.16, 50, 0.39],
      [0.55, 'Miranda', 2.61, 0.05, 20, 0.13]
    ],
    4.26, 1000, 15,
    uranusX, uranusY, 2
  )
  deltaVMap.addFixedNodeConstraints(deltaVMap.uranusSystem.positionConstraints)

  const neptuneX = jupiterX
  const neptuneY = uranusY - (4 * deltaVMap.planetYDelta)
  deltaVMap.neptuneSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Neptune',
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
  deltaVMap.addFixedNodeConstraints(deltaVMap.neptuneSystem.positionConstraints)

  const plutoX = jupiterX
  const plutoY = neptuneY - (4 * deltaVMap.planetYDelta)
  deltaVMap.plutoSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Pluto',
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
  deltaVMap.addFixedNodeConstraints(deltaVMap.plutoSystem.positionConstraints)

  const haumeaX = jupiterX
  const haumeaY = plutoY - deltaVMap.planetYDelta
  deltaVMap.haumeaSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Haumea',
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
  deltaVMap.addFixedNodeConstraints(deltaVMap.haumeaSystem.positionConstraints)

  const makemakeX = jupiterX
  const makemakeY = haumeaY - deltaVMap.planetYDelta
  deltaVMap.makemakeSystem = deltaVMap.createOuterPlanetMoonSystem(
    'Makemake',
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
  deltaVMap.addFixedNodeConstraints(deltaVMap.makemakeSystem.positionConstraints)
}
