import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { getAriaLabel } from '../a11y'
import { debounce } from '../utils'

const createDelayedCallback = callback => debounce(e => callback(e.target.value), 300)

function handleChange(onInputChange) {
  const delayedCallback = createDelayedCallback(onInputChange)
  return e => {
    e.persist()
    delayedCallback(e)
  }
}

const Input = props => {
  const {
    inputRef,
    texts = {},
    onFocus,
    onBlur,
    disabled,
    readOnly,
    onKeyDown,
    activeDescendant,
    onInputChange,
    inlineSearchInput,
  } = props
  return (
    <input
      type="text"
      disabled={disabled}
      ref={inputRef}
      className="search"
      placeholder={inlineSearchInput ? texts.inlineSearchPlaceholder || 'Search...' : texts.placeholder || 'Choose...'}
      onKeyDown={onKeyDown}
      onChange={handleChange(onInputChange)}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={readOnly}
      aria-activedescendant={activeDescendant}
      aria-autocomplete={onKeyDown ? 'list' : undefined}
      {...getAriaLabel(texts.label)}
    />
  )
}

Input.propTypes = {
  texts: PropTypes.shape({
    labelRemove: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
  }),
  onInputChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onTagRemove: PropTypes.func,
  onKeyDown: PropTypes.func,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  activeDescendant: PropTypes.string,
  inlineSearchInput: PropTypes.bool,
}

export default memo(Input)
