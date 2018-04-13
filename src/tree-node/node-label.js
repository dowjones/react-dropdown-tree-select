import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from '../checkbox'

const NodeLabel = props => {
  const { simpleSelect, title, label, id, partial, checked, value, disabled, onCheckboxChange, showPartiallySelected } = props
  const nodeLabelProps = { className: 'node-label' }

  if (simpleSelect) {
    nodeLabelProps.onClick = e => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      onCheckboxChange(id, true)
    }
  }

  return (
    <label title={title || label}>
      {!simpleSelect && (
        <Checkbox
          name={id}
          indeterminate={showPartiallySelected && partial}
          className="checkbox-item"
          checked={checked}
          onChange={e => onCheckboxChange(id, e.target.checked)}
          value={value}
          disabled={disabled}
        />
      )}
      <span {...nodeLabelProps}>{label}</span>
    </label>
  )
}

NodeLabel.propTypes = {
  id: PropTypes.string.isRequired,
  actions: PropTypes.array,
  title: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  partial: PropTypes.bool,
  expanded: PropTypes.bool,
  disabled: PropTypes.bool,
  dataset: PropTypes.object,
  simpleSelect: PropTypes.bool,
  showPartiallySelected: PropTypes.bool,
  onCheckboxChange: PropTypes.func
}

export default NodeLabel
