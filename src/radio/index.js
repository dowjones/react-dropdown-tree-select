import PropTypes from 'prop-types'
import React, { memo } from 'react'

export const refUpdater = ({ checked }) => input => {
  if (input) {
    input.checked = checked
  }
}

const RadioButton = props => {
  const { name, checked, onChange, disabled, readOnly, ...rest } = props
  const isDisabled = disabled || readOnly
  return (
    <input
      type="radio"
      name={name}
      ref={refUpdater({
        checked,
      })}
      onChange={onChange}
      disabled={isDisabled}
      {...rest}
    />
  )
}

RadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
}

export default memo(RadioButton)
