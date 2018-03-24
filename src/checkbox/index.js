import React from 'react'

const Checkbox = props => {
  const { className, checked, indeterminate = false, onChange, ...rest } = props
  return (
    <input
      type="checkbox"
      className={className}
      ref={input => {
        if (input) {
          input.checked = checked
          input.indeterminate = indeterminate
        }
      }}
      onChange={onChange}
      {...rest}
    />
  )
}

export default Checkbox
