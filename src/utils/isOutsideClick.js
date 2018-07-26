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
  return !getPath(e).some(node => node.className && node.className.indexOf(completeClassName) >= 0)
}
