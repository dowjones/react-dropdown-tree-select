import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import styles from './index.css'
import { debounce } from '../utils'
import { getAriaLabel } from '../a11y'

const cx = cn.bind(styles)

class Input extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    texts: PropTypes.object,
    onInputChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTagRemove: PropTypes.func,
    onKeyDown: PropTypes.func,
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    activeDescendant: PropTypes.string,
    searchInputLocation: PropTypes.oneOf(['dropdownToggle', 'dropdownContent']),
  }

  constructor(props) {
    super(props)
    this.delayedCallback = debounce(e => this.props.onInputChange(e.target.value), 300)
  }

  handleInputChange = e => {
    e.persist()
    this.delayedCallback(e)
  }

  render() {
    const {
      inputRef,
      texts = {},
      onFocus,
      onBlur,
      disabled,
      readOnly,
      onKeyDown,
      activeDescendant,
      searchInputLocation,
    } = this.props

    return (
      <input
        type="text"
        disabled={disabled}
        ref={inputRef}
        className={cx('search', {
          'search-dropdown-trigger': searchInputLocation === 'dropdownToggle',
          'search-dropdown-content': searchInputLocation === 'dropdownContent',
        })}
        placeholder={texts.placeholder || 'Choose...'}
        onKeyDown={onKeyDown}
        onChange={this.handleInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        aria-activedescendant={activeDescendant}
        aria-autocomplete={onKeyDown ? 'list' : undefined}
        {...getAriaLabel(texts.label)}
      />
    )
  }
}

export default Input
