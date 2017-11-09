/*!
 * React Dropdown Tree Select
 * A lightweight, fast and highly customizable tree select component.
 * Hrusikesh Panda <hrusikesh.panda@dowjones.com>
 * Copyright (c) 2017 Dow Jones, Inc. <support@dowjones.com> (http://dowjones.com)
 * license MIT
 * see https://github.com/dowjones/react-dropdown-tree-select
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown'
import TreeManager from './tree-manager'
import Tree from './tree'
import Input from './input'
import styles from './index.css'

const cx = cn.bind(styles)

class DropdownTreeSelect extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    placeholderText: PropTypes.string,
    showDropdown: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onAction: PropTypes.func,
    onNodeToggle: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {dropdownActive: this.props.showDropdown || false, searchModeOn: false}

    this.onInputChange = this.onInputChange.bind(this)
    this.onDrowdownHide = this.onDrowdownHide.bind(this)
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.notifyChange = this.notifyChange.bind(this)
    this.onTagRemove = this.onTagRemove.bind(this)
    this.onNodeToggle = this.onNodeToggle.bind(this)
  }

  notifyChange (...args) {
    typeof this.props.onChange === 'function' && this.props.onChange(...args)
  }

  createList (tree) {
    this.treeManager = new TreeManager(tree)
    return this.treeManager.tree
  }

  resetSearch = () => {
    // restore the tree to its pre-search state
    this.setState({tree: this.treeManager.restoreNodes(), searchModeOn: false, allNodesHidden: false})
    // clear the search criteria and avoid react controlled/uncontrolled warning
    this.searchInput.value = ''
  }

  componentWillMount () {
    const tree = this.createList(this.props.data)
    const tags = this.treeManager.getTags()
    this.setState({tree, tags})
  }

  componentWillReceiveProps (nextProps) {
    const tree = this.createList(nextProps.data)
    const tags = this.treeManager.getTags()
    this.setState({tree, tags})
  }

  onDrowdownHide () {
    // needed when you click an item in tree and then click back in the input box.
    // react-simple-dropdown behavior is toggle since its single select only
    // but we want the drawer to remain open in this scenario as we support multi select
    if (this.keepDropdownActive) {
      this.dropdown.show()
    } else {
      this.resetSearch()
    }
  }

  onInputChange (value) {
    const {allNodesHidden, tree} = this.treeManager.filterTree(value)
    const searchModeOn = value.length > 0

    this.setState({tree, searchModeOn, allNodesHidden})
  }

  onTagRemove (id) {
    this.onCheckboxChange(id, false)
  }

  onNodeToggle (id) {
    this.treeManager.toggleNodeExpandState(id)
    this.setState({ tree: this.treeManager.tree })
    typeof this.props.onNodeToggle === 'function' && this.props.onNodeToggle(this.treeManager.getNodeById(id))
  }

  onCheckboxChange (id, checked) {
    this.treeManager.setNodeCheckedState(id, checked)
    const tags = this.treeManager.getTags()
    this.setState({tree: this.treeManager.tree, tags})
    this.notifyChange(this.treeManager.getNodeById(id), tags)
  }

  onAction = (actionId, nodeId) => {
    typeof this.props.onAction === 'function' && this.props.onAction(actionId, this.treeManager.getNodeById(nodeId))
  }

  render () {
    return (
      <div className={cn(this.props.className, 'react-dropdown-tree-select')}>
        <Dropdown ref={el => { this.dropdown = el }} onHide={this.onDrowdownHide}>
          <DropdownTrigger className={cx('dropdown-trigger')}>
            <Input
              inputRef={el => { this.searchInput = el }}
              tags={this.state.tags}
              placeholderText={this.props.placeholderText}
              onInputChange={this.onInputChange}
              onFocus={() => { this.keepDropdownActive = true }}
              onBlur={() => { this.keepDropdownActive = false }}
              onTagRemove={this.onTagRemove} />
          </DropdownTrigger>
          <DropdownContent className={cx('dropdown-content')}>
            {this.state.allNodesHidden
              ? <span className='no-matches'>No matches found</span>
              : (<Tree data={this.state.tree}
                       searchModeOn={this.state.searchModeOn}
                       onAction={this.onAction}
                       onCheckboxChange={this.onCheckboxChange}
                       onNodeToggle={this.onNodeToggle} />)
            }
          </DropdownContent>
        </Dropdown>
      </div>
    )
  }
}

export default DropdownTreeSelect
