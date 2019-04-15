import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Tag from '../tag'
import styles from './index.css'
import { getDataset, debounce } from '../utils'

const cx = cn.bind(styles)

const getTags = (tags = [], onDelete, readOnly, disabled) =>
  tags.map(tag => {
    const { _id, label, tagClassName, dataset } = tag
    return (
      <li className={cx('tag-item', tagClassName)} key={`tag-item-${_id}`} {...getDataset(dataset)}>
        <Tag label={label} id={_id} onDelete={onDelete} readOnly={readOnly} disabled={disabled} />
      </li>
    )
  })

class Input extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    texts: PropTypes.object,
    onInputChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTagRemove: PropTypes.func,
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.delayedCallback = debounce(e => this.props.onInputChange(e.target.value), 300)
  }

  handleInputChange = e => {
    e.persist()
    this.delayedCallback(e)
  }

  render() {
    const { tags, onTagRemove, inputRef, texts = {}, onFocus, onBlur, disabled, readOnly } = this.props

    return (
      <ul className={cx('tag-list')}>
        {getTags(tags, onTagRemove, readOnly, disabled)}
        <li className={cx('tag-item')}>
          <input
            type="text"
            disabled={disabled}
            ref={inputRef}
            className={cx('search')}
            placeholder={texts.placeholder || 'Choose...'}
            onChange={this.handleInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
          />
        </li>
      </ul>
    )
  }
}

export default Input
