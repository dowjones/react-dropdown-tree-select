import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { getDataset, isEmpty } from '../utils'
import Actions from './actions'
import { actionType } from './action'
import NodeLabel from './node-label'
import Toggle from './toggle'

import styles from './index.css'

const cx = cn.bind(styles)

const isLeaf = children => isEmpty(children)

const getNodeCx = props => {
  const {
    keepTreeOnSearch,
    keepChildrenOnSearch,
    _children,
    matchInChildren,
    matchInParent,
    disabled,
    partial,
    hide,
    className,
    showPartiallySelected,
    readOnly,
    checked,
    _focused: focused,
  } = props

  return cx(
    'node',
    {
      leaf: isLeaf(_children),
      tree: !isLeaf(_children),
      disabled,
      hide,
      'match-in-children': keepTreeOnSearch && matchInChildren,
      'match-in-parent': keepTreeOnSearch && keepChildrenOnSearch && matchInParent,
      partial: showPartiallySelected && partial,
      readOnly,
      checked,
      focused,
    },
    className
  )
}

const getAriaAttributes = props => {
  const { _children, _depth, checked, disabled, expanded, readOnly, mode, partial } = props
  const attributes = {}

  attributes.role = mode === 'simpleSelect' ? 'option' : 'treeitem'
  attributes['aria-disabled'] = disabled || readOnly
  attributes['aria-selected'] = checked
  if (mode !== 'simpleSelect') {
    attributes['aria-checked'] = partial ? 'mixed' : checked
    attributes['aria-level'] = _depth + 1
    attributes['aria-expanded'] = _children && (expanded ? 'true' : 'false')
  }
  return attributes
}

const TreeNode = props => {
  const {
    mode,
    keepTreeOnSearch,
    _id,
    _children,
    dataset,
    _depth = 0,
    expanded,
    title,
    label,
    partial,
    checked,
    value,
    disabled,
    actions,
    onAction,
    searchModeOn,
    onNodeToggle,
    onCheckboxChange,
    showPartiallySelected,
    readOnly,
    clientId,
  } = props
  const liCx = getNodeCx(props)
  const style = keepTreeOnSearch || !searchModeOn ? { paddingLeft: `${_depth * 20}px` } : {}
  const liId = `${_id}_li`
  return (
    <li
      className={liCx}
      style={style}
      id={liId}
      {...getDataset(dataset)}
      {...getAriaAttributes({ _children, _depth, checked, disabled, expanded, readOnly, mode, partial })}
    >
      <Toggle isLeaf={isLeaf(_children)} expanded={expanded} id={_id} onNodeToggle={onNodeToggle} />
      <NodeLabel
        title={title}
        label={label}
        id={_id}
        partial={partial}
        checked={checked}
        value={value}
        disabled={disabled}
        mode={mode}
        onCheckboxChange={onCheckboxChange}
        showPartiallySelected={showPartiallySelected}
        readOnly={readOnly}
        clientId={clientId}
      />
      <Actions actions={actions} onAction={onAction} id={_id} readOnly={readOnly} />
    </li>
  )
}

TreeNode.propTypes = {
  _id: PropTypes.string.isRequired,
  _depth: PropTypes.number,
  _children: PropTypes.arrayOf(PropTypes.node),
  actions: PropTypes.arrayOf(PropTypes.shape(actionType)),
  className: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  expanded: PropTypes.bool,
  disabled: PropTypes.bool,
  partial: PropTypes.bool,
  dataset: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  keepTreeOnSearch: PropTypes.bool,
  keepChildrenOnSearch: PropTypes.bool,
  searchModeOn: PropTypes.bool,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
  showPartiallySelected: PropTypes.bool,
  readOnly: PropTypes.bool,
  clientId: PropTypes.string.isRequired,
}

export default memo(TreeNode)
