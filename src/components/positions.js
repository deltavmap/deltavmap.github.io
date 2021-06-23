export default function (deltaVMap, locations) {
  const col = deltaVMap.col
  const planetXL = col(-3)
  const planetXR = col(3)
  const incY = deltaVMap.incPlanetYDelta
  const lOrbitXL = col(-2)
  const lOrbitXR = col(2)
  const captureXL = col(-1)
  const captureXR = col(1)
  const transferX = col(0)

  const c = (nodeId, x, y) => {
    const location = locations[nodeId]
    location.position = { x, y }
  }
  incY()
  c('Sun', col(0), deltaVMap.map.planetY)
  c('LSunO', col(0), incY())
  c('SunT', col(0), incY())

  c('Mercury', planetXL, incY())
  c('LMercuryO', lOrbitXL, deltaVMap.map.planetY)
  c('MercuryCE', captureXL, deltaVMap.map.planetY)
  c('MercuryT', transferX, deltaVMap.map.planetY)

  c('Venus', planetXR, incY())
  c('LVenusO', lOrbitXR, deltaVMap.map.planetY)
  c('VenusCE', captureXR, deltaVMap.map.planetY)
  c('VenusT', transferX, deltaVMap.map.planetY)

  const moonX = col(-3)
  const earthY = incY()
  const moonLY = incY()
  c('MoonT', moonX, earthY)
  c('EarthMoonL1', col(-2.5), moonLY)
  c('EarthMoonL2', col(-1.5), moonLY)
  c('MoonCE', col(-3.5), moonLY)
  c('LMoonO', moonX, incY())
  c('NRHO', col(-4.5), moonLY)
  c('Moon', moonX, incY())

  c('EarthCE', col(-1), earthY)
  c('GEO', col(-4), earthY - deltaVMap.map.planetYDelta)
  c('GTO', col(-4), earthY)
  c('LEO', col(-5), earthY)
  c('Earth', col(-6), earthY)

  const marsY = earthY + deltaVMap.map.planetYDelta

  const vestaY = incY()
  c('VestaT', col(0), vestaY)
  c('VestaCE', captureXL, vestaY)
  c('LVestaO', lOrbitXL, vestaY)
  c('Vesta', planetXL, vestaY)

  const ceresY = incY()
  c('CeresT', col(0), ceresY)
  c('CeresCE', captureXR, ceresY)
  c('LCeresO', lOrbitXR, ceresY)
  c('Ceres', planetXR, ceresY)

  incY()
  deltaVMap.planetXR = 0 // col(8)
  deltaVMap.planetY = marsY
}
