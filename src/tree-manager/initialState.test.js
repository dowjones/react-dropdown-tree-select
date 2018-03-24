import test from 'ava'
import TreeManager from './index'

// eslint-disable-next-line max-len
test('should set initial disabled state based on parent disabled state when node disabled state is not defined', (t) => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [{
      id: 'c1',
      label: 'l1c1',
      value: 'l1v1',
    }],
    disabled: true,
  }
  const manager = new TreeManager(tree)
  t.true(manager.getNodeById('c1').disabled)
})

// should set initial disabled state based on parent disabled state
// when node disabled state is not defined and parent checked is defined
test('when node disabled state is not defined and parent checked is defined', (t) => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [{
      id: 'c1',
      label: 'l1c1',
      value: 'l1v1',
    }],
    disabled: true,
  }
  const manager = new TreeManager(tree)
  t.true(manager.getNodeById('c1').disabled)
})

// should set initial disabled state based on parent disabled state
// when node disabled state is not defined and parent checked is defined
test('when node disabled state is not defined and parent checked is defined', (t) => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [{
      id: 'c1',
      label: 'l1c1',
      value: 'l1v1',
      checked: true,
      children: [{
        id: 'gc1',
        label: 'l2c1',
        value: 'l2v1',
      }],
    }],
    disabled: true,
  }
  const manager = new TreeManager(tree)
  t.true(manager.getNodeById('c1').disabled)
  t.true(manager.getNodeById('gc1').disabled)
})

// should set initial disabled state based on parent disabled state
// when node disabled state is not defined and parent checked is defined
test('when node disabled state is not defined and grand parent checked is defined', (t) => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [{
      id: 'c1',
      label: 'l1c1',
      value: 'l1v1',
      disabled: true,
      children: [{
        id: 'gc1',
        label: 'l2c1',
        value: 'l2v1',
      }],
    }],
    checked: true,
  }
  const manager = new TreeManager(tree)
  t.true(manager.getNodeById('c1').disabled)
  t.true(manager.getNodeById('gc1').disabled)
  t.true(manager.getNodeById('c1').checked)
  t.true(manager.getNodeById('gc1').checked)
})

// eslint-disable-next-line max-len
test('when node disabled is not defined, parent checked/disabled is defined and grand parent checked/disabled is defined', (t) => {
  const tree = {
    id: 'i1',
    label: 'l1',
    value: 'v1',
    children: [{
      id: 'c1',
      label: 'l1c1',
      value: 'l1v1',
      disabled: false,
      checked: false,
      children: [{
        id: 'gc1',
        label: 'l2c1',
        value: 'l2v1',
      }],
    }],
    checked: true,
    disabled: true,
  }
  const manager = new TreeManager(tree)
  t.false(manager.getNodeById('c1').disabled)
  t.false(manager.getNodeById('c1').checked)
  t.falsy(manager.getNodeById('gc1').checked)
  t.falsy(manager.getNodeById('gc1').disabled)
})
