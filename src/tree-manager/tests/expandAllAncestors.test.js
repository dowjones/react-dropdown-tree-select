import test from 'ava'
import TreeManager from '..'
import {
  grandParent,
  parent1,
  parent2,
  childrenOfParent1,
  childrenOfParent2,
  assertTreeInExpectedState,
} from './partial-setup'

test.beforeEach(t => {
  t.context.tree = {
    id: grandParent,
    children: [
      {
        id: parent1,
        children: [{ id: '1-1-1' }, { id: '1-1-2' }],
      },
      {
        id: parent2,
        children: [{ id: '1-2-1' }, { id: '1-2-2' }, { id: '1-2-3' }],
      },
    ],
  }
})

test('should set expanded state if a child is checked', t => {
  const { tree } = t.context
  tree.children[0].checked = true
  const manager = new TreeManager({ data: tree, mode: 'multiSelect', expandAllAncestors: true })

  const expected = {
    checked: [parent1, ...childrenOfParent1],
    expanded: [grandParent],
    unexpanded: [parent1, ...childrenOfParent1, parent2, ...childrenOfParent2],
  }
  assertTreeInExpectedState(t, manager, expected)
})
