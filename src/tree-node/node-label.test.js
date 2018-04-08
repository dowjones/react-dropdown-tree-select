import { shallow } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import NodeLabel from './node-label'

test('renders  node label', t => {
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

  const wrapper = shallow(<NodeLabel node={node} />)

  t.snapshot(toJson(wrapper))
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

  const wrapper = shallow(<NodeLabel node={node} onCheckboxChange={onChange} />)
  wrapper.find('.checkbox-item').simulate('change', { target: { checked: true } })
  t.true(onChange.calledWith('0-0-0', true))
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

  const wrapper = shallow(<NodeLabel node={node} searchModeOn />)

  t.snapshot(toJson(wrapper))
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

  const wrapper = shallow(<NodeLabel node={node} onCheckboxChange={onChange} simpleSelect />)
  wrapper.find('.node-label').simulate('click', { stopPropagation, nativeEvent: { stopImmediatePropagation } })
  t.true(onChange.calledWith('0-0-0', true))
  t.true(stopPropagation.calledOnce)
  t.true(stopImmediatePropagation.calledOnce)
})
