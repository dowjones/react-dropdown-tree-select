import PropTypes from 'prop-types'
import React from 'react'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    /* eslint-disable no-param-reassign */
    input.checked = checked
    input.indeterminate = indeterminate
    /* eslint-enable no-param-reassign */
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
