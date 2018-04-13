import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import styles from './index.css'

const cx = cn.bind(styles)

class Toggle extends PureComponent {
  onToggle = () => {
    this.props.onNodeToggle(this.props.id)
  }

  render() {
    const { expanded, isLeaf } = this.props
    console.log('Toggle Render', this.props.id, expanded, isLeaf)
    const toggleCx = cx('toggle', { expanded: !isLeaf && expanded, collapsed: !isLeaf && !expanded })
    return <i className={toggleCx} onClick={this.onToggle} />
  }
}

Toggle.propTypes = {
  expanded: PropTypes.bool,
  isLeaf: PropTypes.bool,
  onNodeToggle: PropTypes.func,
  id: PropTypes.string
}

export default Toggle
