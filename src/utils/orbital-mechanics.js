import Decimal from 'decimal.js'
Decimal.set({ precision: 10 })
const d = Decimal
const gravitationalConstant = d('6.674e-11')
const pi = Decimal.acos(-1)
const constants = {
  G: gravitationalConstant,
  pi
}
class OrbitalMechanics {
  /**
   * @param semiMajAxis - ie the 'larger radius' or the ellipse of bodyA
   * @param massA - mass of bodyA in KG eg. Earth
   * @param massB - mass of bodyA in KG eg. Sun
   * @returns {Decimal}
   */
  static sphereOfInfluence (semiMajAxis, massA, massB) {
    // sphere of influence of body in meters
    return d(massA)
      .div(massB)
      .pow(2 / 5)
      .times(semiMajAxis)
  }

  static escapeVelocity (bodyMassKg, bodyRadiusKm) {
    const escapeVelocity = constants.G
      .times(bodyMassKg)
      .dividedBy(bodyRadiusKm.times('1000'))
      .times(2)
      .squareRoot()
      .dividedBy(1000).toFixed(3)
    return escapeVelocity
  }

  static orbitMeanVelocity (radius, bodyMassKg) {
    // multiply the gravitational constant G by the mass of the body
    const gTimesM = constants.G.times(bodyMassKg)

    // divide this by the effective radius
    const fraction = gTimesM.div(radius)

    // find the square root of all of this to give the velocity in meters per second
    const metersSecond = fraction.sqrt()

    return metersSecond
  }

  static orbitalMeanVelocity (bodyRadius, altitude, bodyMassKg) {
    // calculate the effective radius (body radius + altitude above surface)
    const effectiveRadius = bodyRadius.add(altitude)
    return OrbitalMechanics.orbitMeanVelocity(effectiveRadius, bodyMassKg)
  }

  static transferOrbitSemiMajorAxis (radius1, radius2) {
    return d(radius1).add(d(radius2)).div(2)
  }

  /**
   * @param commonBodyMass - eg the mass of the Sun
   * @param orbitSemiMajorAxisM - eg the SMA of the transfer orbit from Earth to Mars
   * @returns {Decimal} - the period, ie the length of time in seconds for one cycle of the transfer orbit
   */
  static periodOfOrbit (commonBodyMass, orbitSemiMajorAxisM) {
    const piSquared = pi.pow(2)
    const fourTimesPiSquared = d(4).times(piSquared)
    const transferCubed = d(orbitSemiMajorAxisM).pow(3)
    const GM = d(commonBodyMass).times(constants.G)
    const periodSquared = fourTimesPiSquared
      .times(transferCubed)
      .div(GM)
    const period = periodSquared.pow(1 / 2)
    return period
  }

  static semiMajorAxis (period, combinedMass) {
    const periodSquared = d(period).pow(2)
    const GM = d(constants.G).times(combinedMass)
    const fourPiSquared = pi.pow(2).times(4)
    const fraction = periodSquared.times(GM).div(fourPiSquared)
    const cubeRoot = fraction.pow(1 / 3)
    return cubeRoot
  }

  static semiMinorAxis (semiMajorAxis, eccentricity) {
    const smaSquared = d(semiMajorAxis).pow(2)
    const eccSquared = d(eccentricity).pow(2)
    const minorSquared = smaSquared.times(eccSquared).minus(1)
    const minor = minorSquared.pow(0.5)
    return minor
  }

  static meanRadius (semiMajorAxis, semiMinorAxis) {
    return d(semiMajorAxis).times(2).plus(semiMinorAxis).div(3)
  }

  static velocityAtRadius (semiMajorAxis, orbitPeriod, smallerOrbitMeanRadius) {
    // V(perihelion) = (2?? x a(transfer) / P(transfer) ) x ???( (2a(transfer) / R1) - 1)
    const twoPi = pi.times(2)
    const left = twoPi
      .times(semiMajorAxis)
      .div(orbitPeriod)

    const right = semiMajorAxis
      .times(2)
      .div(smallerOrbitMeanRadius)
      .minus(1)
      .pow(1 / 2)
    return left.times(right)
  }
}

export default OrbitalMechanics
