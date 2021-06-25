export default function (deltaVMap) {
  const marsX = deltaVMap.planetXR
  const marsY = deltaVMap.planetY
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
  const jupiterY = deltaVMap.map.planetY
  deltaVMap.jupiterSystem = deltaVMap.createPlanetSystem(
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
  const saturnY = jupiterY + (1 * deltaVMap.map.planetYDelta)
  deltaVMap.saturnSystem = deltaVMap.createPlanetSystem(
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
  const uranusY = saturnY + (3 * deltaVMap.map.planetYDelta)
  deltaVMap.uranusSystem = deltaVMap.createPlanetSystem(
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
  const neptuneY = uranusY + (1 * deltaVMap.map.planetYDelta)
  deltaVMap.neptuneSystem = deltaVMap.createPlanetSystem(
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
  const plutoY = neptuneY + (3 * deltaVMap.map.planetYDelta)
  deltaVMap.plutoSystem = deltaVMap.createPlanetSystem(
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
  const haumeaY = plutoY + deltaVMap.map.planetYDelta
  deltaVMap.haumeaSystem = deltaVMap.createPlanetSystem(
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
  const makemakeY = haumeaY + deltaVMap.map.planetYDelta
  deltaVMap.makemakeSystem = deltaVMap.createPlanetSystem(
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
}
