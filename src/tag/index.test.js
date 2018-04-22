import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import { createEventMock } from '../mocks'
import Tag from './index'

test('renders label when passed in', t => {
  const wrapper = toJson(shallow(<Tag label="hello" id="abc" />))
  t.snapshot(wrapper)
})

test('call onDelete handler when pill is closed', t => {
  const onDelete = spy()
  const wrapper = mount(<Tag label="hello" id="abc" onDelete={onDelete} />)
  wrapper.find('.tag-remove').simulate('click', createEventMock())
  t.true(onDelete.calledWith('abc'))
})

test('should not cause form submit', t => {
  const onSubmit = spy()
  const onDelete = spy()
  const wrapper = mount(<form onSubmit={onSubmit}>
    <Tag label="hello" id="abc" onDelete={onDelete} />
  </form>)
  wrapper.find('.tag-remove').simulate('click', createEventMock())
  t.false(onSubmit.called)
})
