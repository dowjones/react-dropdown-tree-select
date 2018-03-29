import test from 'ava'
import TreeManager from './index'

test('should set partial state if at least one child is partial', t => {
  const tree = {
    id: '1',
    children: [
      {
        id: '1-1',
        children: [{ id: '1-1-1' }, { id: '1-1-2' }]
      },
      {
        id: '1-2',
        children: [{ id: '1-2-1' }, { id: '1-2-2' }, { id: '1-2-3' }]
      }
    ]
  }

  const manager = new TreeManager(tree, false, true)
  manager.setNodeCheckedState('1-1-1', true)
  t.true(manager.getNodeById('1').partial)
  t.true(manager.getNodeById('1-1').partial)

  // should not affect other nodes
  t.falsy(manager.getNodeById('1-1-2').partial)
  t.falsy(manager.getNodeById('1-2').partial)
  t.falsy(manager.getNodeById('1-2-1').partial)
  t.falsy(manager.getNodeById('1-2-2').partial)
  t.falsy(manager.getNodeById('1-2-2').partial)
  t.falsy(manager.getNodeById('1-2-3').partial)
})
