import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { getDataset } from '../dataset-utils'
import isEmpty from '../isEmpty'
import Tag from '../tag'

import styles from './index.css'

const cx = cn.bind(styles)

class Tags extends PureComponent {
  render() {
    const { tags, onDelete } = this.props

    if (isEmpty(tags)) return null

    return tags.map(tag => {
      const { _id, label, tagClassName, dataset } = tag
      return (
        <li className={cx('tag-item', tagClassName)} key={`tag-item-${_id}`} {...getDataset(dataset)}>
          <Tag label={label} id={_id} onDelete={onDelete} />
        </li>
      )
    })
  }
}

Tags.propTypes = {
  tags: PropTypes.array,
  onDelete: PropTypes.func
}

export default Tags
