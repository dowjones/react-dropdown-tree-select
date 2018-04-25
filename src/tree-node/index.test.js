import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import React from 'react'
import test from 'ava'
import toJson from 'enzyme-to-json'

import TreeNode from './index'

const hasGap = wrapper =>
  !!wrapper
    .find('li')
    .first()
    .props().style.paddingLeft

test('renders tree node', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    actions: [
      {
        id: 'NOT',
        title: 'NOT',
        className: 'fa fa-ban'
      }
    ]
  }

  const wrapper = shallow(<TreeNode {...node} />)
  t.snapshot(toJson(wrapper))
  t.true(hasGap(wrapper))
})

test('notifies node toggle changes', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0'
  }

  const onChange = spy()

  const wrapper = mount(<TreeNode {...node} onNodeToggle={onChange} />)
  wrapper.find('.toggle').simulate('click')
  t.true(onChange.calledWith('0-0-0'))
})

test('remove gap during search', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<TreeNode {...node} searchModeOn />)

  t.false(hasGap(wrapper))
})

test('disable checkbox if the node has disabled status', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    disabled: true,
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0'
  }

  const wrapper = shallow(<TreeNode {...node} searchModeOn />)

  t.true(wrapper.hasClass('disabled'))
})

test('should render data attributes', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    dataset: {
      first: 'john',
      last: 'smith'
    }
  }

  const wrapper = shallow(<TreeNode {...node} />)
  t.is(wrapper.prop('data-first'), 'john')
  t.is(wrapper.prop('data-last'), 'smith')
})
