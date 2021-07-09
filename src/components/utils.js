class Utils {
  static isUndefined (thing) {
    return typeof thing === 'undefined'
  }

  static isDefined (thing) {
    return !this.isUndefined(thing)
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
