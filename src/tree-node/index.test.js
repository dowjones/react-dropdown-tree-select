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
        className: 'fa fa-ban',
      },
    ],
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
    className: 'cn0-0-0',
    _children: [{ label: 'item0-0-1', value: 'value0-0-1' }, { label: 'item0-0-2', value: 'value0-0-2' }],
  }

  const onChange = spy()

  const wrapper = mount(<TreeNode {...node} onNodeToggle={onChange} />)
  const event = {
    stopPropagation: spy(),
    nativeEvent: { stopImmediatePropagation: spy() },
  }
  wrapper.find('.toggle').simulate('click', event)
  t.true(onChange.calledWith('0-0-0'))
})

test('can toggle with enter and space', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    _children: [{ label: 'item0-0-1', value: 'value0-0-1' }, { label: 'item0-0-2', value: 'value0-0-2' }],
  }

  ;[{ key: 'Enter' }, { keyCode: 32 }].forEach(event => {
    const onChange = spy()
    const wrapper = mount(<TreeNode {...node} onNodeToggle={onChange} />)
    wrapper.find('.toggle').simulate('keydown', event)
    t.true(onChange.calledWith('0-0-0'))
  })
})

test('remove gap during search', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
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
    className: 'cn0-0-0',
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
      last: 'smith',
    },
  }

  const wrapper = shallow(<TreeNode {...node} />)
  t.is(wrapper.prop('data-first'), 'john')
  t.is(wrapper.prop('data-last'), 'smith')
})

test('should set aria-selected to true for selected node', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    checked: true,
  }

  const wrapper = shallow(<TreeNode {...node} mode="simpleSelect" />)
  t.snapshot(toJson(wrapper))
})

test('should set aria-selected to false for selected nods', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    checked: false,
  }

  const wrapper = shallow(<TreeNode {...node} mode="simpleSelect" />)
  t.snapshot(toJson(wrapper))
})

test('should set aria-checked to true for checked nodes', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    checked: true,
  }

  const wrapper = shallow(<TreeNode {...node} />)
  t.snapshot(toJson(wrapper))
})

test('should set aria-checked to false for unchecked nodes', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    checked: false,
  }

  const wrapper = shallow(<TreeNode {...node} />)
  t.snapshot(toJson(wrapper))
})

test('should set aria-checked to mixed for partial nodes', t => {
  const node = {
    _id: '0-0-0',
    _parent: '0-0',
    label: 'item0-0-0',
    value: 'value0-0-0',
    className: 'cn0-0-0',
    partial: true,
  }

  const wrapper = shallow(<TreeNode {...node} />)
  t.snapshot(toJson(wrapper))
})
