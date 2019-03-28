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

const getToggleExpandAction = (currentFocus, key) => {
  if (!currentFocus && key === Keys.Left) {
    return currentFocus.expanded ? NavActions.ToggleExpanded :
      currentFocus._parent ? NavActions.FocusParent :
        NavActions.None
  } else if (!currentFocus && key === Keys.Right && currentFocus._children) {
    return currentFocus.expanded === true ? NavActions.FocusNext : NavActions.ToggleExpanded
  }
  return NavActions.None
}

const getAction = (currentFocus, key) => {
  let action
  // eslint-disable-next-line default-case
  switch (key) {
    case Keys.Left: case Keys.Right: action = getToggleExpandAction(currentFocus, key); break
    case Keys.Home: case Keys.PageUp: action = NavActions.FocusFirst; break
    case Keys.End: case Keys.PageDown: action = NavActions.FocusLast; break
  }
  if (!action && currentFocus) {
    // eslint-disable-next-line default-case
    switch (key) {
      case Keys.Up: action = NavActions.FocusPrevious; break
      case Keys.Down: action = NavActions.FocusNext; break
      case Keys.Enter: action = NavActions.ToggleChecked; break
    }
  } else if (!action) {
    // eslint-disable-next-line default-case
    switch (key) {
      case Keys.Up: action = NavActions.FocusLast; break
      case Keys.Down: action = NavActions.FocusFirst; break
    }
  }
  return action || NavActions.None
}

const getNewNextFocus = (sortedNodes, prevFocus, action) => {
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
    return prevFocus && prevFocus._parent ? getNodeById(prevFocus._parent) : prevFocus
  }

  const isReverseOrder = [NavActions.FocusPrevious, NavActions.FocusLast].indexOf(action) > -1
  const nodes = nodeVisitor.getVisibleNodes(tree, getNodeById, isReverseOrder)
  if (nodes.length === 0 || !FocusActionNames.has(action)) return prevFocus

  return getNewNextFocus(nodes, prevFocus, action)
}

const keyboardNavigation = {
  isValidKey,
  getAction,
  getNextFocus
}
export default keyboardNavigation
