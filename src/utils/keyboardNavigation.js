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
  if (!currentFocus) return NavActions.None
  let action = NavActions.None
  // eslint-disable-next-line default-case
  switch (key) {
    case Keys.Left:
      if (currentFocus.expanded) action = NavActions.ToggleExpanded
      else if (currentFocus._parent) action = NavActions.FocusParent
      break
    case Keys.Right:
      if (currentFocus._children) {
        action = currentFocus.expanded === true ? NavActions.FocusNext : NavActions.ToggleExpanded
      }
      break
  }
  return action
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

const getNextFocus = (tree, prevFocus, action, getNodeById) => {
  if (action === NavActions.FocusParent) {
    return prevFocus && prevFocus._parent ? getNodeById(prevFocus._parent) : prevFocus
  }

  const isReverseOrder = [NavActions.FocusPrevious, NavActions.FocusLast].indexOf(action) > -1
  const nodes = nodeVisitor.getVisibleNodes(tree, getNodeById, isReverseOrder)
  if (nodes.length === 0 || !FocusActionNames.has(action)) return prevFocus

  let newFocus
  if ([NavActions.FocusFirst, NavActions.FocusLast].indexOf(action) > -1) {
    [newFocus] = nodes
  } else if ([NavActions.FocusPrevious, NavActions.FocusNext].indexOf(action) > -1) {
    const currentIndex = nodes.indexOf(prevFocus)
    if (currentIndex < 0 || (currentIndex + 1 === nodes.length)) {
      [newFocus] = nodes
    } else {
      newFocus = nodes[currentIndex + 1]
    }
  }

  return newFocus || prevFocus
}

const keyboardNavigation = {
  isValidKey,
  getAction,
  getNextFocus
}
export default keyboardNavigation
