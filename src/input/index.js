import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import debounce from 'lodash.debounce'
import Tag from '../tag'
import styles from './index.css'
import { getDataset } from '../dataset-utils'

const cx = cn.bind(styles)

const getTags = (tags = [], onDelete) => tags.map((tag, i) => {
  const {
    _id, label, tagClassName, dataset,
  } = tag
  return (
    <li className={cx('tag-item', tagClassName)} key={`tag-${i}`} {...getDataset(dataset)}>
      <Tag label={label} id={_id} onDelete={onDelete} />
    </li>
  )
})

const Input = (props) => {
  const {
    tags,
    onTagRemove,
    inputRef,
    placeholderText = 'Choose...',
    onFocus,
    onBlur,
  } = props

  const delayedCallback = debounce((e) => {
    props.onInputChange(e.target.value)
  }, 50, { leading: true })

  const onInputChange = (e) => {
    e.persist()
    delayedCallback(e)
  }

  return (
    <ul className={cx('tag-list')}>
      {getTags(tags, onTagRemove)}
      <li className={cx('tag-item')}>
        <input
          type="text"
          ref={inputRef}
          className={cx('search')}
          placeholder={placeholderText}
          onChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </li>
    </ul>
  )
}

Input.propTypes = {
  tags: PropTypes.array,
  value: PropTypes.string,
  placeholderText: PropTypes.string,
  onInputChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onTagRemove: PropTypes.func,
  inputRef: PropTypes.func,
}

export default Input
