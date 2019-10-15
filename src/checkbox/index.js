import PropTypes from 'prop-types'
import React, { memo, useCallback } from 'react'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    input.checked = checked
    input.indeterminate = indeterminate
  }
}

const Checkbox = props => {
  const { checked, indeterminate = false, onChange, disabled, readOnly, ...rest } = props
  const isDisabled = disabled || readOnly

  const ref = useCallback(node => {
    if (node) {
      node.checked = checked
      node.indeterminate = indeterminate
    }
  }, [])

  return <input type="checkbox" ref={ref} onChange={onChange} disabled={isDisabled} {...rest} />
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
}

export default memo(Checkbox)
