function findIndex(arr, predicate, thisArg) {
  // if native support is available, ship it off
  if (Array.prototype.findIndex) {
    return arr.findIndex(predicate, thisArg)
  }

  if (!arr) {
    throw new TypeError('findIndex called on null or undefined')
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('findIndex predicate must be a function')
  }

  for (var i = 0; i < arr.length; i++) {
    let value = arr[i]
    if (predicate.call(thisArg, value, i, arr)) {
      return i
    }
  }
  return -1
}
export default findIndex
