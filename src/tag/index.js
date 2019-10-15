import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

import styles from './index.css'

const cx = cn.bind(styles)

export const getTagId = id => `${id}_tag`

const onClickFactory = ({ id, onDelete }) => e => {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
  onDelete(id, (e.key || e.keyCode) !== undefined)
}

const onKeyDownFactory = ({ handleClick }) => e => {
  if (e.key === 'Backspace') {
    handleClick(e)
    e.preventDefault()
  }
}

const onKeyUpFactory = ({ handleClick }) => e => {
  if (e.keyCode === 32 || ['Delete', 'Enter'].indexOf(e.key) > -1) {
    handleClick(e)
    e.preventDefault()
  }
}

const Tag = props => {
  const { id, label, labelRemove = 'Remove', readOnly, disabled, onDelete } = props
  const tagId = getTagId(id)
  const buttonId = `${id}_button`
  const className = cx('tag-remove', { readOnly, disabled })
  const isDisabled = readOnly || disabled
  let handleClick
  let handleKeyDown
  let handleKeyUp

  if (!isDisabled) {
    handleClick = onClickFactory({ id, onDelete })
    handleKeyDown = onKeyDownFactory({ handleClick })
    handleKeyUp = onKeyUpFactory({ handleClick })
  }

  return (
    <span className={cx('tag')} id={tagId} aria-label={label}>
      {label}
      <button
        id={buttonId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
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

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  labelRemove: PropTypes.string,
}

export default memo(Tag)
