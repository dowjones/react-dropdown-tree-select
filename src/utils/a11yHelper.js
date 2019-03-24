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
    rules
  }

  return new Promise(resolve => {
    axe.run(domNode, config, (error, { violations }) => {
      resolve({ error, violations })
    })
  })
}

export function run2(testExecutionContext, domNode, rules = {}) {
  const config = {
    rules
  }

  return new Promise(resolve => {
    axe.run(domNode, config, (err, { violations }) => {
      testExecutionContext.deepEqual(err, null)
      testExecutionContext.deepEqual(violations.length).toHaveLength(0)
      resolve()
    })
  })
}
