import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Checkbox, { refUpdater } from '../checkbox'

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
    path: PropTypes.array,
    partial: PropTypes.bool,
    expanded: PropTypes.bool,
    disabled: PropTypes.bool,
    dataset: PropTypes.object,
    simpleSelect: PropTypes.bool,
    showPartiallySelected: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    nodeRenderer: PropTypes.func
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
    const { simpleSelect, title, label, id, path, partial, checked, value, disabled, showPartiallySelected, nodeRenderer } = this.props
    const nodeLabelProps = { className: 'node-label' }

    if (simpleSelect) {
      nodeLabelProps.onClick = this.handleCheckboxChange
    }

    return nodeRenderer
      ? nodeRenderer({
        id,
        value,
        disabled,
        checked,
        path,
        refUpdater,
        title: title || label,
        onChange: this.handleCheckboxChange,
        indeterminate: showPartiallySelected && partial
      })
      : <label title={title || label} htmlFor={id}>
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
  }
}

export default NodeLabel
