import React from 'react'
import PropTypes from 'prop-types'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    input.checked = checked
    input.indeterminate = indeterminate
  }
}

const Checkbox = props => {
  const { checked, indeterminate = false, onChange, disabled, readOnly, ...rest } = props
  const isDisabled = disabled || readOnly
  return (
    <input
      type="checkbox"
      ref={refUpdater({
        checked,
        indeterminate,
      })}
      onChange={onChange}
      disabled={isDisabled}
      {...rest}
    />
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
}

export default Checkbox
