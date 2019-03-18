import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import TreeManager from '..'
import DropdownTreeSelect from '../../'

test('should render radio inputs with shared name', t => {
  const tree = ['A', 'B', 'C'].map(nv => ({ id: nv, label: nv, value: nv }))

  const dropdownId = 'rdts'
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} radioSelect showDropdown />)

  const inputs = wrapper.find('.dropdown-content').find(`input[type="radio"][name="${dropdownId}"]`)
  t.deepEqual(inputs.length, 3)
})


test('should deselect previous node', t => {
  const tree = [{ id: 'nodeA' }, { id: 'nodeB' }, { id: 'nodeC' }]

  const manager = new TreeManager({ data: tree, radioSelect: true })

  // first select a node
  manager.setNodeCheckedState('nodeA', true)

  // then select another node
  manager.setNodeCheckedState('nodeB', true)

  t.false(manager.getNodeById('nodeA').checked)
  t.true(manager.getNodeById('nodeB').checked)
})

test('should only select single first checked node on init', t => {
  const tree = [{ id: 'nodeA', checked: true }, { id: 'nodeB', checked: true }, { id: 'nodeC', checked: true }]

  const manager = new TreeManager({ data: tree, radioSelect: true })

  t.true(manager.getNodeById('nodeA').checked)
  t.false(manager.getNodeById('nodeB').checked)
  t.false(manager.getNodeById('nodeC').checked)
})

test('should select single first checked node and ignore any defaultValues', t => {
  const tree = [{ id: 'nodeA', isDefaultValue: true }, { id: 'nodeB', checked: true }, { id: 'nodeC', checked: true }]

  const manager = new TreeManager({ data: tree, radioSelect: true })

  t.false(manager.getNodeById('nodeA').checked)
  t.true(manager.getNodeById('nodeB').checked)
  t.false(manager.getNodeById('nodeC').checked)
})

test('should select single first default node if no checked', t => {
  const tree = [{ id: 'nodeA', isDefaultValue: true }, { id: 'nodeB', isDefaultValue: true }, { id: 'nodeC', isDefaultValue: true }]

  const manager = new TreeManager({ data: tree, radioSelect: true })

  t.true(manager.getNodeById('nodeA').checked)
  t.falsy(manager.getNodeById('nodeB').checked)
  t.falsy(manager.getNodeById('nodeC').checked)
})
