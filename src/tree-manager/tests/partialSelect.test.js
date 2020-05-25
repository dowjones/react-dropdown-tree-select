import test from 'ava'
import TreeManager from '..'
import {
  grandParent,
  parent1,
  parent2,
  parents,
  childrenOfParent1,
  childrenOfParent2,
  children,
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

test('should set partial state if first child is checked', t => {
  const { tree } = t.context
  tree.children[0].checked = true

  const manager = new TreeManager({ data: tree, mode: 'multiSelect', showPartiallySelected: true })

  const expected = {
    checked: [parent1, ...childrenOfParent1],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent2, ...childrenOfParent2],
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should set partial state if last child is checked', t => {
  const { tree } = t.context
  tree.children[1].checked = true

  const manager = new TreeManager({ data: tree, mode: 'multiSelect', showPartiallySelected: true })

  const expected = {
    checked: [parent2, ...childrenOfParent2],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent1, ...childrenOfParent1],
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should set partial state if at least one grandchild is partial', t => {
  const { tree } = t.context
  tree.children[1].children[1].checked = true

  const manager = new TreeManager({ data: tree, mode: 'multiSelect', showPartiallySelected: true })

  const expected = {
    checked: [tree.children[1].children[1].id],
    nonPartial: [parent1, ...childrenOfParent1],
    partial: [grandParent, parent2],
    unchecked: [parent1, ...childrenOfParent1],
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should not set partial state if all of the children are checked', t => {
  const { tree } = t.context
  tree.children[0].checked = true
  tree.children[1].checked = true

  const manager = new TreeManager({ data: tree, mode: 'multiSelect', showPartiallySelected: true })

  const expected = {
    checked: [grandParent, ...parents, ...children],
    nonPartial: [grandParent, ...parents, ...children],
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should set partial state of radioSelect', t => {
  const { tree } = t.context
  tree.children[0].checked = true

  const manager = new TreeManager({ data: tree, mode: 'radioSelect', showPartiallySelected: true })

  const expected = {
    checked: [parent1],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent2, ...childrenOfParent2, ...childrenOfParent1],
  }
  assertTreeInExpectedState(t, manager, expected)
})

test('should clear previous partial state of radioSelect on change', t => {
  const { tree } = t.context
  const manager = new TreeManager({ data: tree, mode: 'radioSelect', showPartiallySelected: true })

  // first select a node
  manager.setNodeCheckedState(tree.children[0].children[0].id, true)

  const expected1 = {
    checked: [tree.children[0].children[0].id],
    nonPartial: [parent2, ...childrenOfParent2],
    partial: [grandParent, parent1],
    unchecked: [parent2, ...childrenOfParent2],
  }
  assertTreeInExpectedState(t, manager, expected1)

  // then select a node from another parent
  manager.setNodeCheckedState(tree.children[1].id, true)

  const expected2 = {
    checked: [parent2],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent1, ...childrenOfParent1, ...childrenOfParent2],
  }
  assertTreeInExpectedState(t, manager, expected2)
})

test('should correctly set partial state of radioSelect when selecting a parent of a previously selected child', t => {
  const { tree } = t.context
  const manager = new TreeManager({ data: tree, mode: 'radioSelect', showPartiallySelected: true })

  // first select a grandchild
  manager.setNodeCheckedState(tree.children[1].children[1].id, true)

  const expected1 = {
    checked: [tree.children[1].children[1].id],
    nonPartial: [parent1, ...childrenOfParent1],
    partial: [grandParent, parent2],
    unchecked: [parent1, ...childrenOfParent1],
  }
  assertTreeInExpectedState(t, manager, expected1)

  // then select its parent
  manager.setNodeCheckedState(tree.children[1].id, true)

  const expected2 = {
    checked: [parent2],
    nonPartial: [...parents, ...children],
    partial: [grandParent],
    unchecked: [parent1, ...childrenOfParent1, ...childrenOfParent2],
  }
  assertTreeInExpectedState(t, manager, expected2)
})
