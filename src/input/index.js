import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import debounce from 'lodash/debounce'
import Tag from '../tag'
import styles from './index.css'

const cx = cn.bind(styles)

class Input extends Component {
  static propTypes = {
    tags: PropTypes.array,
    value: PropTypes.string,
    placeholderText: PropTypes.string,
    onInputChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTagRemove: PropTypes.func,
    inputRef: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.delayedCallback = debounce((e) => {
      this.props.onInputChange(e.target.value)
    }, 50, {
      leading: true
    })
  }

  onInputChange = (e) => {
    e.persist()
    this.delayedCallback(e)
  }

  getTags (tags = [], onDelete) {
    return tags.map(
      (tag, i) => {
        const { _id, label, tagClassName } = tag
        return (
          <li className={cx('tag-item', tagClassName)} key={`tag-${i}`}>
            <Tag
              label={label}
              id={_id}
              onDelete={onDelete}
            />
          </li>
        )
      }
    )
  }

  render () {
    return (
      <span>
        <ul className={cx('tag-list')}>
          {this.getTags(this.props.tags, this.props.onTagRemove)}
          <li className={cx('tag-item')}>
            <input type='text'
              ref={this.props.inputRef}
              placeholder={this.props.placeholderText || 'Choose...'}
              onChange={this.onInputChange}
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur} />
          </li>
        </ul>
      </span>
    )
  }
}

export default Input
