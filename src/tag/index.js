import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import styles from './index.css'

const cx = cn.bind(styles)

const Tag = props => {
  const { id, label, onDelete } = props

  const onClick = e => {
    // this is needed to stop the drawer from closing
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id)
  }

  return (
    <span className={cx('tag')}>
      {label}
      <button onClick={onClick} className={cx('tag-remove')} type="button">
        x
      </button>
    </span>
  )
}

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func
}

export default Tag
