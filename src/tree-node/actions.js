import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Action from './action'
import { isEmpty } from '../utils'

class Actions extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.array,
  }

  render() {
    const { actions, id, ...rest } = this.props

    if (isEmpty(actions)) return null

    return actions.map((a, idx) => {
      const actionId = a.id || `action-${idx}`
      return <Action key={actionId} {...rest} {...a} actionData={{ action: { ...a, id: actionId }, nodeId: id }} />
    })
  }
}

export default Actions
