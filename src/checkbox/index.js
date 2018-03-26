import React from 'react'

export const refUpdater = ({ checked, indeterminate }) => input => {
  if (input) {
    input.checked = checked
    input.indeterminate = indeterminate
  }
}

const Checkbox = props => {
  const { className, checked, indeterminate = false, onChange, ...rest } = props

  return <input type="checkbox" className={className} ref={refUpdater({ checked, indeterminate })} onChange={onChange} {...rest} />
}

export default Checkbox
