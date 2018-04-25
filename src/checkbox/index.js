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

  render() {
    const { checked, indeterminate = false, onChange, ...rest } = this.props

    return <input type="checkbox" ref={refUpdater({ checked, indeterminate })} onChange={onChange} {...rest} />
  }
}

export default Checkbox
