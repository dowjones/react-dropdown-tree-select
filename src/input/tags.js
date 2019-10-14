import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React from 'react'

import { getDataset } from '../utils'
import Tag from '../tag'

import styles from './index.css'

const cx = cn.bind(styles)

const getTags = (tags = [], onDelete, readOnly, disabled, labelRemove) =>
  tags.map(tag => {
    const { _id, label, tagClassName, dataset } = tag
    return (
      <li className={cx('tag-item', tagClassName)} key={`tag-item-${_id}`} {...getDataset(dataset)}>
        <Tag
          label={label}
          id={_id}
          onDelete={onDelete}
          readOnly={readOnly}
          disabled={disabled}
          labelRemove={labelRemove}
        />
      </li>
    )
  })

export const tagType = {
  _id: PropTypes.string,
  label: PropTypes.string,
  tagClassName: PropTypes.string,
  dataset: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
}

// export const tagsType = {
//   tags: PropTypes.arrayOf(PropTypes.shape(tagType)),
//   onDelete: PropTypes.func,
//   readOnly: PropTypes.bool,
//   disabled: PropTypes.bool,
//   labelRemove: PropTypes.string,
// }

export default getTags
