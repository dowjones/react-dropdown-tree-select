import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Checkbox from '../checkbox'

import styles from './index.css'

const cx = cn.bind(styles)

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
    showPartiallySelected: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    readOnly: PropTypes.bool
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
    const { simpleSelect, title, label, id, partial, checked, value, disabled, showPartiallySelected, readOnly } = this.props
    const nodeLabelProps = { className: 'node-label' }

    // in case of simple select mode, there is no checkbox, so we need to handle the click via the node label
    // but not if the control is in readOnly state
    const shouldRegisterClickHandler = simpleSelect && !readOnly

    if (shouldRegisterClickHandler) {
      nodeLabelProps.onClick = this.handleCheckboxChange
    }

    return (
      <label title={title || label} htmlFor={id}>
        <Checkbox
          name={id}
          id={id}
          indeterminate={showPartiallySelected && partial}
          className={cx('checkbox-item', { 'simple-select': simpleSelect })}
          checked={checked}
          onChange={this.handleCheckboxChange}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
        />
        <span {...nodeLabelProps}>{label}</span>
      </label>
    )
  }
}

export default NodeLabel
