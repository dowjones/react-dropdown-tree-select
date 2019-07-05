export function getAriaLabel(label, additionalLabelledBy) {
  if (!label && !additionalLabelledBy) return undefined

  let attributes = {}

  if (label) {
    /* See readme for label. When label starts with # it references ids of dom nodes instead.
      When used on aria-labelledby, they should be referenced without a starting hash/# */
    if (label[0] === '#') {
      attributes['aria-labelledby'] = label.replace(/#/g, '')
    } else {
      attributes['aria-label'] = label
    }
  }

  if (additionalLabelledBy) {
    attributes['aria-labelledby'] = ((attributes['aria-labelledby'] || '') + ' ' + additionalLabelledBy).trim()
  }

  return attributes
}
