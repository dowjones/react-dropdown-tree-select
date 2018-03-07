import React from 'react'
import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import Tag from './index'

const nativeEvent = { nativeEvent: { stopImmediatePropagation: () => {} } }

test('renders label when passed in', () => {
  const actual = shallow(<Tag label='hello' id='abc' />).html()
  const expected = '<span class="tag">hello<button class="tag-remove" type="button">x</button></span>'
  expect(actual).toEqual(expected)
})

test('call onDelete handler when pill is closed', () => {
  const onDelete = spy()
  const wrapper = mount(<Tag label='hello' id='abc' onDelete={onDelete} />)
  wrapper.find('.tag-remove').simulate('click', nativeEvent)
  expect(onDelete.calledWith('abc')).toBe(true)
})

test('should not cause form submit', () => {
  const onSubmit = spy()
  const onDelete = spy()
  const wrapper = mount(
    <form onSubmit={onSubmit}>
      <Tag label='hello' id='abc' onDelete={onDelete} />
    </form>
  )
  wrapper.find('.tag-remove').simulate('click', nativeEvent)
  expect(onSubmit.called).toBe(false)
})
