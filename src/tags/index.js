import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Tag from '../tag'
import styles from './index.css'
import { getDataset } from '../utils'

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

class Tags extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    onTagRemove: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    texts: PropTypes.object,
    children: PropTypes.node,
  }

  render() {
    const { tags, onTagRemove, texts = {}, disabled, readOnly, children } = this.props
    return (
      <ul className={cx('tag-list')}>
        {getTags(tags, onTagRemove, readOnly, disabled, texts.labelRemove)}
        {children && <li className={cx('tag-item')}>{children}</li>}
        {!children && (!tags || (tags && tags.length === 0)) && (
          <li className={cx('tag-item')}>
            <span className={cx('placeholder')}>{texts.placeholder || 'Choose...'}</span>
          </li>
        )}
      </ul>
    )
  }
}

export default Tags
