const generateUID = prefix => {
  let counter = 0

  const get = () => {
    counter += 1
    return `${prefix}${counter}`
  }

  const reset = () => {
    counter = 0
  }

  return { get, reset }
}

const clientIdGenerator = generateUID('rdts')
export default clientIdGenerator
