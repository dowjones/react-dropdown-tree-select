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

  render() {
    const { id, label, readOnly, disabled } = this.props

    const tagId = `${id}_tag`
    const className = cx('tag-remove', { readOnly }, { disabled })
    const onClick = !readOnly && !disabled ? this.handleClick : undefined

    return (
      <span className={cx('tag')} id={tagId}>
        {label}
        <button onClick={onClick} className={className} type="button" aria-label="Delete" aria-labelledby={tagId} aria-readonly={readOnly || disabled}>
          x
        </button>
      </span>
    )
  }
}

export default Tag
