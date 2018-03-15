import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { spy } from 'sinon'
import TreeNode from './index'

const hasGap = (wrapper) => {
  return !!wrapper.find('li').first().props().style.paddingLeft
}

test('renders tree node', t => {
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

  t.true(wrapper.find('.node.cn0-0-0').exists())
  t.true(wrapper.find('.toggle').exists())
  t.true(wrapper.find('label').exists())
  t.true(wrapper.find('.checkbox-item').exists())
  t.true(hasGap(wrapper))
  t.false(wrapper.hasClass('disabled'))
})

test('notifies checkbox changes', t => {
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
  t.true(onChange.calledWith('0-0-0', true))
})

test('notifies node toggle changes', t => {
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
  t.true(onChange.calledWith('0-0-0'))
})

test('remove gap during search', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<TreeNode node={node} searchModeOn={true} />)

  t.false(hasGap(wrapper))
})

test('disable checkbox if the node has disabled status', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    disabled: true,
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<TreeNode node={node} searchModeOn={true} />)

  t.true(wrapper.hasClass('disabled'))
  t.true(wrapper.find('.checkbox-item').is('[disabled]'))
})

test('notifies clicks in simple mode', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item1-1-1',
    value: 'value1-1-1',
    className: 'cn0-0-0',
    checked: false
  }

  const onChange = spy()
  const stopPropagation = spy()
  const stopImmediatePropagation = spy()

  const wrapper = shallow(<TreeNode node={node} onCheckboxChange={onChange} simpleSelect />)
  wrapper.find('.node-label').simulate('click', {stopPropagation, nativeEvent: {stopImmediatePropagation}})
  t.true(onChange.calledWith('0-0-0', true))
  t.true(stopPropagation.calledOnce)
  t.true(stopImmediatePropagation.calledOnce)
})
