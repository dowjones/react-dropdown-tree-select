import React from 'react'
import PropTypes from 'prop-types'

const Action = props => {
  const { title, className, text, onAction, actionData } = props

  const onClick = () => {
    if (typeof onAction === 'function') {
      onAction(actionData)
    }
  }

  return (
    <i title={title} className={className} onClick={onClick}>
      {text}
    </i>
  )
}

Action.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  actionData: PropTypes.object,
  onAction: PropTypes.func
}

export default Action
