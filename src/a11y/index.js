export function getAriaLabel(label) {
  if (!label) return undefined

  if (label && label[0] === '#') {
    /* See readme for label. When label starts with # it references ids of dom nodes instead.
      When used on aria-labelledby, they should be referenced without a starting hash/# */
    return { 'aria-labelledby': label.replace(/#/g, '') }
  }
  return { 'aria-label': label }
}
