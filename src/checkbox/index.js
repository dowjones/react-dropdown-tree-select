import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    input.checked = checked
    input.indeterminate = indeterminate
  }
}

class Checkbox extends PureComponent {
  handleChange = ({ target: { value, checked } }) => {
    this.props.onChange({ value, checked })
  }

  render() {
    const { checked, indeterminate = false, onChange, ...rest } = this.props

    return <input type="checkbox" ref={refUpdater({ checked, indeterminate })} onChange={onChange} {...rest} />
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func
}

export default Checkbox
