import test from 'ava'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import Tag from './index'

test('renders label when passed in', t => {
  const actual = shallow(<Tag label='hello' id='abc' />).html()
  const expected = '<span class="tag">hello<button class="tag-remove">x</button></span>'
  t.deepEqual(actual, expected)
})

test('call onDelete handler when pill is closed', t => {
  const onDelete = spy()
  const wrapper = mount(<Tag label='hello' id='abc' onDelete={onDelete} />)
  wrapper.find('.tag-remove').simulate('click', { stopPropagation () {} })
  t.true(onDelete.calledWith('abc'))
})
