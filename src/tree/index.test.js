import test from 'ava'
import React from 'react'
import { shallow, mount } from 'enzyme'
import TreeManager from '../tree-manager'
import Tree from './index'

test('renders tree nodes when search mode is on', t => {
  const tree = [
    {
      label: 'item1',
      value: 'value1',
      children: [
        {
          label: 'item1-1',
          value: 'value1-1',
          children: [{label: 'item1-1-1', value: 'value1-1-1'}, {label: 'item1-1-2', value: 'value1-1-2'}]
        },
        {label: 'item1-2', value: 'value1-2'}
      ]
    },
    {
      label: 'item2',
      value: 'value2',
      children: [
        {
          label: 'item2-1',
          value: 'value2-1',
          children: [
            {label: 'item2-1-1', value: 'value2-1-1'},
            {label: 'item2-1-2', value: 'value2-1-2'},
            {label: 'item2-1-3', value: 'value2-1-3', children: [{label: 'item2-1-3-1', value: 'value2-1-3-1'}]}
          ]
        },
        {label: 'item2-2', value: 'value2-2'}
      ]
    }
  ]
  const treeManager = new TreeManager(tree)
  const wrapper = shallow(<Tree data={treeManager.tree} searchModeOn />)
  t.true(wrapper.find('ul.root').hasClass('searchModeOn'))
})

test('renders only expanded tree nodes when search mode is off', t => {
  const tree = [
    {
      label: 'item1',
      value: 'value1',
      expanded: true,
      className: 'should-be-rendered',
      children: [
        {
          label: 'item1-1',
          value: 'value1-1',
          className: 'should-be-rendered',
          children: [{label: 'item1-1-1', value: 'value1-1-1', className: 'should-not-be-rendered'}, {label: 'item1-1-2', value: 'value1-1-2', className: 'should-not-be-rendered'}]
        },
        {label: 'item1-2', value: 'value1-2', className: 'should-be-rendered'}
      ]
    },
    {
      label: 'item2',
      value: 'value2',
      className: 'should-be-rendered',
      children: [{
        label: 'item2-1',
        value: 'value2-1',
        className: 'should-not-be-rendered',
        children: [
            {label: 'item2-1-1', value: 'value2-1-1', className: 'should-not-be-rendered'},
            {label: 'item2-1-2', value: 'value2-1-2', className: 'should-not-be-rendered'},
            {label: 'item2-1-3', value: 'value2-1-3', className: 'should-not-be-rendered', children: [{label: 'item2-1-3-1', value: 'value2-1-3-1', className: 'should-not-be-rendered'}]}
        ]
      },
      {
        label: 'item2-2',
        value: 'value2-2',
        className: 'should-not-be-rendered'
      }
      ]
    }
  ]

  const treeManager = new TreeManager(tree)
  const wrapper = mount(<Tree data={treeManager.tree} />)

  // 4 since expanding a parent should also render all children (but not grandchildren and beyond)
  t.is(wrapper.find('.should-be-rendered').length, 4)
  t.is(wrapper.find('.should-not-be-rendered').length, 0)
})
