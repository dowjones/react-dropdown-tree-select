import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Checkbox from '../checkbox'

import styles from './index.css'

const cx = cn.bind(styles)

class NodeLabel extends PureComponent {
  handleCheckboxChange = e => {
    const { simpleSelect, id, onCheckboxChange } = this.props
    let { target: { checked } } = e

    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    if (simpleSelect) {
      checked = true
    }

    onCheckboxChange(id, checked)
  }

  handleCheckboxChange
  render() {
    const { simpleSelect, title, label, id, partial, checked, value, disabled, showPartiallySelected } = this.props
    const nodeLabelProps = { className: 'node-label' }

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
        />
        <span {...nodeLabelProps}>{label}</span>
      </label>
    )
  }
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
