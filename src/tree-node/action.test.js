import { shallow } from 'enzyme'
import { spy, match } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import Action from './action'

test('renders action with given props', t => {
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    text: 'hello',
    junk: '1'
  }

  const wrapper = toJson(shallow(<Action {...props} />))

  t.snapshot(wrapper)
})

test('notifies clicks if handler is passed', t => {
  const onClick = spy()
  const props = {
    title: 'action',
    className: 'cn0-0-0',
    onAction: onClick,
    actionData: { id: 'actionA' }
  }

  const wrapper = shallow(<Action {...props} />)
  wrapper.find('.cn0-0-0').simulate('click')
  t.true(onClick.calledOnce)
  t.true(onClick.calledWith(match({ id: 'actionA' })))
})
