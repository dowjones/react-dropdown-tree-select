import getPartialState from './getPartialState'

import { isEmpty } from '../utils'
import flattenTree from './flatten-tree'

class TreeManager {
  constructor({ data, simpleSelect, showPartiallySelected, hierarchical, rootPrefixId }) {
    this._src = data
    const { list, defaultValues } = flattenTree({ tree: JSON.parse(JSON.stringify(data)), simpleSelect, showPartialState: showPartiallySelected, hierarchical, rootPrefixId })
    this.tree = list
    this.defaultValues = defaultValues
    this.simpleSelect = simpleSelect
    this.showPartialState = !hierarchical && showPartiallySelected
    this.searchMaps = new Map()
    this.hierarchical = hierarchical
  }

  getNodeById(id) {
    return this.tree.get(id)
  }

  getMatches(searchTerm) {
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

  addParentsToTree(id, tree) {
    if (id !== undefined) {
      const node = this.getNodeById(id)
      this.addParentsToTree(node._parent, tree)
      node.hide = true
      node.matchInChildren = true
      tree.set(id, node)
    }
  }

  addChildrenToTree(ids, tree, matches) {
    if (ids !== undefined) {
      ids.forEach(id => {
        if (matches && matches.includes(id)) {
          // if a child is found by search anyways, don't display it as a child here
          return
        }
        const node = this.getNodeById(id)
        node.matchInParent = true
        tree.set(id, node)
        this.addChildrenToTree(node._children, tree)
      })
    }
  }

  filterTree(searchTerm, keepTreeOnSearch, keepChildrenOnSearch) {
    const matches = this.getMatches(searchTerm.toLowerCase())

    const matchTree = new Map()

    matches.forEach(m => {
      const node = this.getNodeById(m)
      node.hide = false
      if (keepTreeOnSearch) {
        // add parent nodes first or else the tree won't be rendered in correct hierarchy
        this.addParentsToTree(node._parent, matchTree)
      }
      matchTree.set(m, node)
      if (keepTreeOnSearch && keepChildrenOnSearch) {
        // add children nodes after a found match
        this.addChildrenToTree(node._children, matchTree, matches)
      }
    })

    const allNodesHidden = matches.length === 0

    // we store a local reference so that components can use it in subsequent renders
    // this is the least intrusive way of fixing #190
    this.matchTree = matchTree

    return { allNodesHidden, tree: matchTree }
  }

  restoreNodes() {
    this.tree.forEach(node => {
      node.hide = false
    })

    return this.tree
  }

  restoreDefaultValues() {
    this.defaultValues.forEach(id => {
      this.setNodeCheckedState(id, true)
    })

    return this.tree
  }

  togglePreviousChecked(id) {
    const prevChecked = this.currentChecked

    // if id is same as previously selected node, then do nothing (since it's state is already set correctly by setNodeCheckedState)
    // but if they ar not same, then toggle the previous one
    if (prevChecked && prevChecked !== id) this.getNodeById(prevChecked).checked = false

    this.currentChecked = id
  }

  setNodeCheckedState(id, checked) {
    const node = this.getNodeById(id)
    node.checked = checked

    // TODO: this can probably be combined with the same check in the else block. investigate in a separate release.
    if (this.showPartialState) {
      node.partial = false
    }

    if (this.simpleSelect) {
      this.togglePreviousChecked(id)
    } else {
      if (!this.hierarchical) this.toggleChildren(id, checked)

      if (this.showPartialState) {
        this.partialCheckParents(node)
      }

      if (!this.hierarchical && !checked) {
        this.unCheckParents(node)
      }
    }
  }

  /**
   * Walks up the tree unchecking parent nodes
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  unCheckParents(node) {
    let parent = node._parent
    while (parent) {
      const next = this.getNodeById(parent)
      next.checked = false
      next.partial = getPartialState(next, '_children', this.getNodeById.bind(this))
      parent = next._parent
    }
  }

  /**
   * Walks up the tree setting partial state on parent nodes
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  partialCheckParents(node) {
    let parent = node._parent
    while (parent) {
      const next = this.getNodeById(parent)
      next.checked = next._children.every(c => this.getNodeById(c).checked)
      next.partial = getPartialState(next, '_children', this.getNodeById.bind(this))
      parent = next._parent
    }
  }

  toggleChildren(id, state) {
    const node = this.getNodeById(id)
    node.checked = state

    if (this.showPartialState) {
      node.partial = false
    }

    if (!isEmpty(node._children)) {
      node._children.forEach(id => this.toggleChildren(id, state))
    }
  }

  toggleNodeExpandState(id) {
    const node = this.getNodeById(id)
    node.expanded = !node.expanded
    if (!node.expanded) this.collapseChildren(node)
    return this.tree
  }

  collapseChildren(node) {
    node.expanded = false
    if (!isEmpty(node._children)) {
      node._children.forEach(c => this.collapseChildren(this.getNodeById(c)))
    }
  }

  getTags() {
    const tags = []
    const visited = {}
    const markSubTreeVisited = node => {
      visited[node._id] = true
      if (!isEmpty(node._children)) node._children.forEach(c => markSubTreeVisited(this.getNodeById(c)))
    }

    this.tree.forEach((node, key) => {
      if (visited[key]) return

      if (node.checked) {
        tags.push(node)

        if (!this.hierarchical) {
          // Parent node, so no need to walk children
          markSubTreeVisited(node)
        }
      } else {
        visited[key] = true
      }
    })
    return tags
  }
}

export default TreeManager
