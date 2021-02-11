import React from 'react'
import PropTypes from 'prop-types'
import Tag from '../tag'
import { getDataset } from '../utils'

import './index.css'

const getTags = (tags = [], onDelete, readOnly, disabled, labelRemove) =>
  tags.map(tag => {
    const { _id, label, tagClassName, dataset, tagLabel } = tag
    return (
      <li
        className={['tag-item', tagClassName].filter(Boolean).join(' ')}
        key={`tag-item-${_id}`}
        {...getDataset(dataset)}
      >
        <Tag
          label={tagLabel || label}
          id={_id}
          onDelete={onDelete}
          readOnly={readOnly}
          disabled={disabled || tag.disabled}
          labelRemove={labelRemove}
        />
      </li>
    )
  })

const Tags = ({ tags, onTagRemove, texts = {}, disabled, readOnly, children }) => {
  const lastItem = children || <span className="placeholder">{texts.placeholder || 'Choose...'}</span>

  return (
    <ul className="tag-list">
      {getTags(tags, onTagRemove, readOnly, disabled, texts.labelRemove)}
      <li className="tag-item">{lastItem}</li>
    </ul>
  )
}

export const tagType = {
  _id: PropTypes.string,
  label: PropTypes.string,
  tagClassName: PropTypes.string,
  dataset: PropTypes.objectOf(PropTypes.string),
}

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape(tagType)),
  onTagRemove: PropTypes.func,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  texts: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.node,
}

export default Tags
