import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import styles from './index.css'

const cx = cn.bind(styles)

class Tag extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onDelete: PropTypes.func
  }

  handleClick = e => {
    const { id, onDelete } = this.props
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id)
  }

  render() {
    const { label } = this.props

    return (
      <span className={cx('tag')}>
        {label}
        <button onClick={this.handleClick} className={cx('tag-remove')} type="button">
          x
        </button>
      </span>
    )
  }
}

export default Tag
