describe('app', function () {
  beforeEach(function () {
    browser.url('/')
  })
  it('should have the right title', function () {
    expect(browser).toHaveTitle('delta v map'.toUpperCase())
  })
})

describe('map', function () {
  it('should have a sun', function () {
    const sun = $('#Sun')
    expect(sun).toExist()
  })

  it('should have an Earth', function () {
    const earth = $('#Earth')
    expect(earth).toExist()
  })

  it('should allow path to be selected', function () {
    const earth = $('#Earth')
    const moon = $('#Moon')
    const earthIcon = $('#Earth .location__icon')
    const moonIcon = $('#Moon .location__icon')
    const origin = $('.control--origin .control__value')
    const destination = $('.control--destination .control__value')
    const deltaV = $('.control--delta-v .control__value')
    const aerobraking = $('.control--aerobraking .control__value')
    expect(earth).toExist()
    expect(moon).toExist()
    expect(earthIcon).toExist()
    expect(moonIcon).toExist()
    expect(origin).toExist()
    expect(destination).toExist()
    expect(deltaV).toExist()
    expect(aerobraking).toExist()

    expect(origin).toHaveText('')
    expect(destination).toHaveText('')
    expect(deltaV).toHaveText('')
    expect(aerobraking).toHaveText('')

    earthIcon.scrollIntoView(earthIcon)
    expect(earth).toBeClickable()
    earthIcon.click()
    expect(origin).toHaveText('Earth')
    expect(destination).toHaveText('')
    expect(deltaV).toHaveText('')
    expect(aerobraking).toHaveText('')

    moonIcon.scrollIntoView(moonIcon)
    expect(moonIcon).toBeClickable()
    moonIcon.click()
    expect(origin).toHaveText('Earth')
    expect(destination).toHaveText('Moon')
    expect(deltaV).toHaveText('14.660 km/s')
    expect(aerobraking).toHaveText('unavailable'.toUpperCase())
  })
})
