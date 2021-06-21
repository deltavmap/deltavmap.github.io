export default {
  isUndefined: function (thing) {
    return typeof thing === 'undefined'
  },
  isDefined: function (thing) {
    return !this.isUndefined(thing)
  }
}
