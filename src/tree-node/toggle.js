import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styles from './index.css'

const cx = cn.bind(styles)

class Toggle extends PureComponent {
  static propTypes = {
    expanded: PropTypes.bool,
    isLeaf: PropTypes.bool,
    onNodeToggle: PropTypes.func,
    id: PropTypes.string,
    iconRenderer: PropTypes.func
  }

  onToggle = () => {
    this.props.onNodeToggle(this.props.id)
  }

  render() {
    const { expanded, isLeaf, iconRenderer } = this.props
    const toggleCx = cx('toggle', { expanded: !isLeaf && expanded, collapsed: !isLeaf && !expanded })
    return iconRenderer
      ? iconRenderer(toggleCx, this.onToggle)
      : <i className={toggleCx} onClick={this.onToggle} />
  }
}

export default Toggle
