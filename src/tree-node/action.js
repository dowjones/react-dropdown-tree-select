import React from 'react'
import PropTypes from 'prop-types'

const handleClickFactory = ({ onAction, actionData }) => () => {
  if (onAction) {
    onAction(actionData.nodeId, actionData.action)
  }
}

const Action = props => {
  const { title, className, text, readOnly, onAction, actionData } = props
  let handleClick

  if (!readOnly) {
    handleClick = handleClickFactory({ onAction, actionData })
  }

  return (
    <button title={title} className={className} onClick={handleClick} onKeyUp={handleClick} type="button">
      {text}
    </button>
  )
}

export const actionType = {
  title: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  actionData: PropTypes.any,
  onAction: PropTypes.func,
  readOnly: PropTypes.bool,
}

Action.propTypes = actionType

Action.defaultProps = {
  onAction: () => {},
  title: undefined,
  text: undefined,
  className: undefined,
  actionData: PropTypes.object,
  readOnly: undefined,
}

export default Action
