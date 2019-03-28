import nodeVisitor from './nodeVisitor'

const Keys = {
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Enter: 'Enter',
  Home: 'Home',
  PageUp: 'PageUp',
  End: 'End',
  PageDown: 'PageDown'
}

export const NavActions = {
  None: 'None',
  FocusPrevious: 'FocusPrevious',
  FocusNext: 'FocusNext',
  FocusParent: 'FocusParent',
  FocusFirst: 'FocusFirst',
  FocusLast: 'FocusLast',
  ToggleExpanded: 'ToggleExpanded',
  ToggleChecked: 'ToggleChecked'
}

export const FocusActionNames = new Set([
  NavActions.FocusPrevious,
  NavActions.FocusNext,
  NavActions.FocusParent,
  NavActions.FocusFirst,
  NavActions.FocusLast
])

const validTriggerOpenKeys = [Keys.Up, Keys.Down, Keys.Home, Keys.PageUp, Keys.End, Keys.PageDown]
const validKeys = validTriggerOpenKeys.concat([Keys.Left, Keys.Right, Keys.Enter])

const isValidKey = (key, isOpen) => {
  const keysToCheck = isOpen ? validKeys : validTriggerOpenKeys
  return keysToCheck.indexOf(key) > -1
}

const isFocusFirstEvent = (key, currentFocus) =>
  [Keys.Home, Keys.PageUp].indexOf(key) > -1 || (!currentFocus && key === Keys.Down)

const isFocusLastEvent = (key, currentFocus) =>
  [Keys.End, Keys.PageDown].indexOf(key) > -1 || (!currentFocus && key === Keys.Up)

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

  return currentFocus.expanded !== true ?
    NavActions.ToggleExpanded :
    NavActions.FocusNext
}

const getRelativeAction = (currentFocus, key) => {
  if (!currentFocus) return NavActions.None
  switch (key) {
    case Keys.Up: return NavActions.FocusPrevious
    case Keys.Down: return NavActions.FocusNext
    case Keys.Enter: return NavActions.ToggleChecked
    default: return NavActions.None
  }
}

const getAction = (currentFocus, key) => {
  if (key === Keys.Left) {
    return getLeftNavAction(currentFocus, key)
  }
  if (key === Keys.Right) {
    return getRightNavAction(currentFocus, key)
  }
  if (isFocusFirstEvent(key, currentFocus)) {
    return NavActions.FocusFirst
  }
  if (isFocusLastEvent(key, currentFocus)) {
    return NavActions.FocusLast
  }
  return getRelativeAction(currentFocus, key)
}

const getParentFocus = (prevFocus, getNodeById) =>
  (prevFocus && prevFocus._parent ? getNodeById(prevFocus._parent) : prevFocus)


const getRelativeFocus = (sortedNodes, prevFocus, action) => {
  if ([NavActions.FocusFirst, NavActions.FocusLast].indexOf(action) > -1) {
    return sortedNodes[0]
  }
  if ([NavActions.FocusPrevious, NavActions.FocusNext].indexOf(action) > -1) {
    const currentIndex = sortedNodes.indexOf(prevFocus)
    if (currentIndex < 0 || (currentIndex + 1 === sortedNodes.length)) {
      return sortedNodes[0]
    }
    return sortedNodes[currentIndex + 1]
  }

  return prevFocus
}

const getNextFocus = (tree, prevFocus, action, getNodeById) => {
  if (action === NavActions.FocusParent) {
    return getParentFocus(prevFocus, getNodeById)
  } else if (!FocusActionNames.has(action)) {
    return prevFocus
  }

  const isReverseOrder = [NavActions.FocusPrevious, NavActions.FocusLast].indexOf(action) > -1
  const nodes = nodeVisitor.getVisibleNodes(tree, getNodeById, isReverseOrder)
  if (nodes.length === 0) return prevFocus

  return getRelativeFocus(nodes, prevFocus, action)
}

const keyboardNavigation = {
  isValidKey,
  getAction,
  getNextFocus
}
export default keyboardNavigation
