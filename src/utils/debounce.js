/**
 * Modified debounce that always invokes on leading edge
 * See unmodified: https://gist.github.com/mrchief/a7e8938ee96774f05644905b37f09536
 */
export default (func, wait) => {
  let timeout

  return (...args) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    // timeout will be undefined the first time (leading edge)
    // so the callback will get executed once on leading edge
    const callNow = !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}
