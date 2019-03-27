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

const keyboardNavigationuUtil = () => {
  const validTriggerOpenKeys = [Keys.Up, Keys.Down, Keys.Home, Keys.PageUp, Keys.End, Keys.PageDown]
  const validKeys = validTriggerOpenKeys.concat([Keys.Left, Keys.Right, Keys.Enter])

  const isValidKey = (key, isOpen) => {
    const keysToCheck = isOpen ? validKeys : validTriggerOpenKeys
    return keysToCheck.indexOf(key) > -1
  }

  const getAction = (currentFocus, key) => {
    switch (key) {
      case Keys.Up:
        return currentFocus ? NavActions.FocusPrevious : NavActions.FocusLast
      case Keys.Down:
        return currentFocus ? NavActions.FocusNext : NavActions.FocusFirst
      case Keys.Left:
        if (!currentFocus) return NavActions.None
        if (currentFocus.expanded) return NavActions.ToggleExpanded
        return currentFocus._parent ? NavActions.FocusParent : NavActions.None
      case Keys.Right:
        if (!currentFocus || !currentFocus._children) return NavActions.None
        return currentFocus.expanded === true ? NavActions.FocusNext : NavActions.ToggleExpanded
      case Keys.Enter:
        return currentFocus ? NavActions.ToggleChecked : NavActions.None
      case Keys.Home:
      case Keys.PageUp:
        return NavActions.FocusFirst
      case Keys.End:
      case Keys.PageDown:
        return NavActions.FocusLast
      default:
        return NavActions.None
    }
  }

  return { isValidKey, getAction }
}

const keyboardNavigation = keyboardNavigationuUtil()
export default keyboardNavigation
