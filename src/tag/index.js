import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import styles from './index.css'

const cx = cn.bind(styles)

class Tag extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    originalObject: PropTypes.object,
    onDelete: PropTypes.func,
    tagRenderer: PropTypes.func,
    readOnly: PropTypes.bool
  }

  handleClick = e => {
    const { id, onDelete } = this.props
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id)
  }

  render() {
    const { label, originalObject, readOnly, tagRenderer } = this.props

    return tagRenderer
      ? tagRenderer(originalObject, this.handleClick)
      : <span className={cx('tag')}>
        {label}
        <button onClick={!readOnly ? this.handleClick : undefined} className={cx('tag-remove', { readOnly })} type="button">
          x
        </button>
      </span>
  }
}

export default Tag
