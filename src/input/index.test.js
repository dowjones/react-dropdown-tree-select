import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { spy } from 'sinon'
import Input from './index'

test('renders tags', t => {
  const tags = [{_id: 'i1', label: 'l1'}, {_id: 'i2', label: 'l2'}]
  const wrapper = shallow(<Input tags={tags} />)
  t.is(wrapper.find('.tag-item').length, 3)
})

test('renders input when no tags are passed', t => {
  const wrapper = shallow(<Input />)
  t.is(wrapper.find('.tag-item').length, 1)
  t.is(wrapper.find('input').length, 1)
})

test('renders placeholder', t => {
  const placeholderText = 'select something'
  const wrapper = shallow(<Input placeholderText={placeholderText} />)
  t.is(wrapper.find('input').prop('placeholder'), placeholderText)
})

test('raises onchange', t => {
  const onChange = spy()
  const wrapper = shallow(<Input onInputChange={onChange} />)
  wrapper.find('input').simulate('change', {target: {value: 'hello'}, persist: spy()})
  t.true(onChange.calledWith('hello'))
})
