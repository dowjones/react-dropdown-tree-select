const getPath = e => {
  if (e.path) return e.path

  const path = [e]

  if (!e || !e.parentElement) {
    return []
  }

  while (e.parentElement) {
    e = e.parentElement
    path.unshift(e)
  }

  return path
}

export default e => {
  if (!(e instanceof Event)) return false
  return !getPath(e).some(node => node.className && node.className.indexOf('react-dropdown-tree-select') >= 0)
}
