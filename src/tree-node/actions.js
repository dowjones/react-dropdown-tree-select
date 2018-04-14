import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Action from './action'
import isEmpty from '../isEmpty'

class Actions extends PureComponent {
  render() {
    const { actions, onAction, _id } = this.props

    if (isEmpty(actions)) return null

    // we _do_ want to rely on array index here
    // eslint-disable-next-line react/no-array-index-key
    return actions || [].map((a, idx) => <Action key={`action-${idx}`} {...a} actionData={{ action: a.id, _id }} onAction={onAction} />)
  }
}

Actions.propTypes = {
  _id: PropTypes.string.isRequired,
  actions: PropTypes.array,
  onAction: PropTypes.func
}

export default Actions
