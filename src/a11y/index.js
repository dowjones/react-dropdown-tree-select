export function getAriaLabel(label, additionalLabelledBy) {
  const attributes = getAriaAttributeForLabel(label)

  if (additionalLabelledBy) {
    attributes['aria-labelledby'] = `${attributes['aria-labelledby'] || ''} ${additionalLabelledBy}`.trim()
  }

  return attributes
}

function getAriaAttributeForLabel(label) {
  if (!label) return {}

  /* See readme for label. When label starts with # it references ids of dom nodes instead.
    When used on aria-labelledby, they should be referenced without a starting hash/# */
  if (label[0] === '#') {
    return { 'aria-labelledby': label.substring(1).replace(/ #/g, ' ') }
  }
  return { 'aria-label': label }
}
