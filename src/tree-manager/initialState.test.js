import test from 'ava'
import TreeManager from './index'

// eslint-disable-next-line max-len
test('should set initial disabled state based on parent disabled state when node disabled state is not defined', t => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [{
      id: 'c1',
      label: 'l1c1',
      value: 'l1v1'
    }],
    disabled: true
  }
  const manager = new TreeManager(tree)
  t.true(manager.getNodeById('c1').disabled)
})
