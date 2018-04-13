import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { getDataset } from '../dataset-utils'
import Action from './action'
import isEmpty from '../isEmpty'
import NodeLabel from './node-label'
import Toggle from './toggle'

import styles from './index.css'

const cx = cn.bind(styles)

const isLeaf = children => isEmpty(children)

const getNodeCx = props => {
  const { keepTreeOnSearch, _children, matchInChildren, disabled, partial, hide, className, showPartiallySelected } = props

  return cx(
    'node',
    {
      leaf: isLeaf(_children),
      tree: !isLeaf(_children),
      disabled,
      hide,
      'match-in-children': keepTreeOnSearch && matchInChildren,
      partial: showPartiallySelected && partial
    },
    className
  )
}

const getNodeActions = props => {
  const { actions, onAction, _id } = props

  // we _do_ want to rely on array index here
  // eslint-disable-next-line react/no-array-index-key
  return (actions || []).map((a, idx) => <Action key={`action-${idx}`} {...a} actionData={{ action: a.id, _id }} onAction={onAction} />)
}

class TreeNode extends PureComponent {
  render() {
    const {
      simpleSelect,
      keepTreeOnSearch,
      _id,
      _children,
      dataset,
      _depth,
      expanded,
      title,
      label,
      partial,
      checked,
      value,
      disabled,
      searchModeOn,
      onNodeToggle,
      onCheckboxChange,
      showPartiallySelected
    } = this.props
    const liCx = getNodeCx(this.props)
    const style = keepTreeOnSearch || !searchModeOn ? { paddingLeft: `${(_depth || 0) * 20}px` } : {}
    console.log('TN Render', _id, _children)
    return (
      <li className={liCx} style={style} {...getDataset(dataset)}>
        <Toggle isLeaf={isLeaf(_children)} expanded={expanded} id={_id} onNodeToggle={onNodeToggle} />
        <NodeLabel
          title={title}
          label={label}
          id={_id}
          partial={partial}
          checked={checked}
          value={value}
          disabled={disabled}
          simpleSelect={simpleSelect}
          onCheckboxChange={onCheckboxChange}
          showPartiallySelected={showPartiallySelected}
        />
        {getNodeActions(this.props)}
      </li>
    )
  }
}

TreeNode.propTypes = {
  _id: PropTypes.string.isRequired,
  _depth: PropTypes.number,
  _children: PropTypes.array,
  actions: PropTypes.array,
  className: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  expanded: PropTypes.bool,
  disabled: PropTypes.bool,
  partial: PropTypes.bool,
  dataset: PropTypes.object,
  keepTreeOnSearch: PropTypes.bool,
  searchModeOn: PropTypes.bool,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  simpleSelect: PropTypes.bool,
  showPartiallySelected: PropTypes.bool
}

export default TreeNode
