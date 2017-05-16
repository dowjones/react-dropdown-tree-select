import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Action extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    actionData: PropTypes.object,
    onAction: PropTypes.func
  }

  onClick = (e) => {
    if (typeof this.props.onAction === 'function') {
      this.props.onAction(this.props.actionData)
    }
  }

  render () {
    const { title, className } = this.props
    return <i title={title} className={className} onClick={this.onClick} />
  }
}

export default Action
