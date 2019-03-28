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

const getVisibleNodes = (tree, getItemById, reverse = false) => {
  const nodes = getNodesMatching(tree, (node, key, visited) => {
    if (node._children && node._children.length && node.expanded !== true) {
      markSubTreeVisited(node, visited, getItemById)
    }
    return !node.hide && !node.disabled && !node.readOnly
  })
  return reverse ? nodes.reverse() : nodes
}

const nodeVisitor = {
  getNodesMatching,
  getVisibleNodes,
  markSubTreeVisited
}
export default nodeVisitor
