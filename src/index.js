/*!
 * React Dropdown Tree Select
 * A lightweight, fast and highly customizable tree select component.
 * Hrusikesh Panda <hrusikesh.panda@dowjones.com>
 * Copyright (c) 2017 Dow Jones, Inc. <support@dowjones.com> (http://dowjones.com)
 * license MIT
 * see https://github.com/dowjones/react-dropdown-tree-select
 */
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { isOutsideClick, clientIdGenerator } from './utils'
import { getAriaLabel } from './a11y'
import Input from './input'
import Tree from './tree'
import TreeManager from './tree-manager'
import keyboardNavigation from './tree-manager/keyboardNavigation'

import styles from './index.css'

const cx = cn.bind(styles)

class DropdownTreeSelect extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    clearSearchOnChange: PropTypes.bool,
    keepTreeOnSearch: PropTypes.bool,
    keepChildrenOnSearch: PropTypes.bool,
    keepOpenOnSelect: PropTypes.bool,
    placeholderText: PropTypes.string,
    showDropdown: PropTypes.bool,
    showDropdownAlways: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onAction: PropTypes.func,
    onNodeToggle: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    simpleSelect: PropTypes.bool,
    radioSelect: PropTypes.bool,
    noMatchesText: PropTypes.string,
    showPartiallySelected: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hierarchical: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    labelRemove: PropTypes.string,
  }

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      showDropdown: this.props.showDropdown || this.props.showDropdownAlways || false,
      searchModeOn: false,
      currentFocus: undefined,
    }
    this.clientId = props.id || clientIdGenerator.get(this)
  }

  initNewProps = ({ data, simpleSelect, radioSelect, showPartiallySelected, hierarchical }) => {
    this.treeManager = new TreeManager({
      data,
      simpleSelect,
      radioSelect,
      showPartiallySelected,
      hierarchical,
      rootPrefixId: this.clientId,
    })
    // Restore focus-state
    const currentFocusNode = this.state.currentFocus && this.treeManager.getNodeById(this.state.currentFocus)
    if (currentFocusNode) {
      currentFocusNode._focused = true
    }
    this.setState(this.treeManager.getTreeAndTags())
  }

  resetSearchState = () => {
    // clear the search criteria and avoid react controlled/uncontrolled warning
    this.searchInput.value = ''
    return {
      tree: this.treeManager.restoreNodes(), // restore the tree to its pre-search state
      searchModeOn: false,
      allNodesHidden: false,
    }
  }

  componentWillMount() {
    const { data, hierarchical } = this.props
    this.initNewProps({ data, hierarchical, ...this.props })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false)
  }

  componentWillReceiveProps(nextProps) {
    this.initNewProps(nextProps)
  }

  handleClick = (e, callback) => {
    this.setState(prevState => {
      // keep dropdown active when typing in search box
      const showDropdown = this.props.showDropdownAlways || this.keepDropdownActive || !prevState.showDropdown

      // register event listeners only if there is a state change
      if (showDropdown !== prevState.showDropdown) {
        if (showDropdown) {
          document.addEventListener('click', this.handleOutsideClick, false)
        } else {
          document.removeEventListener('click', this.handleOutsideClick, false)
        }
      }

      if (showDropdown) this.props.onFocus()
      else this.props.onBlur()

      return !showDropdown ? { showDropdown, ...this.resetSearchState() } : { showDropdown }
    }, callback)
  }

  handleOutsideClick = e => {
    if (this.props.showDropdownAlways || !isOutsideClick(e, this.node)) {
      return
    }

    this.handleClick()
  }

  onInputChange = value => {
    const { allNodesHidden, tree } = this.treeManager.filterTree(
      value,
      this.props.keepTreeOnSearch,
      this.props.keepChildrenOnSearch
    )
    const searchModeOn = value.length > 0

    this.setState({
      tree,
      searchModeOn,
      allNodesHidden,
    })
  }

  onTagRemove = (id, isKeyboardEvent) => {
    const { tags: prevTags } = this.state
    this.onCheckboxChange(id, false, tags => {
      if (!isKeyboardEvent) return

      keyboardNavigation.getNextFocusAfterTagDelete(id, prevTags, tags, this.searchInput).focus()
    })
  }

  onNodeToggle = id => {
    this.treeManager.toggleNodeExpandState(id)
    const tree = this.state.searchModeOn ? this.treeManager.matchTree : this.treeManager.tree
    this.setState({ tree })
    typeof this.props.onNodeToggle === 'function' && this.props.onNodeToggle(this.treeManager.getNodeById(id))
  }

  onCheckboxChange = (id, checked, callback) => {
    const { simpleSelect, radioSelect, keepOpenOnSelect } = this.props
    this.treeManager.setNodeCheckedState(id, checked)
    let tags = this.treeManager.tags
    const isSingleSelect = simpleSelect || radioSelect
    const showDropdown = isSingleSelect && !keepOpenOnSelect ? false : this.state.showDropdown

    if (!tags.length) {
      this.treeManager.restoreDefaultValues()
      tags = this.treeManager.tags
    }

    const tree = this.state.searchModeOn ? this.treeManager.matchTree : this.treeManager.tree
    const nextState = {
      tree,
      tags,
      showDropdown,
    }

    if ((isSingleSelect && !showDropdown) || this.props.clearSearchOnChange) {
      Object.assign(nextState, this.resetSearchState())
    }

    if (isSingleSelect && !showDropdown) {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }

    this.setState(nextState, () => {
      callback && callback(tags)
    })
    this.props.onChange(this.treeManager.getNodeById(id), tags)
  }

  onAction = (actionId, nodeId) => {
    typeof this.props.onAction === 'function' && this.props.onAction(actionId, this.treeManager.getNodeById(nodeId))
  }

  onInputFocus = () => {
    this.keepDropdownActive = true
  }

  onInputBlur = () => {
    this.keepDropdownActive = false
  }

  getAriaAttributes = () => {
    const { showDropdown } = this.state
    const { simpleSelect } = this.props
    const attributes = {}

    attributes.role = 'button'
    attributes.tabIndex = 0
    attributes['aria-haspopup'] = simpleSelect ? 'listbox' : 'tree'
    attributes['aria-expanded'] = showDropdown ? 'true' : 'false'
    return attributes
  }

  handleTrigger = e => {
    // Just return if triggered from keyDown and the key isn't enter, space or arrow down
    if (e.key && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 40) {
      return
    } else if (e.key && this.triggerNode && this.triggerNode !== document.activeElement) {
      // Do not trigger if not activeElement
      return
    } else if (!this.state.showDropdown && e.keyCode === 32) {
      // Avoid adding space to input on open
      e.preventDefault()
    }

    // Else this is a key press that should trigger the dropdown
    this.handleClick(e, () => {
      // If the dropdown is shown after key press, focus the input
      if (this.state.showDropdown) {
        this.searchInput.focus()
      }
    })
  }

  onKeyboardKeyDown = e => {
    const { readOnly, simpleSelect } = this.props
    const { showDropdown, tags, searchModeOn, currentFocus } = this.state
    const tm = this.treeManager
    const tree = searchModeOn ? tm.matchTree : tm.tree

    if (!showDropdown && (keyboardNavigation.isValidKey(e.key, false) || /^\w$/i.test(e.key))) {
      // Triggers open of dropdown and retriggers event
      e.persist()
      this.handleClick(null, () => this.onKeyboardKeyDown(e))
      if (/\w/i.test(e.key)) return
    } else if (showDropdown && keyboardNavigation.isValidKey(e.key, true)) {
      const newFocus = tm.handleNavigationKey(
        currentFocus,
        tree,
        e.key,
        readOnly,
        !searchModeOn,
        this.onCheckboxChange,
        this.onNodeToggle
      )
      if (newFocus !== currentFocus) {
        this.setState({ currentFocus: newFocus })
      }
    } else if (showDropdown && ['Escape', 'Tab'].indexOf(e.key) > -1) {
      if (simpleSelect && tree.has(currentFocus)) {
        this.onCheckboxChange(currentFocus, true)
      } else {
        // Triggers close
        this.keepDropdownActive = false
        this.handleClick()
      }
      return
    } else if (
      e.key === 'Backspace' &&
      tags &&
      tags.length &&
      this.searchInput &&
      this.searchInput.value.length === 0
    ) {
      const lastTag = tags.pop()
      this.onCheckboxChange(lastTag._id, false)
    } else {
      return
    }
    e.preventDefault()
  }

  render() {
    const { disabled, readOnly, simpleSelect, radioSelect } = this.props
    const { showDropdown } = this.state
    const dropdownTriggerClassname = cx({
      'dropdown-trigger': true,
      arrow: true,
      disabled,
      readOnly,
      top: showDropdown,
      bottom: !showDropdown,
    })

    const activeDescendant = this.state.currentFocus ? `${this.state.currentFocus}_li` : undefined

    return (
      <div
        id={this.clientId}
        className={cx(this.props.className, 'react-dropdown-tree-select')}
        ref={node => {
          this.node = node
        }}
      >
        <div className={cx('dropdown', { 'simple-select': simpleSelect }, { 'radio-select': radioSelect })}>
          <a
            ref={node => {
              this.triggerNode = node
            }}
            className={dropdownTriggerClassname}
            onClick={!this.props.disabled ? this.handleTrigger : undefined}
            onKeyDown={!this.props.disabled ? this.handleTrigger : undefined}
            {...this.getAriaAttributes()}
          >
            <Input
              inputRef={el => {
                this.searchInput = el
              }}
              tags={this.state.tags}
              placeholderText={this.props.placeholderText}
              onInputChange={this.onInputChange}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onTagRemove={this.onTagRemove}
              onKeyDown={this.onKeyboardKeyDown}
              disabled={disabled}
              readOnly={readOnly}
              activeDescendant={activeDescendant}
              label={this.props.label}
              labelRemove={this.props.labelRemove}
            />
          </a>
          {showDropdown && (
            <div className="dropdown-content">
              {this.state.allNodesHidden ? (
                <span className="no-matches">{this.props.noMatchesText || 'No matches found'}</span>
              ) : (
                <Tree
                  data={this.state.tree}
                  keepTreeOnSearch={this.props.keepTreeOnSearch}
                  keepChildrenOnSearch={this.props.keepChildrenOnSearch}
                  searchModeOn={this.state.searchModeOn}
                  onAction={this.onAction}
                  onCheckboxChange={this.onCheckboxChange}
                  onNodeToggle={this.onNodeToggle}
                  simpleSelect={simpleSelect}
                  radioSelect={radioSelect}
                  showPartiallySelected={this.props.showPartiallySelected}
                  readOnly={readOnly}
                  clientId={this.clientId}
                  activeDescendant={activeDescendant}
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default DropdownTreeSelect
