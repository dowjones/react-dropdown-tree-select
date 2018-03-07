import React from 'react'
import renderer from 'react-test-renderer'

import Tree from './index'
import TreeManager from '../tree-manager'

describe('<Tree/>', () => {
  it('renders tree nodes when search mode is on', () => {
    const treeData = [
      {
        label: 'item1',
        value: 'value1',
        children: [
          {
            label: 'item1-1',
            value: 'value1-1',
            children: [{ label: 'item1-1-1', value: 'value1-1-1' }, { label: 'item1-1-2', value: 'value1-1-2' }]
          },
          { label: 'item1-2', value: 'value1-2' }
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
              { label: 'item2-1-1', value: 'value2-1-1' },
              { label: 'item2-1-2', value: 'value2-1-2' },
              { label: 'item2-1-3', value: 'value2-1-3', children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1' }] }
            ]
          },
          { label: 'item2-2', value: 'value2-2' }
        ]
      }
    ]
    const treeManager = new TreeManager(treeData)
    const tree = renderer
      .create(<Tree data={treeManager.tree} searchModeOn />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders only expanded tree nodes when search mode is off', () => {
    const treeData = [
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
              { label: 'item1-1-1', value: 'value1-1-1', className: 'should-not-be-rendered' },
              { label: 'item1-1-2', value: 'value1-1-2', className: 'should-not-be-rendered' }
            ]
          },
          { label: 'item1-2', value: 'value1-2', className: 'should-be-rendered' }
        ]
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
              { label: 'item2-1-1', value: 'value2-1-1', className: 'should-not-be-rendered' },
              { label: 'item2-1-2', value: 'value2-1-2', className: 'should-not-be-rendered' },
              {
                label: 'item2-1-3',
                value: 'value2-1-3',
                className: 'should-not-be-rendered',
                children: [{ label: 'item2-1-3-1', value: 'value2-1-3-1', className: 'should-not-be-rendered' }]
              }
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

    const treeManager = new TreeManager(treeData)
    const tree = renderer
      .create(<Tree data={treeManager.tree} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
