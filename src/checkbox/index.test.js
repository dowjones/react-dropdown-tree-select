import { shallow } from 'enzyme'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'
import { spy } from 'sinon'

import Checkbox, { refUpdater } from './index'

test('Checkbox component', t => {
  const tree = toJson(shallow(<Checkbox className="sample" />))
  t.snapshot(tree)
})

test('renders indeterminate state', t => {
  const input = {}
  refUpdater({ indeterminate: true })(input)
  t.true(input.indeterminate)
})

test('renders checked state', t => {
  const input = {}
  refUpdater({ checked: true })(input)
  t.true(input.checked)
})

test('renders disabled state', t => {
  const tree = toJson(shallow(<Checkbox disabled />))
  t.snapshot(tree)
})

test('call stopPropagation and stopImmediatePropagation when clicked', t => {
  const onChange = spy()
  const wrapper = shallow(<Checkbox className="sample" onChange={onChange} />)
  const event = {
    stopPropagation: spy(),
    nativeEvent: { stopImmediatePropagation: spy() }
  }
  wrapper.simulate('change', event)
  t.true(onChange.called)
  t.true(event.stopPropagation.called)
  t.true(event.nativeEvent.stopImmediatePropagation.called)
})
