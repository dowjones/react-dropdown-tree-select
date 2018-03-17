import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React from 'react'

import Action from './action'
import isEmpty from '../isEmpty'
import NodeLabel from './node-label'

import styles from './index.css'
import { getDataset } from '../dataset-utils'

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
  const { node, onAction } = props

  return (node.actions || []).map((a, idx) => (
    <Action key={`action-${idx}`} {...a} actionData={{ action: a.id, node }} onAction={onAction} />
  ))
}

const TreeNode = props => {
  const { simpleSelect, keepTreeOnSearch, node, searchModeOn, onNodeToggle, onCheckboxChange } = props
  const liCx = getNodeCx(props)
  const toggleCx = getToggleCx(props)
  const style = keepTreeOnSearch || !searchModeOn ? { paddingLeft: `${node._depth * 20}px` } : {}

  return (
    <li className={liCx} style={style} {...getDataset(node.dataset)}>
      <i className={toggleCx} onClick={() => onNodeToggle(node._id)} />
      <NodeLabel node={node} simpleSelect={simpleSelect} onCheckboxChange={onCheckboxChange} />
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
    disabled: PropTypes.bool,
    dataset: PropTypes.object
  }).isRequired,
  keepTreeOnSearch: PropTypes.bool,
  searchModeOn: PropTypes.bool,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  simpleSelect: PropTypes.bool
}

export default TreeNode
