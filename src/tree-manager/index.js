import getPartialState from './getPartialState'
import { isEmpty } from '../utils'
import flattenTree from './flatten-tree'
import nodeVisitor from './nodeVisitor'
import keyboardNavigation, { FocusActionNames } from './keyboardNavigation'

class TreeManager {
  constructor({ data, mode, showPartiallySelected, rootPrefixId, searchPredicate }) {
    this._src = data
    this.simpleSelect = mode === 'simpleSelect'
    this.radioSelect = mode === 'radioSelect'
    this.hierarchical = mode === 'hierarchical'
    this.searchPredicate = searchPredicate
    const { list, defaultValues, singleSelectedNode } = flattenTree({
      tree: JSON.parse(JSON.stringify(data)),
      simple: this.simpleSelect,
      radio: this.radioSelect,
      showPartialState: showPartiallySelected,
      hierarchical: this.hierarchical,
      rootPrefixId,
    })
    this.tree = list
    this.defaultValues = defaultValues
    this.showPartialState = !this.hierarchical && showPartiallySelected
    this.searchMaps = new Map()

    if ((this.simpleSelect || this.radioSelect) && singleSelectedNode) {
      // Remembers initial check on single select dropdowns
      this.currentChecked = singleSelectedNode._id
    }
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

    const addOnMatch = this._getAddOnMatch(matches, searchTerm)

    if (closestMatch !== searchTerm) {
      const superMatches = this.searchMaps.get(closestMatch)
      superMatches.forEach(key => addOnMatch(this.getNodeById(key)))
    } else {
      this.tree.forEach(addOnMatch)
    }

    this.searchMaps.set(searchTerm, matches)
    return matches
  }

  addParentsToTree(id, tree) {
    if (id !== undefined) {
      const node = this.getNodeById(id)
      this.addParentsToTree(node._parent, tree)
      node.hide = node._isMatch ? node.hide : true
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

      // add a marker to tell `addParentsToTree` to not hide this node; even if it's an ancestor node
      node._isMatch = true

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

  togglePreviousChecked(id, checked) {
    const prevChecked = this.currentChecked

    // if id is same as previously selected node, then do nothing (since it's state is already set correctly by setNodeCheckedState)
    // but if they ar not same, then toggle the previous one
    if (prevChecked && prevChecked !== id) {
      const prevNode = this.getNodeById(prevChecked)
      prevNode.checked = false
      // if radioSelect, then we need to remove the partial state from parents of previous node
      if (this.radioSelect && this.showPartialState) this.partialCheckParents(prevNode)
    }

    this.currentChecked = checked ? id : null
  }

  setNodeCheckedState(id, checked) {
    // radioSelect must be done before setting node checked, to avoid conflicts with partialCheckParents
    // this only occurs when selecting the parent of a previously selected child when the parent also has a parent
    if (this.radioSelect) this.togglePreviousChecked(id, checked)

    const node = this.getNodeById(id)
    node.checked = checked

    // TODO: this can probably be combined with the same check in the else block. investigate in a separate release.
    if (this.showPartialState) {
      node.partial = false
    }

    if (this.simpleSelect) {
      this.togglePreviousChecked(id, checked)
    } else if (this.radioSelect) {
      if (this.showPartialState) {
        this.partialCheckParents(node)
      }
      if (!checked) {
        this.unCheckParents(node)
      }
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

  get tags() {
    if (this.radioSelect || this.simpleSelect) {
      if (this.currentChecked) {
        return [this.getNodeById(this.currentChecked)]
      }
      return []
    }

    return nodeVisitor.getNodesMatching(this.tree, (node, key, visited) => {
      if (node.checked && !this.hierarchical) {
        // Parent node, so no need to walk children
        nodeVisitor.markSubTreeVisited(node, visited, id => this.getNodeById(id))
      }
      return node.checked
    })
  }

  getTreeAndTags() {
    return { tree: this.tree, tags: this.tags }
  }

  handleNavigationKey(currentFocus, tree, key, readOnly, markSubTreeOnNonExpanded, onToggleChecked, onToggleExpanded) {
    const prevFocus = currentFocus && this.getNodeById(currentFocus)
    const getNodeById = id => this.getNodeById(id)
    const action = keyboardNavigation.getAction(prevFocus, key)

    if (FocusActionNames.has(action)) {
      const newFocus = keyboardNavigation.handleFocusNavigationkey(
        tree,
        action,
        prevFocus,
        getNodeById,
        markSubTreeOnNonExpanded
      )
      return newFocus
    }

    if (!prevFocus || !tree.has(prevFocus._id)) {
      // No current focus or not visible
      return currentFocus
    }

    return keyboardNavigation.handleToggleNavigationkey(action, prevFocus, readOnly, onToggleChecked, onToggleExpanded)
  }

  _getAddOnMatch(matches, searchTerm) {
    let isMatch = (node, term) => node.label.toLowerCase().indexOf(term) >= 0
    if (typeof this.searchPredicate === 'function') {
      isMatch = this.searchPredicate
    }

    return node => {
      if (isMatch(node, searchTerm)) {
        matches.push(node._id)
      }
    }
  }
}

export default TreeManager
