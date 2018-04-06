import test from 'ava'
import TreeManager from '..'
import { grandParent, parent1, parent2, parents, childrenOfParent1, childrenOfParent2, children, assertTreeInExpectedState } from './partial-setup'

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

// gp: grand parent
// gc: grandchildren
// p1: parent1
// p2: parent2

test('select gp -> everything checked', t => {
  const manager = new TreeManager(tree, false, true)
  manager.setNodeCheckedState(grandParent, true)

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('select gp, unselect child -> gp partial', t => {
  const manager = new TreeManager(tree, false, true)
  // select gp
  manager.setNodeCheckedState(grandParent, true)

  // unselect first child
  manager.setNodeCheckedState(parent1, false)

  const expected = {
    checked: [parent2, ...childrenOfParent2],
    partial: [grandParent],
    unchecked: [parent1, ...childrenOfParent1]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('select gp, unselect child, reselect child -> all checked', t => {
  const manager = new TreeManager(tree, false, true)
  // select gp
  manager.setNodeCheckedState(grandParent, true)

  // unselect first child
  manager.setNodeCheckedState(parent1, false)

  // reselect first child
  manager.setNodeCheckedState(parent1, true)

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('select gp, unselect grandchild -> gp, p1 partial', t => {
  const manager = new TreeManager(tree, false, true)
  // select gp
  manager.setNodeCheckedState(grandParent, true)

  // unselect first grandchild
  manager.setNodeCheckedState(childrenOfParent1[0], false)

  const expected = {
    checked: [parent2, ...childrenOfParent2, childrenOfParent1[1]],
    nonPartial: [parent2, ...childrenOfParent2],
    partial: [grandParent, parent1],
    unchecked: [childrenOfParent1[0]]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('select gp, unselect grandchild, reselect grandchild -> all checked', t => {
  const manager = new TreeManager(tree, false, true)
  // select gp
  manager.setNodeCheckedState(grandParent, true)

  // unselect first grandchild
  manager.setNodeCheckedState(childrenOfParent1[0], false)

  // reselect first grandchild
  manager.setNodeCheckedState(childrenOfParent1[0], true)

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('select gp, unselect grandchild, reselect p1 -> all checked', t => {
  const manager = new TreeManager(tree, false, true)
  // select gp
  manager.setNodeCheckedState(grandParent, true)

  // unselect first grandchild
  manager.setNodeCheckedState(childrenOfParent1[0], false)

  // reselect first grandchild
  manager.setNodeCheckedState(parent1, true)

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children]
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('select gp, unselect grandchild, reselect gp -> all checked', t => {
  const manager = new TreeManager(tree, false, true)
  // select gp
  manager.setNodeCheckedState(grandParent, true)

  // unselect first grandchild
  manager.setNodeCheckedState(childrenOfParent1[0], false)

  // reselect gp
  manager.setNodeCheckedState(grandParent, true)

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children]
  }
  assertTreeInExpectedState(t, manager, expected)
})
