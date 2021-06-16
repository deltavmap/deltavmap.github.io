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
  c('Sun', col(0), deltaVMap.planetY)
  c('LSunO', col(0), incY())
  c('SunT', col(0), incY())

  c('Merc', planetXL, incY())
  c('LMercO', lOrbitXL, deltaVMap.planetY)
  c('MercCE', captureXL, deltaVMap.planetY)
  c('MercT', transferX, deltaVMap.planetY)

  c('Venus', planetXR, incY())
  c('LVenusO', lOrbitXR, deltaVMap.planetY)
  c('VenusCE', captureXR, deltaVMap.planetY)
  c('VenusT', transferX, deltaVMap.planetY)

  const moonX = col(-2)
  const earthY = incY()
  const moonLY = incY()
  c('MoonT', moonX, earthY)
  c('EarthMoonL1', col(-3), moonLY)
  c('EarthMoonL2', col(-1), moonLY)
  c('MoonCE', moonX, deltaVMap.planetY)
  c('LMoonO', moonX, incY())
  c('NRHOT', col(-3), deltaVMap.planetY)
  c('NRHO', col(-4), deltaVMap.planetY)
  c('Moon', moonX, incY())

  c('EarthCE', col(-1), earthY)
  c('GEO', col(-3), earthY - deltaVMap.planetYDelta)
  c('GTO', col(-3), earthY)
  c('LEO', col(-4), earthY)
  c('Earth', col(-5), earthY)

  deltaVMap.marsY = earthY + deltaVMap.planetYDelta

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
}
