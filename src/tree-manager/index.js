import isEmpty from '../isEmpty'
import flattenTree from './flatten-tree'

class TreeManager {
  constructor (tree) {
    this._src = tree
    this.tree = flattenTree(JSON.parse(JSON.stringify(tree)))
    this.tree.forEach(node => { this.setInitialStatus(node) })
    this.searchMaps = new Map()
  }

  getNodeById (id) {
    return this.tree.get(id)
  }

  getMatches (searchTerm) {
    if (this.searchMaps.has(searchTerm)) {
      return this.searchMaps.get(searchTerm)
    }

    let proximity = -1
    let closestMatch = searchTerm
    this.searchMaps.forEach((m, key) => {
      if (searchTerm.startsWith(key) && key.length > proximity) {
        proximity = key.length
        closestMatch = key
      }
    })

    const matches = []

    if (closestMatch !== searchTerm) {
      const superMatches = this.searchMaps.get(closestMatch)
      superMatches.forEach(key => {
        const node = this.getNodeById(key)
        if (node.label.toLowerCase().indexOf(searchTerm) >= 0) {
          matches.push(node._id)
        }
      })
    } else {
      this.tree.forEach(node => {
        if (node.label.toLowerCase().indexOf(searchTerm) >= 0) {
          matches.push(node._id)
        }
      })
    }

    this.searchMaps.set(searchTerm, matches)
    return matches
  }

  setChildMatchStatus (id) {
    if (id !== undefined) {
      const node = this.getNodeById(id)
      node.matchInChildren = true
      this.setChildMatchStatus(node._parent)
    }
  }

  filterTree (searchTerm) {
    const matches = this.getMatches(searchTerm.toLowerCase())

    this.tree.forEach(node => {
      node.hide = true
      node.matchInChildren = false
    })

    matches.forEach(m => {
      const node = this.getNodeById(m)
      node.hide = false
      this.setChildMatchStatus(node._parent)
    })

    const allNodesHidden = matches.length === 0
    return { allNodesHidden, tree: this.tree }
  }

  restoreNodes () {
    this.tree.forEach(node => {
      node.hide = false
    })

    return this.tree
  }

  /**
  * If the node didn't specify anything on its own
  * figure out the initial state for checked and disabled based on parent
  * @param {object} node [description]
  */
  setInitialStatus (node) {
    const { parentCheckState, parentDisabledState } = this.getNodeStatus(node)
    if (node.checked === undefined) node.checked = parentCheckState
    if (node.disabled === undefined) node.disabled = parentDisabledState
  }

  /**
   * Figure out the checked and disabled state based on parent.
   * @param  {[type]} node    [description]
   * @param  {[type]} tree    [description]
   * @return {[type]}         [description]
   */
  getNodeStatus (node) {
    let parentCheckState = false
    let parentDisabledState = false
    let parent = node._parent
    while (parent && (!parentCheckState || !parentDisabledState)) {
      const parentNode = this.getNodeById(parent)

      if (!parentCheckState && parentNode.checked) parentCheckState = parentNode.checked
      if (!parentDisabledState && parentNode.disabled) parentDisabledState = parentNode.disabled

      parent = parentNode._parent
    }

    return { parentCheckState, parentDisabledState }
  }

  setNodeCheckedState (id, checked) {
    const node = this.getNodeById(id)
    node.checked = checked
    this.toggleChildren(id, checked)

    if (!checked) {
      this.unCheckParents(node)
    }
  }

  /**
   * Walks up the tree unchecking parent nodes
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  unCheckParents (node) {
    let parent = node._parent
    while (parent) {
      let next = this.getNodeById(parent)
      next.checked = false
      parent = next._parent
    }
  }

  toggleChildren (id, state) {
    const node = this.getNodeById(id)
    node.checked = state
    if (!isEmpty(node._children)) {
      node._children.forEach(id => this.toggleChildren(id, state))
    }
  }

  toggleNodeExpandState (id) {
    const node = this.getNodeById(id)
    node.expanded = !node.expanded
    if (!node.expanded) this.collapseChildren(node)
    return this.tree
  }

  collapseChildren (node) {
    node.expanded = false
    if (!isEmpty(node._children)) {
      node._children.forEach(c => this.collapseChildren(this.getNodeById(c)))
    }
  }

  getTags () {
    const tags = []
    const visited = {}
    const markSubTreeVisited = (node) => {
      visited[node._id] = true
      if (!isEmpty(node._children)) node._children.forEach(c => markSubTreeVisited(this.getNodeById(c)))
    }

    this.tree.forEach((node, key) => {
      if (visited[key]) return

      if (node.checked) {
        // Parent node, so no need to walk children
        tags.push(node)
        markSubTreeVisited(node)
      } else {
        visited[key] = true
      }
    })
    return tags
  }
}

export default TreeManager
