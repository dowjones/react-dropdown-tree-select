import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Checkbox extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool
  }

  state = { isChecked: this.props.checked || false }

  toggleCheckboxChange = () => {
    const { onChange, value } = this.props

    this.setState(({ isChecked }) => ({ isChecked: !isChecked }))

    onChange(value)
  }

  render() {
    const { label, value } = this.props
    const { isChecked } = this.state

    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" value={value} defaultChecked={isChecked} onChange={this.toggleCheckboxChange} />
          {label}
        </label>
      </div>
    )
  }
}

export default Checkbox
