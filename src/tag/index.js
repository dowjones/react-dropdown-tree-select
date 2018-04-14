import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import styles from './index.css'

const cx = cn.bind(styles)

class Tag extends PureComponent {
  handleClick = e => {
    const { id, onDelete } = this.props

    // this is needed to stop the drawer from closing
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onDelete(id)
  }

  render() {
    const { label } = this.props

    return (
      <span className={cx('tag')}>
        {label}
        <button onClick={this.handleClick} className={cx('tag-remove')} type="button">
          x
        </button>
      </span>
    )
  }
}

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func
}

export default Tag
