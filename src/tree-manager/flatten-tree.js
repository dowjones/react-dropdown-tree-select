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
 * @param  {[bool]} simple            Whether its in Single slect mode (simple dropdown)
 * @param  {[bool]} showPartialState  Whether to show partially checked state
 * @return {object}                   The flattened list
 */
function flattenTree(tree, simple, showPartialState) {
  const forest = Array.isArray(tree) ? tree : [tree]

  // eslint-disable-next-line no-use-before-define
  const { list, defaultValues } = walkNodes({
    nodes: forest,
    simple,
    showPartialState
  })
  return { list, defaultValues }
}

/**
 * If the node didn't specify anything on its own
 * figure out the initial state based on parent
 * @param {object} node [current node]
 * @param {object} parent [node's immediate parent]
 */
function setInitialStateProps(node, parent = {}) {
  const stateProps = ['checked', 'disabled']
  for (let index = 0; index < stateProps.length; index++) {
    const prop = stateProps[index]

    // if and only if, node doesn't explicitly define a prop, grab it from parent
    if (node[prop] === undefined && parent[prop] !== undefined) {
      node[prop] = parent[prop]
    }
  }
}

function walkNodes({ nodes, list = new Map(), parent, depth = 0, simple, showPartialState, defaultValues = [] }) {
  nodes.forEach((node, i) => {
    node._depth = depth

    if (parent) {
      node._id = node.id || `${parent._id}-${i}`
      node._parent = parent._id
      parent._children.push(node._id)
    } else {
      node._id = node.id || `${i}`
    }

    if (node.isDefaultValue) {
      defaultValues.push(node._id)
      node.checked = true
    }

    setInitialStateProps(node, parent)

    list.set(node._id, node)
    if (!simple && node.children) {
      node._children = []
      walkNodes({
        nodes: node.children,
        list,
        parent: node,
        depth: depth + 1,
        showPartialState,
        defaultValues
      })

      if (showPartialState && !node.checked) {
        node.partial = getPartialState(node)

        // re-check if all children are checked. if so, check thyself
        if (!isEmpty(node.children) && node.children.every(c => c.checked)) {
          node.checked = true
        }
      }

      node.children = undefined
    }
  })
  return { list, defaultValues }
}

export default flattenTree
