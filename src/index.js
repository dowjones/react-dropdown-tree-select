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
    texts: PropTypes.shape({
      placeholder: PropTypes.string,
      noMatches: PropTypes.string,
      label: PropTypes.string,
      labelRemove: PropTypes.string,
    }),
    showDropdown: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onAction: PropTypes.func,
    onNodeToggle: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    simpleSelect: PropTypes.bool,
    showPartiallySelected: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hierarchical: PropTypes.bool,
    id: PropTypes.string,
  }

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
    texts: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      showDropdown: this.props.showDropdown || false,
      searchModeOn: false,
      currentFocus: undefined,
    }
    this.clientId = props.id || clientIdGenerator.get(this)
  }

  createList = ({ data, simpleSelect, showPartiallySelected, hierarchical }) => {
    this.treeManager = new TreeManager({
      data,
      simpleSelect,
      showPartiallySelected,
      hierarchical,
      rootPrefixId: this.clientId,
    })
    return this.treeManager.tree
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
    const { data, simpleSelect, showPartiallySelected, hierarchical } = this.props
    const tree = this.createList({ data, simpleSelect, showPartiallySelected, hierarchical })
    const tags = this.treeManager.getTags()
    this.setState({ tree, tags })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false)
  }

  componentWillReceiveProps(nextProps) {
    const { data, simpleSelect, showPartiallySelected, hierarchical } = nextProps
    const tree = this.createList({ data, simpleSelect, showPartiallySelected, hierarchical })
    const tags = this.treeManager.getTags()
    // Restore focus-state
    const currentFocusNode = this.state.currentFocus && tree.get(this.state.currentFocus)
    if (currentFocusNode) {
      currentFocusNode._focused = true
    }
    this.setState({ tree, tags })
  }

  handleClick = (e, callback) => {
    this.setState(prevState => {
      // keep dropdown active when typing in search box
      const showDropdown = this.keepDropdownActive || !prevState.showDropdown

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
    if (!isOutsideClick(e, this.node)) {
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
    this.treeManager.setNodeCheckedState(id, checked)
    let tags = this.treeManager.getTags()
    const showDropdown = this.props.simpleSelect ? false : this.state.showDropdown

    if (!tags.length) {
      this.treeManager.restoreDefaultValues()
      tags = this.treeManager.getTags()
    }

    const tree = this.state.searchModeOn ? this.treeManager.matchTree : this.treeManager.tree
    const nextState = {
      tree,
      tags,
      showDropdown,
    }

    if (this.props.simpleSelect || this.props.clearSearchOnChange) {
      Object.assign(nextState, this.resetSearchState())
    }

    if (this.props.simpleSelect) {
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
    const dropdownTriggerClassname = cx({
      'dropdown-trigger': true,
      arrow: true,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      top: this.state.showDropdown,
      bottom: !this.state.showDropdown,
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
        <div className="dropdown">
          <a
            className={dropdownTriggerClassname}
            onClick={!this.props.disabled ? this.handleClick : undefined}
            {...getAriaLabel(this.props.label)}
          >
            <Input
              inputRef={el => {
                this.searchInput = el
              }}
              tags={this.state.tags}
              texts={this.props.texts}
              onInputChange={this.onInputChange}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onTagRemove={this.onTagRemove}
              onKeyDown={this.onKeyboardKeyDown}
              disabled={this.props.disabled}
              readOnly={this.props.readOnly}
              activeDescendant={activeDescendant}
            />
          </a>
          {this.state.showDropdown && (
            <div className={cx('dropdown-content')}>
              {this.state.allNodesHidden ? (
                <span className="no-matches">{this.props.texts.noMatches || 'No matches found'}</span>
              ) : (
                <Tree
                  data={this.state.tree}
                  keepTreeOnSearch={this.props.keepTreeOnSearch}
                  keepChildrenOnSearch={this.props.keepChildrenOnSearch}
                  searchModeOn={this.state.searchModeOn}
                  onAction={this.onAction}
                  onCheckboxChange={this.onCheckboxChange}
                  onNodeToggle={this.onNodeToggle}
                  simpleSelect={this.props.simpleSelect}
                  showPartiallySelected={this.props.showPartiallySelected}
                  readOnly={this.props.readOnly}
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
