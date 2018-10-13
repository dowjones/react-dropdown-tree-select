import InfiniteScroll from 'react-infinite-scroll-component'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import TreeNode from '../tree-node'

const shouldRenderNode = (node, searchModeOn, data) => {
  if (searchModeOn || node.expanded) return true

  const parent = node._parent && data.get(node._parent)
  // if it has a parent, then check parent's state.
  // otherwise root nodes are always rendered
  return !parent || parent.expanded
}

class Tree extends Component {
  static propTypes = {
    data: PropTypes.object,
    keepTreeOnSearch: PropTypes.bool,
    searchModeOn: PropTypes.bool,
    onChange: PropTypes.func,
    onNodeToggle: PropTypes.func,
    onAction: PropTypes.func,
    onCheckboxChange: PropTypes.func,
    simpleSelect: PropTypes.bool,
    showPartiallySelected: PropTypes.bool,
    pageSize: PropTypes.number
  }

  static defaultProps = {
    pageSize: 100
  }

  constructor(props) {
    super(props)

    this.computeInstanceProps(props)

    this.state = {
      items: this.allVisibleNodes.slice(0, this.props.pageSize)
    }
  }

  componentWillReceiveProps = nextProps => {
    this.computeInstanceProps(nextProps)
    this.setState({ items: this.allVisibleNodes.slice(0, this.props.pageSize) })
  }

  componentDidMount = () => {
    this.setState({ scrollableTarget: this.node.parentNode })
  }

  computeInstanceProps = props => {
    this.allVisibleNodes = this.getNodes(props)
    this.totalPages = Math.ceil(this.allVisibleNodes.length / this.props.pageSize)
    this.currentPage = 1
  }

  getNodes = props => {
    const { data, keepTreeOnSearch, searchModeOn, simpleSelect, showPartiallySelected } = props
    const { onAction, onChange, onCheckboxChange, onNodeToggle } = props
    const items = []
    data.forEach(node => {
      if (shouldRenderNode(node, searchModeOn, data)) {
        items.push(<TreeNode
          keepTreeOnSearch={keepTreeOnSearch}
          key={node._id}
          {...node}
          searchModeOn={searchModeOn}
          onChange={onChange}
          onCheckboxChange={onCheckboxChange}
          onNodeToggle={onNodeToggle}
          onAction={onAction}
          simpleSelect={simpleSelect}
          showPartiallySelected={showPartiallySelected}
        />)
      }
    })
    return items
  }

  hasMore = () => this.currentPage <= this.totalPages

  loadMore = () => {
    this.currentPage = this.currentPage + 1
    const nextItems = this.allVisibleNodes.slice(0, this.currentPage * this.props.pageSize)
    this.setState({ items: nextItems })
  }

  setNodeRef = node => {
    this.node = node
  }

  render() {
    const { searchModeOn } = this.props

    return (
      <ul className={`root ${searchModeOn ? 'searchModeOn' : ''}`} ref={this.setNodeRef}>
        {this.state.scrollableTarget && (
          <InfiniteScroll
            dataLength={this.state.items.length}
            next={this.loadMore}
            hasMore={this.hasMore()}
            loader={<span className="searchLoader">Loading...</span>}
            scrollableTarget={this.state.scrollableTarget}
          >
            {this.state.items}
          </InfiniteScroll>
        )}
      </ul>
    )
  }
}

export default Tree
