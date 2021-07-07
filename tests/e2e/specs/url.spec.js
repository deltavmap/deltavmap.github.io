describe('url tests', function () {
  it('should allow user to navigate between systems by URL', function () {

    // check that the default loads the solar system
    browser.url('/')
    const earth = $('#Earth')
    expect(earth).toExist()

    // check that the Kerbol system can be accessed via URL
    browser.url('/system/kerbol')
    const kerbin = $('#Kerbin')
    expect(kerbin).toExist()

    // check that the Solar system can be accessed via URL
    // (and implicitly test that capitalization does not matter)
    browser.url('/system/SOLAR')
    const earth2 = $('#Earth')
    expect(earth2).toExist()

    // test that an invalid system name leads to the system not found page
    browser.url('/system/SOLARfoo')
    const earth3 = $('#Earth')
    expect(earth3.error.error).toEqual('no such element')
    const mainMessage = $('.main-message')
    expect(mainMessage).toHaveText('system "SOLARfoo" not recognized')

    // test that the home button works on the system not found page
    const homeButton = $('.home-button')
    expect(homeButton).toBeClickable()
    homeButton.click()
    expect($('.panel-select--system-change')).toExist()
  })
})
