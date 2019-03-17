export const generateUID = (prefix, separator) => {
  let counter = 1

  let map = new WeakMap()

  const get = item => {
    if (!map.has(item)) {
      map.set(item, counter++)
      return get(item)
    }
    return `${prefix || 'uid'}${separator}${map.get(item)}`
  }

  const reset = () => {
    map = new WeakMap()
    counter = 1
  }

  return { get, reset }
}

export const rdtsUID= generateUID('rdts', '')
