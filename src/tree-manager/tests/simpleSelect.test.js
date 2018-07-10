import test from 'ava'
import TreeManager from '..'

test('should select the same node if it is selected and then deselected right again', t => {
  const tree = [{ id: 'nodeA' }, { id: 'nodeB' }, { id: 'nodeC' }]

  const manager = new TreeManager(tree, true)

  // first select a node
  manager.setNodeCheckedState('nodeA', true)

  // then deselect the same node
  manager.setNodeCheckedState('nodeA', false)

  // then reselect the same node right away
  manager.setNodeCheckedState('nodeA', true)

  t.true(manager.getNodeById('nodeA').checked)
})
