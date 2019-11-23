import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Tag from '../tag'
import styles from './index.css'
import { getDataset } from '../utils'

const cx = cn.bind(styles)

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
        {tags.map(tag => {
          const { _id, label, tagClassName, dataset } = tag
          return (
            <li className={cx('tag-item', tagClassName)} key={`tag-item-${_id}`} {...getDataset(dataset)}>
              <Tag
                label={label}
                id={_id}
                onDelete={onTagRemove}
                readOnly={readOnly}
                disabled={disabled}
                labelRemove={texts.labelRemove}
              />
            </li>
          )
        })}
        {children && <li className={cx('tag-item')}>{children}</li>}
        {!children && tags.length === 0 && (
          <li className={cx('tag-item')}>
            <span className={cx('placeholder')}>{texts.placeholder || 'Choose...'}</span>
          </li>
        )}
      </ul>
    )
  }
}

export default Tags
