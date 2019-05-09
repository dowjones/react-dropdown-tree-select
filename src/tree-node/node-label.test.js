import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import NodeLabel from './node-label'

const mockEvent = {
  target: { checked: true },
  stopPropagation: () => undefined,
  nativeEvent: { stopImmediatePropagation: () => undefined },
}
const baseNode = {
  id: '0-0-0',
  _parent: '0-0',
  label: 'item0-0-0',
  value: 'value0-0-0',
  className: 'cn0-0-0',
}

test('renders node label', t => {
  const node = {
    ...baseNode,
    actions: [
      {
        id: 'NOT',
        title: 'NOT',
        className: 'fa fa-ban',
      },
    ],
  }

  const wrapper = shallow(<NodeLabel clientId="snapshot" {...node} />)

  t.snapshot(toJson(wrapper))
})

test('notifies checkbox changes', t => {
  const node = {
    ...baseNode,
    checked: false,
  }

  const onChange = spy()

  const wrapper = shallow(<NodeLabel {...node} onCheckboxChange={onChange} />)
  wrapper.find('.checkbox-item').simulate('change', mockEvent)
  t.true(onChange.calledWith('0-0-0', true))
})

test('disable checkbox if the node has disabled status', t => {
  const node = {
    ...baseNode,
    disabled: true,
  }

  const wrapper = shallow(<NodeLabel clientId="snapshot" {...node} searchModeOn />)

  t.snapshot(toJson(wrapper))
})

test('notifies clicks in simple mode', t => {
  const node = {
    ...baseNode,
    checked: false,
  }

  const onChange = spy()

  const wrapper = shallow(<NodeLabel {...node} onCheckboxChange={onChange} mode="simpleSelect" />)
  wrapper.find('.node-label').simulate('click', mockEvent)
  t.true(onChange.calledWith('0-0-0', true))
})

test('call stopPropagation and stopImmediatePropagation when label is clicked', t => {
  const node = {
    ...baseNode,
    checked: false,
  }

  const onChange = spy()

  const wrapper = mount(<NodeLabel {...node} onCheckboxChange={onChange} mode="simpleSelect" />)
  const event = {
    type: 'click',
    stopPropagation: spy(),
    nativeEvent: { stopImmediatePropagation: spy() },
  }
  wrapper.find('input').prop('onChange')(event)
  t.true(event.stopPropagation.called)
  t.true(event.nativeEvent.stopImmediatePropagation.called)
})
