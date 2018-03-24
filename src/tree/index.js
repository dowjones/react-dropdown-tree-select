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

const Tree = props => {
  const { data, keepTreeOnSearch, searchModeOn, simpleSelect } = props
  const { onAction, onChange, onCheckboxChange, onNodeToggle } = props
  return (
    <ul className={`root ${searchModeOn ? 'searchModeOn' : ''}`}>
      {data.map(node => {
        if (shouldRenderNode(node, searchModeOn, data)) {
          return (
            <TreeNode
              keepTreeOnSearch={keepTreeOnSearch}
              key={node._id}
              node={node}
              searchModeOn={searchModeOn}
              onChange={onChange}
              onCheckboxChange={onCheckboxChange}
              onNodeToggle={onNodeToggle}
              onAction={onAction}
              simpleSelect={simpleSelect}
            />
          )
        }
        return null
      })}
    </ul>
  )
}

Tree.propTypes = {
  data: PropTypes.object,
  keepTreeOnSearch: PropTypes.bool,
  searchModeOn: PropTypes.bool,
  onChange: PropTypes.func,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  simpleSelect: PropTypes.bool
}

export default Tree
