import nodeVisitor from './nodeVisitor'
import { getTagId } from '../tag'

const Keys = {
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Enter: 'Enter',
  Home: 'Home',
  PageUp: 'PageUp',
  End: 'End',
  PageDown: 'PageDown',
}

export const NavActions = {
  None: 'None',
  FocusPrevious: 'FocusPrevious',
  FocusNext: 'FocusNext',
  FocusParent: 'FocusParent',
  FocusFirst: 'FocusFirst',
  FocusLast: 'FocusLast',
  ToggleExpanded: 'ToggleExpanded',
  ToggleChecked: 'ToggleChecked',
}

export const FocusActionNames = new Set([
  NavActions.FocusPrevious,
  NavActions.FocusNext,
  NavActions.FocusParent,
  NavActions.FocusFirst,
  NavActions.FocusLast,
])

const validTriggerOpenKeys = [Keys.Up, Keys.Down, Keys.Home, Keys.PageUp, Keys.End, Keys.PageDown]
const validKeys = validTriggerOpenKeys.concat([Keys.Left, Keys.Right, Keys.Enter])

const isValidKey = (key, isOpen) => {
  const keysToCheck = isOpen ? validKeys : validTriggerOpenKeys
  return keysToCheck.indexOf(key) > -1
}

const isMatchingEvent = (key, keys, currentFocus, nonFocusKey) =>
  keys.indexOf(key) > -1 || (!currentFocus && key === nonFocusKey)

const isFocusFirstEvent = (key, currentFocus) => isMatchingEvent(key, [Keys.Home, Keys.PageUp], currentFocus, Keys.Down)

const isFocusLastEvent = (key, currentFocus) => isMatchingEvent(key, [Keys.End, Keys.PageDown], currentFocus, Keys.Up)

const isReverseTraverseAction = action =>
  isMatchingEvent(action, [NavActions.FocusPrevious, NavActions.FocusLast], true)

const isEdgeTraverseAction = action => isMatchingEvent(action, [NavActions.FocusFirst, NavActions.FocusLast], true)

const getLeftNavAction = (currentFocus, key) => {
  if (!currentFocus || key !== Keys.Left) return NavActions.None

  if (currentFocus.expanded === true) {
    return NavActions.ToggleExpanded
  }
  if (currentFocus._parent) {
    return NavActions.FocusParent
  }

  return NavActions.None
}

const getRightNavAction = (currentFocus, key) => {
  if (!currentFocus || !currentFocus._children || key !== Keys.Right) {
    return NavActions.None
  }

  return currentFocus.expanded !== true ? NavActions.ToggleExpanded : NavActions.FocusNext
}

const getRelativeAction = (currentFocus, key) => {
  if (!currentFocus) return NavActions.None
  switch (key) {
    case Keys.Up:
      return NavActions.FocusPrevious
    case Keys.Down:
      return NavActions.FocusNext
    case Keys.Enter:
      return NavActions.ToggleChecked
    default:
      return NavActions.None
  }
}

const getAction = (currentFocus, key) => {
  let action
  if (key === Keys.Left) {
    action = getLeftNavAction(currentFocus, key)
  } else if (key === Keys.Right) {
    action = getRightNavAction(currentFocus, key)
  } else if (isFocusFirstEvent(key, currentFocus)) {
    action = NavActions.FocusFirst
  } else if (isFocusLastEvent(key, currentFocus)) {
    action = NavActions.FocusLast
  } else {
    action = getRelativeAction(currentFocus, key)
  }
  return action
}

const getParentFocus = (prevFocus, getNodeById) =>
  prevFocus && prevFocus._parent ? getNodeById(prevFocus._parent) : prevFocus

const getRelativeNeighborsFocus = (sortedNodes, prevFocus) => {
  const nextIndex = sortedNodes.indexOf(prevFocus) + 1
  if (nextIndex % sortedNodes.length === 0) {
    return sortedNodes[0]
  }
  return sortedNodes[nextIndex]
}

const getRelativeFocus = (sortedNodes, prevFocus, action) => {
  if (!sortedNodes || sortedNodes.length === 0) {
    return prevFocus
  }

  let focus = prevFocus
  if (isEdgeTraverseAction(action)) {
    ;[focus] = sortedNodes
  } else if ([NavActions.FocusPrevious, NavActions.FocusNext].indexOf(action) > -1) {
    focus = getRelativeNeighborsFocus(sortedNodes, prevFocus)
  }
  return focus
}

const getNextFocus = (tree, prevFocus, action, getNodeById, markSubTreeOnNonExpanded) => {
  if (action === NavActions.FocusParent) {
    return getParentFocus(prevFocus, getNodeById)
  }
  if (!FocusActionNames.has(action)) {
    return prevFocus
  }

  let nodes = nodeVisitor.getVisibleNodes(tree, getNodeById, markSubTreeOnNonExpanded)
  if (isReverseTraverseAction(action)) {
    nodes = nodes.reverse()
  }

  return getRelativeFocus(nodes, prevFocus, action)
}

const getNextFocusAfterTagDelete = (deletedId, prevTags, tags, fallback) => {
  // Sets new focus to next tag or returns fallback
  let index = prevTags && prevTags.findIndex(t => t._id === deletedId)
  if (index < 0 || !tags.length) return fallback

  index = tags.length > index ? index : tags.length - 1
  const newFocusId = tags[index]._id
  const focusNode = document.getElementById(getTagId(newFocusId))
  if (focusNode) {
    return focusNode.firstElementChild || fallback
  }
  return fallback
}

const handleFocusNavigationkey = (tree, action, prevFocus, getNodeById, markSubTreeOnNonExpanded) => {
  const newFocus = keyboardNavigation.getNextFocus(tree, prevFocus, action, getNodeById, markSubTreeOnNonExpanded)
  if (prevFocus && newFocus && prevFocus._id !== newFocus._id) {
    prevFocus._focused = false
  }
  if (newFocus) {
    newFocus._focused = true
    return newFocus._id
  }
  return prevFocus && prevFocus._id
}

const handleToggleNavigationkey = (action, prevFocus, readOnly, onToggleChecked, onToggleExpanded) => {
  if (action === NavActions.ToggleChecked && !readOnly && !(prevFocus.readOnly || prevFocus.disabled)) {
    onToggleChecked(prevFocus._id, prevFocus.checked !== true)
  } else if (action === NavActions.ToggleExpanded) {
    onToggleExpanded(prevFocus._id)
  }
  return prevFocus && prevFocus._id
}

const keyboardNavigation = {
  isValidKey,
  getAction,
  getNextFocus,
  getNextFocusAfterTagDelete,
  handleFocusNavigationkey,
  handleToggleNavigationkey,
}

export default keyboardNavigation
