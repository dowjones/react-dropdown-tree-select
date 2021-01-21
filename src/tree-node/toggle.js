import PropTypes from 'prop-types'
import React from 'react'

const Toggle = props => {
  const { expanded, isLeaf, onNodeToggle, id } = props

  const onToggle = e => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    onNodeToggle(id)
  }

  const onKeyDown = e => {
    if (e.key === 'Enter' || e.keyCode === 32) {
      onNodeToggle(id)
      e.preventDefault()
    }
  }

  const toggleCx = ['toggle', expanded && 'expanded', !expanded && 'collapsed'].filter(Boolean).join(' ')

  if (isLeaf) {
    return <i role="button" tabIndex={-1} className={toggleCx} style={{ visibility: 'hidden' }} aria-hidden />
  }

  return <i role="button" tabIndex={-1} className={toggleCx} onClick={onToggle} onKeyDown={onKeyDown} aria-hidden />
}

Toggle.propTypes = {
  expanded: PropTypes.bool,
  isLeaf: PropTypes.bool,
  onNodeToggle: PropTypes.func,
  id: PropTypes.string,
}

export default Toggle
