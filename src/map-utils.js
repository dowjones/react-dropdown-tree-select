const mapToObj = (map) => {
  let obj = Object.create(null)
  for (let [k, v] of map) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v
  }
  return obj
}

export { mapToObj }
