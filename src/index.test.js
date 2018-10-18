import test from 'ava'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import toJson from 'enzyme-to-json'
import DropdownTreeSelect from './index'

const node0 = {
  _id: '0',
  _children: ['0-0', '0-1'],
  _depth: 0,
  label: 'item1',
  value: 'value1',
  children: undefined
}

test.beforeEach(t => {
  t.context.tree = [
    {
      label: 'item1',
      value: 'value1',
      children: [
        {
          label: 'item1-1',
          value: 'value1-1',
          children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }]
        },
        { label: 'item1-2', value: 'value1-2' }
      ]
    },
    {
      label: 'item2',
      value: 'value2',
      children: [
        {
          label: 'item2-1',
          value: 'value2-1',
          children: [
            { label: 'item2-1-1', value: 'value2-1-1' },
            { label: 'item2-1-2', value: 'value2-1-2' },
            {
              label: 'item2-1-3',
              value: 'value2-1-3',
              children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }]
            }
          ]
        },
        { label: 'item2-2', value: 'value2-2' }
      ]
    }
  ]
})

test('renders default state', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  t.snapshot(toJson(wrapper))
})

test('shows dropdown', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} showDropdown />)
  t.snapshot(toJson(wrapper))
})

test('notifies on action', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} onAction={handler} />)
  wrapper.instance().onAction('0', node0._id)
  t.true(handler.calledWithExactly('0', node0))
})

test('notifies on node toggle', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} onNodeToggle={handler} />)
  wrapper.instance().onNodeToggle(node0._id)
  t.true(handler.calledWithExactly({ ...node0, expanded: true }))
})

test('notifies on checkbox change', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} onChange={handler} />)
  wrapper.instance().onCheckboxChange(node0._id, true)
  t.true(handler.calledWithExactly({ ...node0, checked: true }, [{ ...node0, checked: true }]))
})

test('notifies on tag removal', t => {
  const handler = spy()
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} onChange={handler} />)
  wrapper.instance().onTagRemove(node0._id)
  t.true(handler.calledWithExactly({ ...node0, checked: false }, []))
})

test('sets search mode on input change', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} />)
  wrapper.instance().onInputChange('it')
  t.true(wrapper.state().searchModeOn)
})

test('hides dropdown onChange for simpleSelect', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} simpleSelect />)
  wrapper.instance().onCheckboxChange(node0._id, true)
  t.false(wrapper.state().searchModeOn)
  t.false(wrapper.state().allNodesHidden)
  t.false(wrapper.state().showDropdown)
})

test('clears input onChange for clearSearchOnChange', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} clearSearchOnChange />)
  wrapper.instance().onInputChange('it')
  wrapper.instance().onCheckboxChange(node0._id, true)
  t.false(wrapper.state().searchModeOn)
  t.false(wrapper.state().allNodesHidden)
})

test('toggles dropdown', t => {
  const { tree } = t.context
  const wrapper = mount(<DropdownTreeSelect data={tree} />)
  wrapper.instance().handleClick()
  t.true(wrapper.state().showDropdown)
  wrapper.instance().handleClick()
  t.false(wrapper.state().showDropdown)
})

test('doesn\'t toggle dropdown if it\'s disabled', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} disabled />)
  t.snapshot(toJson(wrapper))
})

test('keeps dropdown active on focus', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} />)
  wrapper.instance().onInputFocus()
  t.true(wrapper.instance().keepDropdownActive)
})

test('deactivates dropdown active on blur', t => {
  const { tree } = t.context
  const wrapper = shallow(<DropdownTreeSelect data={tree} />)
  wrapper.instance().onInputBlur()
  t.false(wrapper.instance().keepDropdownActive)
})
