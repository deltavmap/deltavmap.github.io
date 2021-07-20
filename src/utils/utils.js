class Utils {
  static isUndefined (thing) {
    return typeof thing === 'undefined'
  }

  static undefined (thing) {
    return Utils.isUndefined(thing)
  }

  static isDefined (thing) {
    return !this.isUndefined(thing)
  }

  static defined (thing) {
    return this.isDefined(thing)
  }

  static definedAndNotNull (thing) {
    return this.isDefined(thing) && thing !== null
  }

  static allDefined () {
    let obj = arguments[0]
    for (let i = 1; i < arguments.length; i++) {
      const thing = obj[arguments[i]]
      if (Utils.isUndefined(thing)) {
        return false
      }
      obj = obj[arguments[i]]
    }
    return true
  }

  static allDefinedAndNotNull () {
    let obj = arguments[0]
    for (let i = 1; i < arguments.length; i++) {
      const thing = obj[arguments[i]]
      if (Utils.isUndefined(thing)) {
        return false
      }
      if (thing === null) {
        return false
      }
      obj = obj[arguments[i]]
    }
    return true
  }

  static debounce (fn, wait, id) {
    if (Utils.isUndefined(window.deltaVMap_debounceIds)) {
      window.deltaVMap_debounceIds = {}
    }
    clearTimeout(window.deltaVMap_debounceIds[id])
    window.debounceIds = {}
    window.deltaVMap_debounceIds[id] = setTimeout(fn, wait)
  }

  static l () {
    console.log(...arguments)
  }

  static getQuery (queryName) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(queryName)
  }

  static setIfUndefined (object, propertyName, value) {
    if (Utils.undefined(object[propertyName])) {
      object[propertyName] = value
    }
  }
}
export default Utils
