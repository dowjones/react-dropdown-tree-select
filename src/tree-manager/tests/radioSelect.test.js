import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
import TreeManager from '..'
import DropdownTreeSelect from '../../'

const dropdownId = 'rdts'
const tree = ['nodeA', 'nodeB', 'nodeC'].map(nv => ({ id: nv, label: nv, value: nv }))

test('should render radio inputs with shared name', t => {
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} mode="radioSelect" showDropdown="initial" />)

  const inputs = wrapper.find('.dropdown-content').find(`input[type="radio"][name="${dropdownId}"]`)
  t.deepEqual(inputs.length, 3)
})

test('hides dropdown onChange for radioSelect', t => {
  const wrapper = mount(<DropdownTreeSelect id={dropdownId} data={tree} showDropdown="initial" mode="radioSelect" />)
  wrapper.instance().onCheckboxChange('nodeA', true)
  t.false(wrapper.state().searchModeOn)
  t.false(wrapper.state().allNodesHidden)
  t.false(wrapper.state().showDropdown)
})

test('keeps dropdown open onChange for radioSelect and keepOpenOnSelect', t => {
  const wrapper = mount(
    <DropdownTreeSelect id={dropdownId} data={tree} showDropdown="initial" mode="radioSelect" keepOpenOnSelect />
  )
  wrapper.instance().onCheckboxChange('nodeA', true)
  t.true(wrapper.state().showDropdown)
})

test('should deselect previous node', t => {
  const manager = new TreeManager({ data: tree, mode: 'radioSelect' })

  // first select a node
  manager.setNodeCheckedState('nodeA', true)

  // then select another node
  manager.setNodeCheckedState('nodeB', true)

  t.false(manager.getNodeById('nodeA').checked)
  t.true(manager.getNodeById('nodeB').checked)
})

test('should only select single first checked node on init', t => {
  const data = tree.map(n => ({ ...n, checked: true }))

  const manager = new TreeManager({ data, mode: 'radioSelect' })

  t.true(manager.getNodeById('nodeA').checked)
  t.false(manager.getNodeById('nodeB').checked)
  t.false(manager.getNodeById('nodeC').checked)
})

test('should only select single first default value node on init', t => {
  const data = tree.map(n => ({ ...n, isDefaultValue: true }))

  const manager = new TreeManager({ data, mode: 'radioSelect' })

  t.true(manager.getNodeById('nodeA').checked)
  t.falsy(manager.getNodeById('nodeB').checked)
  t.falsy(manager.getNodeById('nodeC').checked)
})

test('should select single first default node and ignore any checked', t => {
  const data = [{ id: 'nodeA', checked: true }, { id: 'nodeB', isDefaultValue: true }, { id: 'nodeC', checked: true }]

  const manager = new TreeManager({ data, mode: 'radioSelect' })

  t.false(manager.getNodeById('nodeA').checked)
  t.true(manager.getNodeById('nodeB').checked)
  t.false(manager.getNodeById('nodeC').checked)
})
