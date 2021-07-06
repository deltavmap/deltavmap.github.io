class App {
  /**
   * elements
   */
  get heading () { return $('h1') }
  // get title () { return $('.site-icon') }

  /**
   * methods
   */
  open (path = '/') {
    browser.url(path)
  }
}

module.exports = new App()
