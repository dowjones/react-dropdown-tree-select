import PropTypes from 'prop-types'
import React, { memo, useCallback, useRef } from 'react'

import { getAriaLabel } from '../a11y'
import { getTagId } from '../tag'
import { tagType } from '../tags'

const getAriaAttributes = ({ mode, texts, showDropdown, clientId, tags, tabIndex }) => {
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
    tabIndex,
    'aria-haspopup': mode === 'simpleSelect' ? 'listbox' : 'tree',
    'aria-expanded': showDropdown ? 'true' : 'false',
    ...labelAttributes,
  }

  return attributes
}

const Trigger = props => {
  const triggerNode = useRef()

  const ref = useCallback(node => {
    triggerNode.current = node
  }, [])

  const { disabled, readOnly, mode, texts = {}, showDropdown, clientId, tags, onTrigger, children, tabIndex } = props
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

  const handleTrigger = e => {
    // Just return if triggered from keyDown and the key isn't enter, space or arrow down
    if (e.key && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 40) {
      return
    }

    if (e.key && triggerNode.current && triggerNode.current !== document.activeElement) {
      // Do not trigger if not activeElement
      return
    }

    if (!showDropdown && e.keyCode === 32) {
      // Avoid adding space to input on open
      e.preventDefault()
    }

    // Else this is a key press that should trigger the dropdown
    onTrigger(e)
  }

  return (
    <a
      ref={ref}
      className={dropdownTriggerClassname}
      onClick={!disabled ? handleTrigger : undefined}
      onKeyDown={!disabled ? handleTrigger : undefined}
      {...getAriaAttributes({
        mode,
        texts,
        showDropdown,
        clientId,
        tags,
        tabIndex,
      })}
    >
      {children}
    </a>
  )
}

Trigger.propTypes = {
  onTrigger: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  showDropdown: PropTypes.bool,
  mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
  texts: PropTypes.shape({ label: PropTypes.string }),
  clientId: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.shape(tagType)),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  tabIndex: PropTypes.number,
}

export default memo(Trigger)
