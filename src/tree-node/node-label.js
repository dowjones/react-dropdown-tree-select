import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from '../checkbox'

const NodeLabel = props => {
  const { simpleSelect, node, onCheckboxChange, showPartiallySelected, partialChecked } = props
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
      {!simpleSelect && (
        <Checkbox
          name={node._id}
          indeterminate={showPartiallySelected && node.partial}
          className="checkbox-item"
          checked={node.checked}
          onChange={e => onCheckboxChange(node._id, e.target.checked)}
          value={node.value}
          disabled={node.disabled}
        />
      )}
      <span {...nodeLabelProps}>{node.label}</span>
    </label>
  )
}

NodeLabel.propTypes = {
  node: PropTypes.any,
  simpleSelect: PropTypes.bool,
  onCheckboxChange: PropTypes.func
}

export default NodeLabel
