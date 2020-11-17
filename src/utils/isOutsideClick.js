const getPath = e => {
  if (e.path) return e.path

  let elem = e.target
  const path = [elem]

  while (elem.parentElement) {
    elem = elem.parentElement
    path.unshift(elem)
  }

  return path
}

export default (e, className) => {
  if (!(e instanceof Event)) return false
  const completeClassName = className ? `${className} react-dropdown-tree-select` : 'react-dropdown-tree-select'
  return !getPath(e).some(node => {
    const { className } = node
    if (className && !!className.indexOf) {
      return node.className.indexOf(completeClassName) >= 0
    }
    return false
  })
}
