export function getAriaLabel(label) {
  if (!label) return undefined

  if (label && label[0] === '#') {
    // If input label reference ids (hash), use a labelledby without hashes
    return { 'aria-labelledby': label.replace(/#/g, '') }
  }
  return { 'aria-label': label }
}
