import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Action extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string,
    actionData: PropTypes.object,
    onAction: PropTypes.func,
    readOnly: PropTypes.bool
  }

  static defaultProps = {
    onAction: () => {}
  }

  handleClick = () => {
    this.props.onAction(this.props.actionData)
  }

  render() {
    const { title, className, text, readOnly } = this.props

    return (
      <i title={title} className={className} onClick={!readOnly && this.handleClick}>
        {text}
      </i>
    )
  }
}

export default Action
