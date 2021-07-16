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

  static allDefined () {
    let obj = arguments[0]
    for (let i = 1; i < arguments.length; i++) {
      if (Utils.isUndefined(obj[arguments[i]])) { return false }
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
}
export default Utils
