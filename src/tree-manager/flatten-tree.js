import getPartialState from './getPartialState'

import { isEmpty } from '../utils'

/**
 * Converts a nested node into an associative array with pointers to child and parent nodes
 * Given:
```
const tree = [
  {
    label: 'item1',
    value: 'value1',
    children: [
      {
        label: 'item1-1',
        value: 'value1-1',
        children: [
          {
            label: 'item1-1-1',
            value: 'value1-1-1'
          },
          {
            label: 'item1-1-2',
            value: 'value1-1-2'
          }
        ]
      },
      {
        label: 'item1-2',
        value: 'value1-2'
      }
    ]
  },
  {
    label: 'item2',
    value: 'value2',
    children: [
      {
        label: 'item2-1',
        value: 'value2-1',
        children: [
          {
            label: 'item2-1-1',
            value: 'value2-1-1'
          },
          {
            label: 'item2-1-2',
            value: 'value2-1-2'
          },
          {
            label: 'item2-1-3',
            value: 'item2-1-3',
            children: [
              {
                label: 'item2-1-3-1',
                value: 'value2-1-3-1'
              }
            ]
          }
        ]
      },
      {
        label: 'item2-2',
        value: 'value2-2'
      }
    ]
  }
]
```
 * results in
```
{
  "0": {
    _id: "0",
    _parent: null,
    _children: [
      "0-0",
      "0-1"
    ],
    label: "item1",
    value: "value1"
  },
  "1": {
    _id: "1",
    _parent: null,
    _children: [
      "1-0",
      "1-1"
    ],
    label: "item2",
    value: "value2"
  },
  "0-0": {
    _id: "0-0",
    _parent: "0",
    _children: [
      "0-0-0",
      "0-0-1"
    ],
    label: "item1-1",
    value: "value1-1"
  },
  "0-1": {
    _id: "0-1",
    _parent: "0",
    label: "item1-2",
    value: "value1-2"
  },
  "0-0-0": {
    _id: "0-0-0",
    _parent: "0-0",
    label: "item1-1-1",
    value: "value1-1-1"
  },
  "0-0-1": {
    _id: "0-0-1",
    _parent: "0-0",
    label: "item1-1-2",
    value: "value1-1-2"
  },
  "1-0": {
    _id: "1-0",
    _parent: "1",
    _children: [
      "1-0-0",
      "1-0-1",
      "1-0-2"
    ],
    label: "item2-1",
    value: "value2-1"
  },
  "1-1": {
    _id: "1-1",
    _parent: "1",
    label: "item2-2",
    value: "value2-2"
  },
  "1-0-0": {
    _id: "1-0-0",
    _parent: "1-0",
    label: "item2-1-1",
    value: "value2-1-1"
  },
  "1-0-1": {
    _id: "1-0-1",
    _parent: "1-0",
    label: "item2-1-2",
    value: "value2-1-2"
  },
  "1-0-2": {
    _id: "1-0-2",
    _parent: "1-0",
    _children: [
      "1-0-2-0"
    ],
    label: "item2-1-3",
    value: "value2-1-3"
  },
  "1-0-2-0": {
    _id: "1-0-2-0",
    _parent: "1-0-2",
    label: "item2-1-3-1",
    value: "value2-1-3-1"
  }
}
```
 * @param  {[type]} tree              The incoming tree object
 * @param  {[bool]} simple            Whether its in Single select mode (simple dropdown)
 * @param  {[bool]} radio             Whether its in Radio select mode (radio dropdown)
 * @param  {[bool]} showPartialState  Whether to show partially checked state
 * @param  {[string]} rootPrefixId    The prefix to use when setting root node ids
 * @return {object}                   The flattened list
 */
function flattenTree({ tree, simple, radio, showPartialState, hierarchical, rootPrefixId }) {
  const forest = Array.isArray(tree) ? tree : [tree]

  // eslint-disable-next-line no-use-before-define
  return walkNodes({
    nodes: forest,
    simple,
    radio,
    showPartialState,
    hierarchical,
    rootPrefixId,
  })
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
  nodes,
  parent,
  depth = 0,
  simple,
  radio,
  showPartialState,
  hierarchical,
  rootPrefixId,
  _rv = { list: new Map(), defaultValues: [], singleSelectedNode: null },
}) {
  const single = simple || radio
  nodes.forEach((node, i) => {
    node._depth = depth

    if (parent) {
      node._id = node.id || `${parent._id}-${i}`
      node._parent = parent._id
      parent._children.push(node._id)
    } else {
      node._id = node.id || `${rootPrefixId ? `${rootPrefixId}-${i}` : i}`
    }

    if (single && node.checked) {
      if (_rv.singleSelectedNode) {
        node.checked = false
      } else {
        _rv.singleSelectedNode = node
      }
    }

    if (single && node.isDefaultValue && _rv.singleSelectedNode && !_rv.singleSelectedNode.isDefaultValue) {
      // Default value has precedence, uncheck previous value
      _rv.singleSelectedNode.checked = false
      _rv.singleSelectedNode = null
    }

    if (node.isDefaultValue && (!single || _rv.defaultValues.length === 0)) {
      _rv.defaultValues.push(node._id)
      node.checked = true
      if (single) {
        _rv.singleSelectedNode = node
      }
    }

    if (!hierarchical || radio) setInitialStateProps(node, parent, !radio)

    _rv.list.set(node._id, node)
    if (!simple && node.children) {
      node._children = []
      walkNodes({
        nodes: node.children,
        parent: node,
        depth: depth + 1,
        radio,
        showPartialState,
        hierarchical,
        _rv,
      })

      if (showPartialState && !node.checked) {
        node.partial = getPartialState(node)

        // re-check if all children are checked. if so, check thyself
        if (!single && !isEmpty(node.children) && node.children.every(c => c.checked)) {
          node.checked = true
        }
      }

      node.children = undefined
    }
  })

  return _rv
}

export default flattenTree
