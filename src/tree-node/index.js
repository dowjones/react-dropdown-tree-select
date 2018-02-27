import React from 'react'
import PropTypes from 'prop-types'
import isEmpty from '../isEmpty'
import Action from './action'
import cn from 'classnames/bind'
import styles from './index.css'

const cx = cn.bind(styles)

const isLeaf = (node) => isEmpty(node._children)

const getNodeCx = (props) => {
  const { keepTreeOnSearch, node } = props

  return cx(
    'node',
    {
      leaf: isLeaf(node),
      tree: !isLeaf(node),
      disabled: node.disabled,
      hide: node.hide,
      'match-in-children': keepTreeOnSearch && node.matchInChildren
    },
    node.className
  )
}

const getToggleCx = ({ node }) => {
  return cx(
    'toggle',
    { expanded: !isLeaf(node) && node.expanded, collapsed: !isLeaf(node) && !node.expanded }
  )
}

const getNodeActions = (props) => {
  const {node, onAction} = props

  return (node.actions || []).map((a, idx) => (
    <Action key={`action-${idx}`} {...a} actionData={{ action: a.id, node }} onAction={onAction} />
  ))
}

const TreeNode = props => {
  const { keepTreeOnSearch, node, searchModeOn, onNodeToggle, onCheckboxChange } = props
  const liCx = getNodeCx(props)
  const toggleCx = getToggleCx(props)
  return (
    <li
      data-nb-children={node._children ? node._children.length : 0}
      data-nb-leaves={node._nbLeaves}
      className={liCx}
      style={keepTreeOnSearch || !searchModeOn ? { paddingLeft: `${node._depth * 20}px` } : {}}>
      <i className={toggleCx} onClick={() => onNodeToggle(node._id)} />
      <label title={node.title || node.label}>
        <input
          type="checkbox"
          name={node._id}
          className="checkbox-item"
          checked={node.checked}
          onChange={e => onCheckboxChange(node._id, e.target.checked)}
          value={node.value}
          disabled={node.disabled}
        />
        <span className="node-label">{node.label}</span>
      </label>
      {getNodeActions(props)}
    </li>
  )
}

TreeNode.propTypes = {
  node: PropTypes.shape({
    _id: PropTypes.string,
    _depth: PropTypes.number,
    _children: PropTypes.array,
    actions: PropTypes.array,
    className: PropTypes.string,
    title: PropTypes.string,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    expanded: PropTypes.bool,
    disabled: PropTypes.bool
  }).isRequired,
  keepTreeOnSearch: PropTypes.bool,
  searchModeOn: PropTypes.bool,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func
}

export default TreeNode
