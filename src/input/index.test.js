import { shallow } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Input from './index'

test('renders tags', t => {
  const tags = [{ _id: 'i1', label: 'l1' }, { _id: 'i2', label: 'l2' }]
  const wrapper = toJson(shallow(<Input tags={tags} />))
  t.snapshot(wrapper)
})

test('renders input when no tags are passed', t => {
  const wrapper = toJson(shallow(<Input />))
  t.snapshot(wrapper)
})

test('renders placeholder', t => {
  const placeholderText = 'select something'
  const wrapper = toJson(shallow(<Input placeholderText={placeholderText} />))
  t.snapshot(wrapper)
})

test('raises onchange', t => {
  const onChange = spy()
  const wrapper = shallow(<Input onInputChange={onChange} />)
  wrapper.find('input').simulate('change', { target: { value: 'hello' }, persist: spy() })
  t.true(onChange.calledWith('hello'))
})

test('should render data attributes', t => {
  const tags = [
    {
      _id: 'i1',
      label: 'l1',
      tagClassName: 'test',
      dataset: {
        first: 'john',
        last: 'smith'
      }
    }
  ]

  const wrapper = toJson(shallow(<Input tags={tags} />))

  t.snapshot(wrapper)
})

test('should render disabled input', t => {
  const wrapper = toJson(shallow(<Input disabled />))
  t.snapshot(wrapper)
})
