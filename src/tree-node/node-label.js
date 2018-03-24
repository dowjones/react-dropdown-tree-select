import React from 'react'
import PropTypes from 'prop-types'

const NodeLabel = props => {
  const { simpleSelect, node, onCheckboxChange } = props
  const nodeLabelProps = { className: 'node-label' }

  if (simpleSelect) {
    nodeLabelProps.onClick = e => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      onCheckboxChange(node._id, true)
    }
  }

  return (
    <label title={node.title || node.label}>
      {
        !simpleSelect && <input
          type="checkbox"
          name={node._id}
          className="checkbox-item"
          checked={node.checked}
          onChange={e => onCheckboxChange(node._id, e.target.checked)}
          value={node.value}
          disabled={node.disabled}
        />
      }
      <span {...nodeLabelProps}>{node.label}</span>
    </label>)
}

NodeLabel.propTypes = {
  node: PropTypes.any,
  simpleSelect: PropTypes.bool,
  onCheckboxChange: PropTypes.func
}

export default NodeLabel
