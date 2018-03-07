import React from 'react'
import { shallow } from 'enzyme'
import { spy, match } from 'sinon'
import Action from './action'

test('renders action with given props', () => {
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    text: 'hello',
    junk: '1'
  }

  const wrapper = shallow(<Action {...props} />)

  expect(wrapper.props().title).toBe(props.title)
  expect(wrapper.text()).toBe(props.text)
  expect(wrapper.props().className).toBe(props.className)
  expect(wrapper.props().junk).toBe(undefined)
})

test('notifies clicks if handler is passed', () => {
  const onClick = spy()
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    onAction: onClick,
    actionData: {id: 'actionA'}
  }

  const wrapper = shallow(<Action {...props} />)
  wrapper.find('.cn0-0-0').simulate('click')
  expect(onClick.calledOnce).toBe(true)
  expect(onClick.calledWith(match({id: 'actionA'}))).toBe(true)
})

test('doesn\'t notify clicks if handler is not passed', () => {
  const onClick = spy()
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    onClick,
    actionData: {id: 'actionA'}
  }

  const wrapper = shallow(<Action {...props} />)
  wrapper.find('.cn0-0-0').simulate('click')
  expect(onClick.called).toBe(false)
})
