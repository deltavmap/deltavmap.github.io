describe('smoke tests', function () {
  beforeEach(function () {
    browser.url('/')
  })
  it('should have the right title', function () {
    expect(browser).toHaveTitle('DELTA V MAP')
  })

  it('should have a sun', function () {
    const sunIcon = $('#Sun.location')
    expect(sunIcon).toExist()
  })

  it('should have an Earth', function () {
    const earthIcon = $('#Earth.location')
    expect(earthIcon).toExist()
  })
})

describe('map', function () {
  beforeEach(function () {
    browser.url('/')
  })

  it('should allow path to be selected', function () {
    const earth = $('#Earth')
    const moon = $('#Moon')
    const earthIcon = $('#Earth.location .click-target')
    const moonIcon = $('#Moon.location .click-target')
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
    expect(aerobraking).toHaveText('UNAVAILABLE')

    // const buttons = $$('.v-btn__content')
    // expect(buttons).toExist()

    const reverseButton = $('.button-reverse')
    expect(reverseButton).toExist()
    expect(reverseButton).toHaveText('REVERSE')
    reverseButton.click()
    expect(aerobraking).toHaveText('AVAILABLE')
  })

  // should allow aerobraking when entering system where the system main body has an atmosphere
  it('should allow different system aerobraking', function () {
    const deimos = $('#Deimos')
    const moon = $('#Moon')
    const deimosIcon = $('#Deimos.location .click-target')
    const moonIcon = $('#Moon.location .click-target')
    const aerobraking = $('.control--aerobraking .control__value')
    expect(deimos).toExist()
    expect(moon).toExist()
    expect(deimosIcon).toExist()
    expect(moonIcon).toExist()
    expect(aerobraking).toExist()

    expect(aerobraking).toHaveText('')

    moonIcon.scrollIntoView(moonIcon)
    expect(moonIcon).toBeClickable()
    moonIcon.click()

    deimosIcon.scrollIntoView(deimosIcon)
    expect(deimosIcon).toBeClickable()
    deimosIcon.click()

    expect(aerobraking).toHaveText('available'.toUpperCase())
  })

  // should not allow aerobraking when entering system where the system main body has no atmosphere
  it('should not allow different system aerobraking', function () {
    const mercury = $('#Mercury')
    const moon = $('#Moon')
    const mercuryIcon = $('#Mercury.location .click-target')
    const moonIcon = $('#Moon.location .click-target')
    const aerobraking = $('.control--aerobraking .control__value')
    expect(mercury).toExist()
    expect(moon).toExist()
    expect(mercuryIcon).toExist()
    expect(moonIcon).toExist()
    expect(aerobraking).toExist()

    expect(aerobraking).toHaveText('')

    moonIcon.scrollIntoView(moonIcon)
    expect(moonIcon).toBeClickable()
    moonIcon.click()

    mercuryIcon.scrollIntoView(mercuryIcon)
    expect(mercuryIcon).toBeClickable()
    mercuryIcon.click()

    expect(aerobraking).toHaveText('unavailable'.toUpperCase())
  })

  // TODO test click label
  // TODO test phone
  // TODO test low orbit exists
  // TODO test transfer orbit exists
  // TODO test capture/escape orbit exists
  // TODO test all elements of generated planet system
  // TODO test clear button
  // TODO test reverse button
  // TODO test about button
})
