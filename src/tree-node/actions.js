import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Action from './action'
import { isEmpty } from '../utils'

class Actions extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    actions: PropTypes.array,
    onAction: PropTypes.func
  }

  static defaultProps = {
    onAction: () => {}
  }

  render() {
    const { actions, onAction, id } = this.props

    if (isEmpty(actions)) return null

    // we _do_ want to rely on array index here
    // eslint-disable-next-line react/no-array-index-key
    return actions.map((a, idx) => <Action key={`action-${idx}`} {...a} actionData={{ action: a.id, id }} onAction={onAction} />)
  }
}

export default Actions
