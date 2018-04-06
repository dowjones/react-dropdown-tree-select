import React from 'react'
import PropTypes from 'prop-types'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    input.checked = checked
    input.indeterminate = indeterminate
  }
}

const Checkbox = props => {
  const { checked, indeterminate = false, onChange, ...rest } = props

  return <input type="checkbox" ref={refUpdater({ checked, indeterminate })} onChange={onChange} {...rest} />
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func
}

export default Checkbox
