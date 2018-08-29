import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    input.checked = checked
    input.indeterminate = indeterminate
  }
}

class Checkbox extends PureComponent {
  static propTypes = {
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    onChange: PropTypes.func
  }

  // this (stopPropagation) is needed since FireFox wrongly detects inside clicks
  // See https://github.com/dowjones/react-dropdown-tree-select/pull/154
  // and https://github.com/dowjones/react-dropdown-tree-select/issues/148
  handleChange = e => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    this.props.onChange(e)
  }

  render() {
    const { checked, indeterminate = false, onChange, ...rest } = this.props

    return <input type="checkbox" ref={refUpdater({ checked, indeterminate })} onChange={this.handleChange} {...rest} />
  }
}

export default Checkbox
