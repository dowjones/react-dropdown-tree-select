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
    disabled: PropTypes.bool
  }

  handleClick = e => {
    const { id, onDelete } = this.props
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id)
  }

  onKeyDown = e => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.handleClick(e)
      e.preventDefault()
    }
  }

  render() {
    const { id, label, readOnly, disabled } = this.props

    const tagId = `${id}_tag`
    const className = cx('tag-remove', { readOnly }, { disabled })
    const onClick = !readOnly && !disabled ? this.handleClick : undefined
    const onKeyDown = !readOnly && !disabled ? this.onKeyDown : undefined

    return (
      <span className={cx('tag')} id={tagId}>
        {label}
        <button onClick={onClick} onKeyDown={onKeyDown} className={className} type="button" aria-label="Delete" aria-labelledby={tagId} aria-disabled={readOnly || disabled}>
          x
        </button>
      </span>
    )
  }
}

export default Tag
