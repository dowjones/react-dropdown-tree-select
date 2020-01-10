import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { getAriaLabel } from '../a11y'
import { getTagId } from '../tag'

class Trigger extends PureComponent {
  static propTypes = {
    onTrigger: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    showDropdown: PropTypes.bool,
    mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
    texts: PropTypes.object,
    clientId: PropTypes.string,
    tags: PropTypes.array,
  }

  getAriaAttributes = () => {
    const { mode, texts = {}, showDropdown, clientId, tags } = this.props

    const triggerId = `${clientId}_trigger`
    const labelledBy = []
    let labelAttributes = getAriaLabel(texts.label)
    if (tags && tags.length) {
      if (labelAttributes['aria-label']) {
        // Adds reference to self when having aria-label
        labelledBy.push(triggerId)
      }
      tags.forEach(t => {
        labelledBy.push(getTagId(t._id))
      })
      labelAttributes = getAriaLabel(texts.label, labelledBy.join(' '))
    }

    const attributes = {
      id: triggerId,
      role: 'button',
      tabIndex: 0,
      'aria-haspopup': mode === 'simpleSelect' ? 'listbox' : 'tree',
      'aria-expanded': showDropdown ? 'true' : 'false',
      ...labelAttributes,
    }

    return attributes
  }

  handleTrigger = e => {
    // Just return if triggered from keyDown and the key isn't enter, space or arrow down
    if (e.key && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 40) {
      return
    } else if (e.key && this.triggerNode && this.triggerNode !== document.activeElement) {
      // Do not trigger if not activeElement
      return
    } else if (!this.props.showDropdown && e.keyCode === 32) {
      // Avoid adding space to input on open
      e.preventDefault()
    }

    // Else this is a key press that should trigger the dropdown
    this.props.onTrigger(e)
  }

  render() {
    const { disabled, readOnly, showDropdown } = this.props

    const dropdownTriggerClassname = [
      'dropdown-trigger',
      'arrow',
      disabled && 'disabled',
      readOnly && 'readOnly',
      showDropdown && 'top',
      !showDropdown && 'bottom',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <a
        ref={node => {
          this.triggerNode = node
        }}
        className={dropdownTriggerClassname}
        onClick={!disabled ? this.handleTrigger : undefined}
        onKeyDown={!disabled ? this.handleTrigger : undefined}
        {...this.getAriaAttributes()}
      >
        {this.props.children}
      </a>
    )
  }
}

export default Trigger
