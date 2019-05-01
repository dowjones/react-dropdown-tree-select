export function getAriaLabel(label) {
  if (!label) return undefined

  if (label && label[0] === '#') {
    return { 'aria-labelledby': label.replace(/#/g, '') }
  }
  return { 'aria-label': label }
}
