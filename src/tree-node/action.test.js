import test from 'ava'
import React from 'react'
import { shallow } from 'enzyme'
import { spy, match } from 'sinon'
import Action from './action'

test('renders action with given props', t => {
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    text: 'hello',
    junk: '1'
  }

  const wrapper = shallow(<Action {...props} />)

  t.is(wrapper.props().title, props.title)
  t.is(wrapper.text(), props.text)
  t.is(wrapper.props().className, props.className)
  t.is(wrapper.props().junk, undefined)
})

test('notifies clicks if handler is passed', t => {
  const onClick = spy()
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    onAction: onClick,
    actionData: {id: 'actionA'}
  }

  const wrapper = shallow(<Action {...props} />)
  wrapper.find('.cn0-0-0').simulate('click')
  t.true(onClick.calledOnce)
  t.true(onClick.calledWith(match({id: 'actionA'})))
})

test('doesn\'t notify clicks if handler is not passed', t => {
  const onClick = spy()
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    onClick,
    actionData: {id: 'actionA'}
  }

  const wrapper = shallow(<Action {...props} />)
  wrapper.find('.cn0-0-0').simulate('click')
  t.false(onClick.called)
})
