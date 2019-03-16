import getPartialState from './getPartialState'

import { isEmpty } from '../utils'

/**
 * Converts a nested node into an associative array with pointers to child and parent nodes
 * Given:
```
const tree = [
  {
    label: 'item1', value: 'value1',
    children: [
      {
        label: 'item10', value: 'value10',
        children: [
          {label: 'item20', value: 'value31'},
          {label: 'item12', value: 'value32'}
        ]
      },
      { label: 'item22', value: 'value22' }
    ]
  },
  {
    label: 'item1', value: 'value1',
    children: [
      {
        label: 'item21', value: 'value21',
        children: [
          {label: 'item31', value: 'value31'},
          {label: 'item32', value: 'value32'}
        ]
      },
      { label: 'item22', value: 'value22' }
    ]
  }
]
```
 * results in
```
{
  "0": {
    "_id": "0",
    "_parent": null,
    "_children": ["0-0", "0-1"],
    "label": "item1",
    "value": "value1"
  },
  "1": {
    "_id": "1", "_parent": null, "_children": ["1-0", "1-1"],
    "label": "item2", "value": "value2"
  },
  "0-0": {
    "_id": "0-0", "_parent": "0", "_children": ["0-0-0", "0-0-1"],
    "label": "item1-1", "value": "value1-1"
  },
  "0-1": {
    "_id": "0-1", "_parent": "0",
    "label": "item1-2", "value": "value1-2"
  },
  "0-0-0": {
    "_id": "0-0-0", "_parent": "0-0",
    "label": "item1-1-1", "value": "value1-1-1"
  },
  "0-0-1": {
    "_id": "0-0-1", "_parent": "0-0",
    "label": "item1-1-2", "value": "value1-1-2"
  },
  "1-0": {
    "_id": "1-0", "_parent": "1", "_children": ["1-0-0", "1-0-1", "1-0-2"],
    "label": "item2-1", "value": "value2-1"
  },
  "1-1": {
    "_id": "1-1", "_parent": "1",
    "label": "item2-2", "value": "value2-2"
  },
  "1-0-0": {
    "_id": "1-0-0", "_parent": "1-0",
    "label": "item2-1-1", "value": "value2-1-1"
  },
  "1-0-1": {
    "_id": "1-0-1", "_parent": "1-0",
    "label": "item2-1-2", "value": "value2-1-2"
  },
  "1-0-2": {
    "_id": "1-0-2", "_parent": "1-0", "_children": ["1-0-2-0"],
    "label": "item2-1-3", "value": "value2-1-3"
  },
  "1-0-2-0": {
    "_id": "1-0-2-0", "_parent": "1-0-2",
    "label": "item2-1-3-1", "value": "value2-1-3-1"
  }
}
```
 * @param  {[type]} tree              The incoming tree object
 * @param  {[bool]} simple            Whether its in Single select mode (simple dropdown)
 * @param  {[bool]} radio             Whether its in Radio select mode (radio dropdown)
 * @param  {[bool]} showPartialState  Whether to show partially checked state
 * @return {object}                   The flattened list
 */
function flattenTree({ tree, simple, radio, showPartialState, hierarchical }) {
  const forest = Array.isArray(tree) ? tree : [tree]

  // eslint-disable-next-line no-use-before-define
  const { list, defaultNodes, checkedNodes } = walkNodes({
    nodes: forest,
    simple,
    radio,
    showPartialState,
    hierarchical
  })
  const defaultValues = defaultNodes.map(i => i._id)
  const checkedValues = checkedNodes.map(i => i._id)
  return { list, defaultValues, checkedValues }
}

/**
 * If the node didn't specify anything on its own
 * figure out the initial state based on parent
 * @param {object} node           [current node]
 * @param {object} parent         [node's immediate parent]
 * @param {bool}   inheritChecked [if checked should be inherited]
 */
function setInitialStateProps(node, parent = {}, inheritChecked = true) {
  const stateProps = inheritChecked ? ['checked', 'disabled'] : ['disabled']
  for (let index = 0; index < stateProps.length; index++) {
    const prop = stateProps[index]

    // if and only if, node doesn't explicitly define a prop, grab it from parent
    if (node[prop] === undefined && parent[prop] !== undefined) {
      node[prop] = parent[prop]
    }
  }
}

function walkNodes({
  nodes, parent, depth = 0, simple, radio, showPartialState, hierarchical, returnValues = { list: new Map(), defaultNodes: [], checkedNodes: [] } }) {
  nodes.forEach((node, i) => {
    node._depth = depth

    if (parent) {
      node._id = node.id || `${parent._id}-${i}`
      node._parent = parent._id
      parent._children.push(node._id)
    } else {
      node._id = node.id || `${i}`
    }

    if (node.checked) {
      returnValues.checkedNodes.push(node)
    }

    if (node.isDefaultValue) {
      returnValues.defaultNodes.push(node)
      returnValues.checkedNodes.push(node)
      node.checked = true
    }

    if (!hierarchical || radio) setInitialStateProps(node, parent, !radio)

    returnValues.list.set(node._id, node)
    if (!simple && node.children) {
      node._children = []
      walkNodes({
        nodes: node.children,
        parent: node,
        depth: depth + 1,
        radio,
        showPartialState,
        hierarchical,
        returnValues
      })

      if (showPartialState && !node.checked) {
        node.partial = getPartialState(node)

        // re-check if all children are checked. if so, check thyself
        if (!isEmpty(node.children) && node.children.every(c => c.checked)) {
          node.checked = true
          returnValues.checkedNodes.push(node._id)
        }
      }

      node.children = undefined
    }
  })

  if (depth === 0 && returnValues.checkedNodes.length > 1 && (simple || radio)) {
    const chkNodes = returnValues.checkedNodes
    const defNodes = returnValues.defaultNodes
    /* get first checked node only in single select dropdown,
      if data has .checked = true that has precedence */
    let first
    if (defNodes.length === chkNodes.length) {
      [first] = chkNodes
    } else {
      [first] = chkNodes.filter(n => defNodes.indexOf(n) < 0)
        .sort((a, b) => a._id.localeCompare(b._id))
    }
    // uncheck all else and only select first default value provided
    chkNodes.filter(n => n !== first).forEach(n => { n.checked = false })
    returnValues.checkedNodes = [first]
    if (defNodes.length) {
      const [firstDefault] = defNodes
      returnValues.defaultNodes = [firstDefault]
    }
  }

  return returnValues
}

export default flattenTree
