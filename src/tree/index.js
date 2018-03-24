import React from 'react'
import PropTypes from 'prop-types'
import TreeNode from '../tree-node'

const shouldRenderNode = (node, searchModeOn, data) => {
  if (searchModeOn || node.expanded) return true

  const parent = node._parent && data.get(node._parent)
  // if it has a parent, then check parent's state.
  // otherwise root nodes are always rendered
  return !parent || parent.expanded
}

const getNodes = props => {
  const { searchModeOn, data, onAction, onChange, onCheckboxChange, onNodeToggle } = props
  const items = []
  data.forEach(node => {
    if (shouldRenderNode(node, searchModeOn, data)) {
      items.push(<TreeNode
        key={node._id}
        node={node}
        onChange={onChange}
        onCheckboxChange={onCheckboxChange}
        onNodeToggle={onNodeToggle}
        onAction={onAction}
      />)
    }
  })
  return items
}

const Tree = props => {
  const { searchModeOn } = props

  return <ul className={`root ${searchModeOn ? 'searchModeOn' : ''}`}>{getNodes(props)}</ul>
}

/* eslint-disable react/no-unused-prop-types */
// https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md#false-positives-sfc
Tree.propTypes = {
  data: PropTypes.object,
  searchModeOn: PropTypes.bool,
  onChange: PropTypes.func,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func
}
/* eslint-enable react/no-unused-prop-types */

export default Tree
