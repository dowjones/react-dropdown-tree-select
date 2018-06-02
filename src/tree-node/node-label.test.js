import { shallow } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import NodeLabel from './node-label'

test('renders node label', t => {
  const node = {
    id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    actions: [
      {
        id: 'NOT',
        title: 'NOT',
        className: 'fa fa-ban'
      }
    ]
  }

  const wrapper = shallow(<NodeLabel {...node} />)

  t.snapshot(toJson(wrapper))
})

test('notifies checkbox changes', t => {
  const node = {
    id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    checked: false
  }

  const onChange = spy()

  const wrapper = shallow(<NodeLabel {...node} onCheckboxChange={onChange} />)
  wrapper.find('.checkbox-item').simulate('change', { target: { checked: true } })
  t.true(onChange.calledWith('0-0-0', true))
})

test('disable checkbox if the node has disabled status', t => {
  const node = {
    id: '0-0-0',
    _parent: '0-0',
    disabled: true,
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<NodeLabel {...node} searchModeOn />)

  t.snapshot(toJson(wrapper))
})

test('notifies clicks in simple mode', t => {
  const node = {
    id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    checked: false
  }

  const onChange = spy()

  const wrapper = shallow(<NodeLabel {...node} onCheckboxChange={onChange} simpleSelect />)
  wrapper.find('.node-label').simulate('click')
  t.true(onChange.calledWith('0-0-0', true))
})
