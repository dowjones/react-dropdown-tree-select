export function getAriaLabel(label) {
  if (!label) return undefined

  if (label && label.length && label[0] === '#') {
    return { 'aria-labelledby': label.replace(/#/g, '') }
  }
  return { 'aria-label': label }
}
