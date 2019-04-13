import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import styles from './index.css'

const cx = cn.bind(styles)

class Tag extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  handleClick = e => {
    const { id, onDelete } = this.props
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id)
  }

  render() {
    const { label, readOnly, disabled } = this.props

    return (
      <span className={cx('tag')}>
        {label}
        <button
          onClick={!readOnly && !disabled ? this.handleClick : undefined}
          className={cx('tag-remove', { readOnly }, { disabled })}
          type="button"
        >
          x
        </button>
      </span>
    )
  }
}

export default Tag
