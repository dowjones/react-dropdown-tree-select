import PropTypes from 'prop-types'
import React, { memo } from 'react'
import Checkbox from '../checkbox'
import RadioButton from '../radio'

import './index.css'

const NodeLabel = props => {
  const { mode, title, label, id, partial, checked, onCheckboxChange } = props
  const { value, disabled, showPartiallySelected, readOnly, clientId } = props
  const nodeLabelProps = { className: 'node-label' }

  const handleCheckboxChange = e => {
    if (mode === 'simpleSelect' || mode === 'radioSelect') {
      onCheckboxChange(id, true)
    } else {
      onCheckboxChange(id, e.target.checked)
    }

    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  // in case of simple select mode, there is no checkbox, so we need to handle the click via the node label
  // but not if the control is in readOnly or disabled state
  if (mode === 'simpleSelect' && !readOnly && !disabled) {
    nodeLabelProps.onClick = handleCheckboxChange
  }

  const sharedProps = {
    id,
    value,
    checked,
    disabled,
    readOnly,
    tabIndex: -1,
  }
  const className = ['checkbox-item', mode === 'simpleSelect' && 'simple-select'].filter(Boolean).join(' ')

  return (
    <label title={title || label} htmlFor={id}>
      {mode === 'radioSelect' ? (
        <RadioButton name={clientId} className="radio-item" onChange={handleCheckboxChange} {...sharedProps} />
      ) : (
        <Checkbox
          name={id}
          className={className}
          indeterminate={showPartiallySelected && partial}
          onChange={handleCheckboxChange}
          {...sharedProps}
        />
      )}
      <span {...nodeLabelProps}>{label}</span>
    </label>
  )
}

NodeLabel.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  partial: PropTypes.bool,
  disabled: PropTypes.bool,
  mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
  showPartiallySelected: PropTypes.bool,
  onCheckboxChange: PropTypes.func,
  readOnly: PropTypes.bool,
  clientId: PropTypes.string,
}

export default memo(NodeLabel)
