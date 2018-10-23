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

import { isOutsideClick } from './utils'
import Input from './input'
import Tree from './tree'
import TreeManager from './tree-manager'

import styles from './index.css'

const cx = cn.bind(styles)

class DropdownTreeSelect extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    clearSearchOnChange: PropTypes.bool,
    keepTreeOnSearch: PropTypes.bool,
    placeholderText: PropTypes.string,
    showDropdown: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onAction: PropTypes.func,
    onNodeToggle: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    simpleSelect: PropTypes.bool,
    noMatchesText: PropTypes.string,
    showPartiallySelected: PropTypes.bool,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      showDropdown: this.props.showDropdown || false,
      searchModeOn: false
    }
  }

  createList = (tree, simple, showPartial) => {
    this.treeManager = new TreeManager(tree, simple, showPartial)
    return this.treeManager.tree
  }

  resetSearchState = () => {
    // clear the search criteria and avoid react controlled/uncontrolled warning
    this.searchInput.value = ''
    return {
      tree: this.treeManager.restoreNodes(), // restore the tree to its pre-search state
      searchModeOn: false,
      allNodesHidden: false
    }
  }

  componentWillMount() {
    const tree = this.createList(this.props.data, this.props.simpleSelect, this.props.showPartiallySelected)
    const tags = this.treeManager.getTags()
    this.setState({ tree, tags })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false)
  }

  componentWillReceiveProps(nextProps) {
    const tree = this.createList(nextProps.data, nextProps.simpleSelect, nextProps.showPartiallySelected)
    const tags = this.treeManager.getTags()
    this.setState({ tree, tags })
  }

  handleClick = () => {
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
    })
  }

  handleOutsideClick = e => {
    if (!isOutsideClick(e, this.props.className)) {
      return
    }

    this.handleClick()
  }

  onInputChange = value => {
    const { allNodesHidden, tree } = this.treeManager.filterTree(value, this.props.keepTreeOnSearch)
    const searchModeOn = value.length > 0

    this.setState({
      tree,
      searchModeOn,
      allNodesHidden
    })
  }

  onTagRemove = id => {
    this.onCheckboxChange(id, false)
  }

  onNodeToggle = id => {
    this.treeManager.toggleNodeExpandState(id)
    this.setState({ tree: this.treeManager.tree })
    typeof this.props.onNodeToggle === 'function' && this.props.onNodeToggle(this.treeManager.getNodeById(id))
  }

  onCheckboxChange = (id, checked) => {
    this.treeManager.setNodeCheckedState(id, checked)
    let tags = this.treeManager.getTags()
    const showDropdown = this.props.simpleSelect ? false : this.state.showDropdown

    if (!tags.length) {
      this.treeManager.restoreDefaultValues()
      tags = this.treeManager.getTags()
    }

    const nextState = {
      tree: this.treeManager.tree,
      tags,
      showDropdown
    }

    if (this.props.simpleSelect || this.props.clearSearchOnChange) {
      Object.assign(nextState, this.resetSearchState())
    }

    if (this.props.simpleSelect) {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }

    this.setState(nextState)
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

  render() {
    const dropdownTriggerClassname = cx({
      'dropdown-trigger': true,
      arrow: true,
      disabled: this.props.disabled,
      top: this.state.showDropdown,
      bottom: !this.state.showDropdown
    })

    return (
      <div
        className={cx(this.props.className, 'react-dropdown-tree-select')}
        ref={node => {
          this.node = node
        }}
      >
        <div className="dropdown">
          <a className={dropdownTriggerClassname} onClick={!this.props.disabled && this.handleClick}>
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
              disabled={this.props.disabled}
            />
          </a>
          {this.state.showDropdown && (
            <div className={cx('dropdown-content')}>
              {this.state.allNodesHidden ? (
                <span className="no-matches">{this.props.noMatchesText || 'No matches found'}</span>
              ) : (
                <Tree
                  data={this.state.tree}
                  keepTreeOnSearch={this.props.keepTreeOnSearch}
                  searchModeOn={this.state.searchModeOn}
                  onAction={this.onAction}
                  onCheckboxChange={this.onCheckboxChange}
                  onNodeToggle={this.onNodeToggle}
                  simpleSelect={this.props.simpleSelect}
                  showPartiallySelected={this.props.showPartiallySelected}
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
