import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

class Toggle extends PureComponent {
  static propTypes = {
    expanded: PropTypes.bool,
    isLeaf: PropTypes.bool,
    onNodeToggle: PropTypes.func,
    id: PropTypes.string,
  }

  onToggle = e => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    this.props.onNodeToggle(this.props.id)
  }

  onKeyDown = e => {
    if (e.key === 'Enter' || e.keyCode === 32) {
      this.props.onNodeToggle(this.props.id)
      e.preventDefault()
    }
  }

  render() {
    const { expanded, isLeaf } = this.props
    if (isLeaf) return null

    const toggleCx = ['toggle', expanded && 'expanded', !expanded && 'collapsed'].filter(Boolean).join(' ')
    return (
      <i
        role="button"
        tabIndex={-1}
        className={toggleCx}
        onClick={this.onToggle}
        onKeyDown={this.onKeyDown}
        aria-hidden
      />
    )
  }
}

export default Toggle
