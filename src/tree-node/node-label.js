import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Checkbox from '../checkbox'
import RadioButton from '../radio'

class NodeLabel extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.array,
    title: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    partial: PropTypes.bool,
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
    showPartiallySelected: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    readOnly: PropTypes.bool,
    clientId: PropTypes.string,
  }

  handleCheckboxChange = e => {
    const { mode, id, onCheckboxChange } = this.props

    if (mode === 'simpleSelect' || mode === 'radioSelect') {
      onCheckboxChange(id, true)
    } else {
      const {
        target: { checked },
      } = e
      onCheckboxChange(id, checked)
    }
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  render() {
    const { mode, title, label, id, partial, checked } = this.props
    const { value, disabled, showPartiallySelected, readOnly, clientId } = this.props
    const nodeLabelProps = { className: 'node-label' }

    // in case of simple select mode, there is no checkbox, so we need to handle the click via the node label
    // but not if the control is in readOnly or disabled state
    const shouldRegisterClickHandler = mode === 'simpleSelect' && !readOnly && !disabled

    if (shouldRegisterClickHandler) {
      nodeLabelProps.onClick = this.handleCheckboxChange
    }

    const sharedProps = { id, value, checked, disabled, readOnly, tabIndex: -1 }
    const className = ['checkbox-item', mode === 'simpleSelect' && 'simple-select'].filter(Boolean).join(' ')

    return (
      <label title={title || label} htmlFor={id}>
        {mode === 'radioSelect' ? (
          <RadioButton name={clientId} className="radio-item" onChange={this.handleCheckboxChange} {...sharedProps} />
        ) : (
          <Checkbox
            name={id}
            className={className}
            indeterminate={showPartiallySelected && partial}
            onChange={this.handleCheckboxChange}
            {...sharedProps}
          />
        )}
        <span {...nodeLabelProps}>{label}</span>
      </label>
    )
  }
}

export default NodeLabel
