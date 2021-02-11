/*!
 * React Dropdown Tree Select
 * A lightweight, fast and highly customizable tree select component.
 * Hrusikesh Panda <hrusikesh.panda@dowjones.com>
 * Copyright (c) 2017 Dow Jones, Inc. <support@dowjones.com> (http://dowjones.com)
 * license MIT
 * see https://github.com/dowjones/react-dropdown-tree-select
 */
import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'

import { isOutsideClick, clientIdGenerator } from './utils'
import Input from './input'
import Tags from './tags'
import Trigger from './trigger'
import Tree from './tree'
import TreeManager from './tree-manager'
import keyboardNavigation from './tree-manager/keyboardNavigation'

import './index.css'
import { getAriaLabel } from './a11y'

const DropdownTreeSelect = ({
  id: idProp,
  data,
  mode,
  showDropdown: showDropdownProp,
  showPartiallySelected,
  searchPredicate,
  className,
  disabled,
  readOnly,
  texts,
  inlineSearchInput,
  tabIndex,
  keepTreeOnSearch,
  keepChildrenOnSearch,
  onAction: onActionProp,
  onChange,
  onFocus,
  onBlur,
  onNodeToggle: onNodeToggleProp,
  keepOpenOnSelect,
  clearSearchOnChange,
}) => {
  const [state, setState] = useState({ searchModeOn: false })
  const clientId = useMemo(() => idProp || clientIdGenerator.get(), [idProp])
  const treeManager = useRef()
  const searchInputRef = useRef()
  const nodeRef = useRef()
  const keepDropdownActive = useRef(false)
  const callbackRef = useRef()

  const setStateWithCallback = (newState, callback) => {
    // don't overwrite if there's a pending callback
    if (!callbackRef.current) {
      callbackRef.current = callback
    }
    setState(newState)
  }

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current()
      callbackRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)])

  const resetSearchState = () => {
    // clear the search criteria and avoid react controlled/uncontrolled warning
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }

    return {
      tree: treeManager.current.restoreNodes(), // restore the tree to its pre-search state
      searchModeOn: false,
      allNodesHidden: false,
    }
  }

  const handleClick = useCallback(
    (e, callback) => {
      setStateWithCallback(prevState => {
        // keep dropdown active when typing in search box
        const showDropdown = showDropdownProp === 'always' || keepDropdownActive.current || !prevState.showDropdown

        if (showDropdown) {
          onFocus()
        } else {
          onBlur()
        }

        return !showDropdown ? { ...prevState, showDropdown, ...resetSearchState() } : { ...prevState, showDropdown }
      }, callback)
    },
    [onBlur, onFocus, showDropdownProp]
  )

  const handleOutsideClick = useCallback(
    e => {
      if (showDropdownProp === 'always' || !isOutsideClick(e, nodeRef.current)) {
        return
      }

      handleClick()
    },
    [handleClick, showDropdownProp]
  )

  const onInputChange = value => {
    const { allNodesHidden, tree } = treeManager.current.filterTree(value, keepTreeOnSearch, keepChildrenOnSearch)
    const searchModeOn = value.length > 0

    setState(prevState => ({
      ...prevState,
      tree,
      searchModeOn,
      allNodesHidden,
    }))
  }

  const onNodeToggle = id => {
    treeManager.current.toggleNodeExpandState(id)
    const tree = state.searchModeOn ? treeManager.current.matchTree : treeManager.current.tree
    setState(prevState => ({ ...prevState, tree }))
    if (typeof onNodeToggle === 'function') {
      onNodeToggleProp(treeManager.current.getNodeById(id))
    }
  }

  const onCheckboxChange = (id, checked, callback) => {
    const { currentFocus, searchModeOn } = state
    treeManager.current.setNodeCheckedState(id, checked)
    let { tags } = treeManager.current
    const isSingleSelect = ['simpleSelect', 'radioSelect'].indexOf(mode) > -1
    const showDropdown = isSingleSelect && !keepOpenOnSelect ? false : state.showDropdown
    const currentFocusNode = currentFocus && treeManager.current.getNodeById(currentFocus)
    const node = treeManager.current.getNodeById(id)

    if (!tags.length) {
      treeManager.current.restoreDefaultValues()
      tags = treeManager.current.tags
    }

    const tree = searchModeOn ? treeManager.current.matchTree : treeManager.current.tree
    const nextState = {
      tree,
      tags,
      showDropdown,
      currentFocus: id,
    }

    if ((isSingleSelect && !showDropdown) || clearSearchOnChange) {
      Object.assign(nextState, resetSearchState())
    }

    if (isSingleSelect && !showDropdown) {
      document.removeEventListener('click', handleOutsideClick, false)
    }

    keyboardNavigation.adjustFocusedProps(currentFocusNode, node)
    setStateWithCallback(nextState, () => {
      if (callback) {
        callback(tags)
      }
    })
    onChange(node, tags)
  }

  const onTagRemove = (id, isKeyboardEvent) => {
    const { tags: prevTags } = state
    onCheckboxChange(id, false, tags => {
      if (!isKeyboardEvent) return

      keyboardNavigation.getNextFocusAfterTagDelete(id, prevTags, tags, nodeRef.current).focus()
    })
  }

  const onAction = (nodeId, action) => {
    onActionProp(treeManager.current.getNodeById(nodeId), action)
  }

  const onInputFocus = () => {
    keepDropdownActive.current = true
  }

  const onInputBlur = () => {
    keepDropdownActive.current = false
  }

  const onTrigger = e => {
    handleClick(e, () => {
      // If the dropdown is shown after key press, focus the input
      if (state.showDropdown) {
        searchInputRef.current.focus()
      }
    })
  }

  const onKeyboardKeyDown = e => {
    const { showDropdown, tags, searchModeOn, currentFocus } = state
    const { current: tm } = treeManager
    const tree = searchModeOn ? tm.matchTree : tm.tree

    if (!showDropdown && (keyboardNavigation.isValidKey(e.key, false) || /^\w$/i.test(e.key))) {
      // Triggers open of dropdown and retriggers event
      e.persist()
      handleClick(null, () => onKeyboardKeyDown(e))
      if (/\w/i.test(e.key)) return
    } else if (showDropdown && keyboardNavigation.isValidKey(e.key, true)) {
      const newFocus = tm.handleNavigationKey(
        currentFocus,
        tree,
        e.key,
        readOnly,
        !searchModeOn,
        onCheckboxChange,
        onNodeToggle
      )
      if (newFocus !== currentFocus) {
        setStateWithCallback(
          prevState => ({ ...prevState, currentFocus: newFocus }),
          () => {
            const ele = document && document.getElementById(`${newFocus}_li`)
            if (ele) {
              ele.scrollIntoView()
            }
          }
        )
      }
    } else if (showDropdown && ['Escape', 'Tab'].indexOf(e.key) > -1) {
      if (mode === 'simpleSelect' && tree.has(currentFocus)) {
        onCheckboxChange(currentFocus, true)
      } else {
        // Triggers close
        keepDropdownActive.current = false
        handleClick()
      }
      return
    } else if (e.key === 'Backspace' && tags.length && searchInputRef.current.value.length === 0) {
      const lastTag = tags.pop()
      onCheckboxChange(lastTag._id, false)
    } else {
      return
    }
    e.preventDefault()
  }

  const getAriaAttributes = () => {
    if (mode !== 'radioSelect') return {}

    return {
      role: 'radiogroup',
      ...getAriaLabel(texts.label),
    }
  }

  useEffect(() => {
    treeManager.current = new TreeManager({
      data,
      mode,
      showPartiallySelected,
      rootPrefixId: clientId,
      searchPredicate,
    })

    setState(prevState => {
      const currentFocusNode = prevState.currentFocus && treeManager.current.getNodeById(prevState.currentFocus)
      if (currentFocusNode) {
        currentFocusNode._focused = true
      }
      return {
        showDropdown: /initial|always/.test(showDropdownProp) || prevState.showDropdown === true,
        ...treeManager.current.getTreeAndTags(),
      }
    })

    return () => document.removeEventListener('click', handleOutsideClick, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), mode, showDropdownProp, showPartiallySelected, searchPredicate])

  useEffect(() => {
    // register event listeners only if there is a state change
    if (state.showDropdown) {
      document.addEventListener('click', handleOutsideClick, false)
    } else {
      document.removeEventListener('click', handleOutsideClick, false)
    }
  }, [handleOutsideClick, state.showDropdown])

  const { showDropdown, currentFocus, tags } = state

  const activeDescendant = currentFocus ? `${currentFocus}_li` : undefined

  const commonProps = { disabled, readOnly, activeDescendant, texts, mode, clientId }

  const searchInput = (
    <Input
      inputRef={el => {
        searchInputRef.current = el
      }}
      onInputChange={onInputChange}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
      onKeyDown={onKeyboardKeyDown}
      {...commonProps}
      inlineSearchInput={inlineSearchInput}
    />
  )

  return (
    <div
      id={clientId}
      className={[className && className, 'react-dropdown-tree-select'].filter(Boolean).join(' ')}
      ref={nodeRef}
    >
      <div
        className={['dropdown', mode === 'simpleSelect' && 'simple-select', mode === 'radioSelect' && 'radio-select']
          .filter(Boolean)
          .join(' ')}
      >
        <Trigger onTrigger={onTrigger} showDropdown={showDropdown} {...commonProps} tags={tags} tabIndex={tabIndex}>
          <Tags tags={tags} onTagRemove={onTagRemove} {...commonProps}>
            {!inlineSearchInput && searchInput}
          </Tags>
        </Trigger>
        {showDropdown && (
          <div className="dropdown-content" {...getAriaAttributes()}>
            {inlineSearchInput && searchInput}
            {state.allNodesHidden ? (
              <span className="no-matches">{texts.noMatches || 'No matches found'}</span>
            ) : (
              <Tree
                data={state.tree}
                keepTreeOnSearch={keepTreeOnSearch}
                keepChildrenOnSearch={keepChildrenOnSearch}
                searchModeOn={state.searchModeOn}
                onAction={onAction}
                onCheckboxChange={onCheckboxChange}
                onNodeToggle={onNodeToggle}
                mode={mode}
                showPartiallySelected={showPartiallySelected}
                {...commonProps}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

DropdownTreeSelect.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  clearSearchOnChange: PropTypes.bool,
  keepTreeOnSearch: PropTypes.bool,
  keepChildrenOnSearch: PropTypes.bool,
  keepOpenOnSelect: PropTypes.bool,
  texts: PropTypes.shape({
    placeholder: PropTypes.string,
    inlineSearchPlaceholder: PropTypes.string,
    noMatches: PropTypes.string,
    label: PropTypes.string,
    labelRemove: PropTypes.string,
  }),
  showDropdown: PropTypes.oneOf(['default', 'initial', 'always']),
  className: PropTypes.string,
  onChange: PropTypes.func,
  onAction: PropTypes.func,
  onNodeToggle: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
  showPartiallySelected: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  id: PropTypes.string,
  searchPredicate: PropTypes.func,
  inlineSearchInput: PropTypes.bool,
  tabIndex: PropTypes.number,
}

DropdownTreeSelect.defaultProps = {
  onAction: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  texts: {},
  showDropdown: 'default',
  inlineSearchInput: false,
  tabIndex: 0,
}

export default DropdownTreeSelect
