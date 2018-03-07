import React from 'react'
import { shallow } from 'enzyme'
import { spy } from 'sinon'
import Input from './index'

test('renders tags', () => {
  const tags = [{_id: 'i1', label: 'l1'}, {_id: 'i2', label: 'l2'}]
  const wrapper = shallow(<Input tags={tags} />)
  expect(wrapper.find('.tag-item').length).toBe(3)
})

test('renders input when no tags are passed', () => {
  const wrapper = shallow(<Input />)
  expect(wrapper.find('.tag-item').length).toBe(1)
  expect(wrapper.find('input').length).toBe(1)
})

test('renders placeholder', () => {
  const placeholderText = 'select something'
  const wrapper = shallow(<Input placeholderText={placeholderText} />)
  expect(wrapper.find('input').prop('placeholder')).toBe(placeholderText)
})

test('raises onchange', () => {
  const onChange = spy()
  const wrapper = shallow(<Input onInputChange={onChange} />)
  wrapper.find('input').simulate('change', {target: {value: 'hello'}, persist: spy()})
  expect(onChange.calledWith('hello')).toBe(true)
})
