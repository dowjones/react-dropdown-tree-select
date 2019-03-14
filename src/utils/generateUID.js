export const generateUID = prefix => {
  let counter = 1

  let map = new WeakMap()

  const generate = item => {
    if (!map.has(item)) {
      map.set(item, counter++)
      return generate(item)
    }
    return `${prefix || 'uid'}-${map.get(item)}`
  }

  const reset = () => {
    map = new WeakMap()
    counter = 1
  }

  return { generate, reset }
}

export const rddtsGenerator = generateUID('rddts')
