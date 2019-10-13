import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types'

export const refUpdater = ({ checked }) => input => {
  if (input) {
    // eslint-disable-next-line no-param-reassign
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

RadioButton.defaultProps = {
  checked: undefined,
  onChange: () => {},
  disabled: undefined,
  readOnly: undefined,
}

export default RadioButton
