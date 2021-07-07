describe('url tests', function () {
  it('Default should be solar system', function () {
    browser.url('/')
    const earth = $('#Earth')
    expect(earth).toExist()
  })
  it('Kerbol system can be accessed via URL', function () {
    browser.url('/?system=kerbol')
    const kerbin = $('#Kerbin')
    expect(kerbin).toExist()
  })
  it('Solar system can be accessed via URL', function () {
    // (and implicitly test that capitalization does not matter)
    browser.url('/?system=SOLAR')
    const earth2 = $('#Earth')
    expect(earth2).toExist()
  })
  it('Invalid system name leads to the system not found page', function () {
    browser.url('/?system=SOLARfoo')
    const earth3 = $('#Earth')
    expect(earth3.error.error).toEqual('no such element')
    const mainMessage = $('.main-message')
    expect(mainMessage).toHaveText('system "SOLARfoo" not recognized')
  })
  it('Home link works on the system not found page', function () {
    const homeButton = $('.home-button')
    expect(homeButton).toBeClickable()
    homeButton.click()
    expect($('.panel-select--system-change')).toExist()
  })

  it('Origin query parameter works', function () {
    browser.url('/?system=Solar&origin=Mercury')
    const mercury = $('#Mercury')
    expect(mercury).toExist()
    const controlOriginValue = $('.control--origin .control__value')
    expect(controlOriginValue).toExist()
    expect(controlOriginValue).toHaveText('Mercury')
  })

  it('Origin and destination query parameter works', function () {
    browser.url('/?system=Kerbol&origin=Jool&destination=Moho')
    const jool = $('#Jool')
    expect(jool).toExist()
    const controlOriginValue = $('.control--origin .control__value')
    expect(controlOriginValue).toExist()
    expect(controlOriginValue).toHaveText('Jool')

    const moho = $('#Moho')
    expect(moho).toExist()
    const controlDestinationValue = $('.control--destination .control__value')
    expect(controlDestinationValue).toExist()
    expect(controlDestinationValue).toHaveText('Moho')
  })
})
