const generateUID = prefix => {
  let counter = 1

  let map = new WeakMap()

  const get = item => {
    if (!map.has(item)) {
      map.set(item, counter++)
    }
    return `${prefix}${map.get(item)}`
  }

  const reset = () => {
    map = new WeakMap()
    counter = 1
  }

  return { get, reset }
}

const clientIdGenerator = generateUID('rdts')
export default clientIdGenerator
