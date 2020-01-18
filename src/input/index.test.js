import { shallow } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Input from './index'

test('renders input', t => {
  const wrapper = toJson(shallow(<Input />))
  t.snapshot(wrapper)
})

test('renders placeholder', t => {
  const placeholderText = 'select something'
  const wrapper = toJson(shallow(<Input texts={{ placeholder: placeholderText }} />))
  t.snapshot(wrapper)
})

test('raises onchange', t => {
  const onChange = spy()
  const wrapper = shallow(<Input onInputChange={onChange} />)
  wrapper.find('input').simulate('change', { target: { value: 'hello' }, persist: spy() })
  t.true(onChange.calledWith('hello'))
})

test('should render disabled input', t => {
  const wrapper = toJson(shallow(<Input disabled />))
  t.snapshot(wrapper)
})
