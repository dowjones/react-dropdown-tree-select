import React from 'react'
import { shallow } from 'enzyme'
import { spy } from 'sinon'
import TreeNode from './index'

const hasGap = (wrapper) => {
  return !!wrapper.find('li').first().props().style.paddingLeft
}

test('renders tree node', () => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0',
    actions: [
      {
        id: 'NOT',
        title: 'NOT',
        className: 'fa fa-ban'
      }
    ]
  }

  const wrapper = shallow(<TreeNode node={node} />)

  expect(wrapper.find('.node.cn0-0-0').exists()).toBe(true)
  expect(wrapper.find('.toggle').exists()).toBe(true)
  expect(wrapper.find('label').exists()).toBe(true)
  expect(wrapper.find('.checkbox-item').exists()).toBe(true)
  expect(hasGap(wrapper)).toBe(true)
  expect(wrapper.hasClass('disabled')).toBe(false)
})

test('notifies checkbox changes', () => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0',
    checked: false
  }

  const onChange = spy()

  const wrapper = shallow(<TreeNode node={node} onCheckboxChange={onChange} />)
  wrapper.find('.checkbox-item').simulate('change', {target: {checked: true}})
  expect(onChange.calledWith('0-0-0', true)).toBe(true)
})

test('notifies node toggle changes', () => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0'
  }

  const onChange = spy()

  const wrapper = shallow(<TreeNode node={node} onNodeToggle={onChange} />)
  wrapper.find('.toggle').simulate('click')
  expect(onChange.calledWith('0-0-0')).toBe(true)
})

test('remove gap during search', () => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<TreeNode node={node} searchModeOn={true} />)

  expect(hasGap(wrapper)).toBe(false)
})

test('disable checkbox if the node has disabled status', () => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    disabled: true,
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<TreeNode node={node} searchModeOn={true} />)

  expect(wrapper.hasClass('disabled')).toBe(true)
  expect(wrapper.find('.checkbox-item').is('[disabled]')).toBe(true)
})
