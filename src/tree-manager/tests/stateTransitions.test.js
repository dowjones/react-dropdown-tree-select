import test from 'ava'
import TreeManager from '..'

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

const grandParent = '1'

const parent1 = '1-1'
const parent2 = '1-2'
const parents = [parent1, parent2]

const childrenOfParent1 = ['1-1-1', '1-1-2']
const childrenOfParent2 = ['1-2-1', '1-2-2', '1-2-3']
const children = [...childrenOfParent1, ...childrenOfParent2]

const assertTreeInExpectedState = (t, manager, expected) => {
  const {
 checked = [], partial = [], unchecked = [], nonPartial = [] 
} = expected

  checked.forEach(c => t.truthy(manager.getNodeById(c).checked, `Expected node ${c} to be in checked state`))
  partial.forEach(c => t.truthy(manager.getNodeById(c).partial, `Expected node ${c} to be in partial state`))
  unchecked.forEach(c => t.falsy(manager.getNodeById(c).checked, `Expected node ${c} to be in unchecked state`))
  nonPartial.forEach(c => t.falsy(manager.getNodeById(c).partial, `Expected node ${c} to be in non-partial state`))
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
