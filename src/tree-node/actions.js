import PropTypes from 'prop-types'
import React from 'react'

import { isEmpty } from '../utils'
import Action, { actionType } from './action'

const Actions = ({ actions, id, ...rest }) => {
  if (isEmpty(actions)) return null

  return actions.map((a, idx) => {
    const actionId = a.id || `action-${idx}`
    return (
      <Action
        key={actionId}
        {...rest}
        {...a}
        actionData={{
          action: { ...a, id: actionId },
          nodeId: id,
        }}
      />
    )
  })
}

Actions.propTypes = {
  id: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape(actionType)),
}

Actions.defaultProps = { actions: undefined }

export default Actions
