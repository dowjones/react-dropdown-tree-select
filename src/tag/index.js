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
    labelRemove: PropTypes.string,
  }

  handleClick = e => {
    const { id, onDelete } = this.props
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id, (e.key || e.keyCode) !== undefined)
  }

  onKeyDown = e => {
    if (e.key === 'Backspace') {
      this.handleClick(e)
      e.preventDefault()
    }
  }

  onKeyUp = e => {
    if (e.keyCode === 32 || ['Delete', 'Enter'].indexOf(e.key) > -1) {
      this.handleClick(e)
      e.preventDefault()
    }
  }

  render() {
    const { id, label, labelRemove = 'Remove', readOnly, disabled } = this.props

    const tagId = `${id}_tag`
    const buttonId = `${id}_button`
    const className = cx('tag-remove', { readOnly }, { disabled })
    const isDisabled = readOnly || disabled
    const onClick = !isDisabled ? this.handleClick : undefined
    const onKeyDown = !isDisabled ? this.onKeyDown : undefined
    const onKeyUp = !isDisabled ? this.onKeyUp : undefined

    return (
      <span className={cx('tag')} id={tagId}>
        {label}
        <button
          id={buttonId}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className={className}
          type="button"
          aria-label={labelRemove}
          aria-labelledby={`${buttonId} ${tagId}`}
          aria-disabled={isDisabled}
        >
          x
        </button>
      </span>
    )
  }
}

export default Tag
