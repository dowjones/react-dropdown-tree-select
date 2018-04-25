export default e => {
  if (!(e instanceof Event)) return false
  return !e.path.some(node => node.className && node.className.indexOf('react-dropdown-tree-select') >= 0)
}
