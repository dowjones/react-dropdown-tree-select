import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import styles from './index.css'

const cx = cn.bind(styles)

class Button extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onDelete: PropTypes.func
  }

  render () {
    return (
      <button onClick={this.onClick} className={cx('tag-remove')} type='button'>x</button>
    )
  }

  onClick = (e) => {
    // this is needed to stop the drawer from closing
    e.stopPropagation()
    this.props.onDelete(this.props.id)
  }
}

class Tag extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onDelete: PropTypes.func
  }

  render () {
    const { id, label, onDelete } = this.props
    return (
      <span className={cx('tag')}>
        {label}
        <Button id={id} onDelete={onDelete} />
      </span>
    )
  }
}

export default Tag
