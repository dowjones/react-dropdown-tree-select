import test from 'ava'
import TreeManager from '..'
import { grandParent, parent1, parent2, parents, childrenOfParent1, childrenOfParent2, children, assertTreeInExpectedState } from './partial-setup'

test.beforeEach(t => {
  t.context.tree = {
    id: grandParent,
    children: [
      {
        id: parent1,
        children: [{ id: '1-1-1' }, { id: '1-1-2' }]
      },
      {
        id: parent2,
        children: [{ id: '1-2-1' }, { id: '1-2-2' }, { id: '1-2-3' }]
      }
    ]
  }
})

test('should set partial state if first child is checked', t => {
  const { tree } = t.context
  tree.children[0].checked = true

  const manager = new TreeManager(tree, false, true)

  const expected = {
    checked: [parent1, ...childrenOfParent1],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent2, ...childrenOfParent2]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should set partial state if last child is checked', t => {
  const { tree } = t.context
  tree.children[1].checked = true

  const manager = new TreeManager(tree, false, true)

  const expected = {
    checked: [parent2, ...childrenOfParent2],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent1, ...childrenOfParent1]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should set partial state if at least one grandchild is partial', t => {
  const { tree } = t.context
  tree.children[1].children[1].checked = true

  const manager = new TreeManager(tree, false, true)

  const expected = {
    checked: [tree.children[1].children[1].id],
    nonPartial: [parent1, ...childrenOfParent1],
    partial: [grandParent, parent2],
    unchecked: [parent1, ...childrenOfParent1]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should not set partial state if all of the children are checked', t => {
  const { tree } = t.context
  tree.children[0].checked = true
  tree.children[1].checked = true

  const manager = new TreeManager(tree, false, true)

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children]
  }
  assertTreeInExpectedState(t, manager, expected)
})
