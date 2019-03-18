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
    expanded: PropTypes.bool,
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    simpleSelect: PropTypes.bool,
    radioSelect: PropTypes.bool,
    showPartiallySelected: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    readOnly: PropTypes.bool,
    clientId: PropTypes.string
  }

  handleCheckboxChange = e => {
    const { simpleSelect, id, onCheckboxChange } = this.props

    if (simpleSelect) {
      onCheckboxChange(id, true)
    } else {
      const { target: { checked } } = e
      onCheckboxChange(id, checked)
    }
  }

  render() {
    const { simpleSelect, radioSelect, title, label, id, partial, checked } = this.props
    const { value, disabled, showPartiallySelected, readOnly, clientId } = this.props
    const nodeLabelProps = { className: 'node-label' }

    // in case of simple select mode, there is no checkbox, so we need to handle the click via the node label
    // but not if the control is in readOnly or disabled state
    const shouldRegisterClickHandler = simpleSelect && !readOnly && !disabled

    if (shouldRegisterClickHandler) {
      nodeLabelProps.onClick = this.handleCheckboxChange
    }

    const sharedProps = { id, value, checked, disabled, readOnly }

    return (
      <label title={title || label} htmlFor={id}>
        {radioSelect ?
          <RadioButton name={clientId} className="radio-item" onChange={this.handleCheckboxChange} {...sharedProps} /> :
          <Checkbox name={id} className="checkbox-item" indeterminate={showPartiallySelected && partial} onChange={this.handleCheckboxChange} {...sharedProps} />}
        <span {...nodeLabelProps}>{label}</span>
      </label>
    )
  }
}

export default NodeLabel
