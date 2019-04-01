import isEmpty from './isEmpty'

const markSubTreeVisited = (node, visited, getItemById) => {
  visited[node._id] = true
  if (!isEmpty(node._children)) {
    node._children.forEach(c =>
      markSubTreeVisited(getItemById(c), visited, getItemById))
  }
}

const getNodesMatching = (tree, nodePredicate) => {
  const nodes = []
  const visited = {}

  tree.forEach((node, key) => {
    if (visited[key]) return

    if (nodePredicate(node, key, visited)) {
      nodes.push(node)
    }

    visited[key] = true
  })

  return nodes
}

const getVisibleNodes = (tree, getItemById, markSubTreeOnNonExpanded) =>
  getNodesMatching(tree, (node, key, visited) => {
    if (markSubTreeOnNonExpanded && node._children && node._children.length && node.expanded !== true) {
      markSubTreeVisited(node, visited, getItemById)
    }
    return !node.hide && !node.disabled && !node.readOnly
  })

const nodeVisitor = {
  getNodesMatching,
  getVisibleNodes,
  markSubTreeVisited
}
export default nodeVisitor
