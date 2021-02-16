import test from 'ava'
import React from 'react'
import { mount } from 'enzyme'
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
          children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }],
        },
        { label: 'item1-2', value: 'value1-2' },
      ],
    },
    {
      label: 'item2',
      value: 'value2',
      children: [
        {
          label: 'item2-1',
          value: 'value2-1',
          children: [
            { label: 'item2-1-1', value: 'value2-1-1' },
            { label: 'item2-1-2', value: 'value2-1-2' },
            {
              label: 'item2-1-3',
              value: 'value2-1-3',
              children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }],
            },
          ],
        },
        { label: 'item2-2', value: 'value2-2' },
      ],
    },
  ]

  const treeManager = new TreeManager({ data: tree })
  const wrapper = mount(<Tree data={treeManager.tree} clientId="rdts" searchModeOn />)

  treeManager.tree.forEach(node => {
    t.true(wrapper.exists(`input[value="${node.value}"]`))
  })
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
          children: [
            {
              label: 'item1-1-1',
              value: 'value1-1-1',
              className: 'should-not-be-rendered',
            },
            {
              label: 'item1-1-2',
              value: 'value1-1-2',
              className: 'should-not-be-rendered',
            },
          ],
        },
        {
          label: 'item1-2',
          value: 'value1-2',
          className: 'should-be-rendered',
        },
      ],
    },
    {
      label: 'item2',
      value: 'value2',
      className: 'should-be-rendered',
      children: [
        {
          label: 'item2-1',
          value: 'value2-1',
          className: 'should-not-be-rendered',
          children: [
            {
              label: 'item2-1-1',
              value: 'value2-1-1',
              className: 'should-not-be-rendered',
            },
            {
              label: 'item2-1-2',
              value: 'value2-1-2',
              className: 'should-not-be-rendered',
            },
            {
              label: 'item2-1-3',
              value: 'value2-1-3',
              className: 'should-not-be-rendered',
              children: [
                {
                  label: 'item2-1-3-1',
                  value: 'value2-1-3-1',
                  className: 'should-not-be-rendered',
                },
              ],
            },
          ],
        },
        {
          label: 'item2-2',
          value: 'value2-2',
          className: 'should-not-be-rendered',
        },
      ],
    },
  ]

  const treeManager = new TreeManager({ data: tree })
  const wrapper = mount(<Tree data={treeManager.tree} clientId="rdts" />)

  treeManager.tree.forEach(node => {
    t.deepEqual(wrapper.exists(`input[value="${node.value}"]`), node.className === 'should-be-rendered')
  })
})

test('updates correctly the list when the activeDescendant is on another page', t => {
  const tree = [
    {
      label: 'item1',
      value: 'value1',
    },
    {
      label: 'item2',
      value: 'value2',
    },
  ]

  const treeManager = new TreeManager({ data: tree })
  const wrapper = mount(<Tree data={treeManager.tree} clientId="rdts" activeDescendant="0_li" pageSize={1} />)

  t.deepEqual(wrapper.find('li').length, 1)
  wrapper.setProps({ activeDescendant: '1_li' })
  wrapper.simulate('scroll', { target: { scrollTop: -20 } })
  t.deepEqual(wrapper.find('li').length, 2)
})
