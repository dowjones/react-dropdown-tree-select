import { mount } from 'enzyme'
import axe from 'axe-core'

let axeWrapper
export function mountToDoc(reactElm) {
  if (!axeWrapper) {
    axeWrapper = document.createElement('main')
    document.body.appendChild(axeWrapper)
  }

  const container = mount(reactElm)
  axeWrapper.innerHTML = ''
  axeWrapper.appendChild(container.getDOMNode())
  return container
}

export function run(domNode, rules = {}) {
  const config = {
    rules,
  }

  return new Promise(resolve => {
    axe.run(domNode, config, (error, { violations }) => {
      resolve({ error, violations })
    })
  })
}

export function getAriaLabel(label) {
  if (!label) return undefined

  if (label && label.length && label[0] === '#') {
    return { 'aria-labelledby': label.replace(/#/g, '') }
  }
  return { 'aria-label': label }
}
