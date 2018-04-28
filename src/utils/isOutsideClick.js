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

export default e => {
  if (!(e instanceof Event)) return false
  return !getPath(e).some(node => node.className && node.className.indexOf('react-dropdown-tree-select') >= 0)
}
