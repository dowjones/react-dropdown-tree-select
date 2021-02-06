import InfiniteScroll from 'react-infinite-scroll-component'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import TreeNode from '../tree-node'
import { findIndex } from '../utils'

const shouldRenderNode = (node, searchModeOn, data) => {
  if (searchModeOn || node.expanded) return true

  const parent = node._parent && data.get(node._parent)
  // if it has a parent, then check parent's state.
  // otherwise root nodes are always rendered
  return !parent || parent.expanded
}

const Tree = ({
  data,
  keepTreeOnSearch,
  keepChildrenOnSearch,
  searchModeOn,
  mode,
  showPartiallySelected,
  readOnly,
  onAction,
  onChange,
  onCheckboxChange,
  onNodeToggle,
  activeDescendant,
  clientId,
  pageSize = 100,
}) => {
  const [items, setItems] = useState([])
  const currentPage = useRef(1)
  const totalPages = useRef(0)
  const prevActiveDescendant = useRef()
  const firstRender = useRef(true)
  const [scrollableTarget, setScrollableTarget] = useState()

  const dependencies = [
    activeDescendant,
    clientId,
    keepChildrenOnSearch,
    keepTreeOnSearch,
    mode,
    onAction,
    onChange,
    onCheckboxChange,
    onNodeToggle,
    readOnly,
    searchModeOn,
    showPartiallySelected,
    JSON.stringify([...data.values()]),
  ]

  const allVisibleNodes = useMemo(
    () =>
      [...data.values()]
        .filter(node => shouldRenderNode(node, searchModeOn, data))
        .map(node => (
          <TreeNode
            keepTreeOnSearch={keepTreeOnSearch}
            keepChildrenOnSearch={keepChildrenOnSearch}
            key={node._id}
            {...node}
            searchModeOn={searchModeOn}
            onChange={onChange}
            onCheckboxChange={onCheckboxChange}
            onNodeToggle={onNodeToggle}
            onAction={onAction}
            mode={mode}
            showPartiallySelected={showPartiallySelected}
            readOnly={readOnly}
            clientId={clientId}
            activeDescendant={activeDescendant}
          />
        )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  )

  const computeInstanceProps = useCallback(
    checkActiveDescendant => {
      totalPages.current = Math.ceil(allVisibleNodes.length / pageSize)
      if (checkActiveDescendant && activeDescendant) {
        const currentId = activeDescendant.replace(/_li$/, '')
        const focusIndex = findIndex(allVisibleNodes, n => n.key === currentId) + 1
        currentPage.current = focusIndex > 0 ? Math.ceil(focusIndex / pageSize) : 1
      }
    },
    [activeDescendant, allVisibleNodes, pageSize]
  )

  useEffect(() => {
    const hasSameActiveDescendant = activeDescendant === prevActiveDescendant.current
    computeInstanceProps(!hasSameActiveDescendant || firstRender.current)
    firstRender.current = false
    prevActiveDescendant.current = activeDescendant
    setItems(allVisibleNodes.slice(0, currentPage.current * pageSize))
  }, [activeDescendant, allVisibleNodes, computeInstanceProps, pageSize])

  const getAriaAttributes = () => ({
    /* https://www.w3.org/TR/wai-aria-1.1/#select
     * https://www.w3.org/TR/wai-aria-1.1/#tree */
    role: mode === 'simpleSelect' ? 'listbox' : 'tree',
    'aria-multiselectable': /multiSelect|hierarchical/.test(mode),
  })

  const loadMore = useCallback(() => {
    currentPage.current += 1
    const nextItems = allVisibleNodes.slice(0, currentPage.current * pageSize)
    setItems(nextItems)
  }, [allVisibleNodes, pageSize])

  const setNodeRef = node => {
    if (node) {
      setScrollableTarget(node.parentNode)
    }
  }

  return (
    <ul className={`root ${searchModeOn ? 'searchModeOn' : ''}`} ref={setNodeRef} {...getAriaAttributes()}>
      {scrollableTarget && (
        <InfiniteScroll
          dataLength={items.length}
          next={loadMore}
          hasMore={currentPage.current < totalPages.current}
          loader={<span className="searchLoader">Loading...</span>}
          scrollableTarget={scrollableTarget}
        >
          {items}
        </InfiniteScroll>
      )}
    </ul>
  )
}

Tree.propTypes = {
  data: PropTypes.instanceOf(Map),
  keepTreeOnSearch: PropTypes.bool,
  keepChildrenOnSearch: PropTypes.bool,
  searchModeOn: PropTypes.bool,
  onChange: PropTypes.func,
  onNodeToggle: PropTypes.func,
  onAction: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
  showPartiallySelected: PropTypes.bool,
  pageSize: PropTypes.number,
  readOnly: PropTypes.bool,
  clientId: PropTypes.string,
  activeDescendant: PropTypes.string,
}

export default Tree
