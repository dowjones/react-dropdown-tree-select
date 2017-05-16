import test from 'ava'
import flattenTree from './flatten-tree'
import {mapToObj} from '../map-utils'

test('flattens tree with no root', t => {
  const tree = [
    {
      name: 'item1',
      value: 'value1',
      children: [
        {
          name: 'item1-1',
          value: 'value1-1',
          children: [{name: 'item1-1-1', value: 'value1-1-1'}, {name: 'item1-1-2', value: 'value1-1-2'}]
        },
        {name: 'item1-2', value: 'value1-2'}
      ]
    },
    {
      name: 'item2',
      value: 'value2',
      children: [
        {
          name: 'item2-1',
          value: 'value2-1',
          children: [
            {name: 'item2-1-1', value: 'value2-1-1'},
            {name: 'item2-1-2', value: 'value2-1-2'},
            {name: 'item2-1-3', value: 'value2-1-3', children: [{name: 'item2-1-3-1', value: 'value2-1-3-1'}]}
          ]
        },
        {name: 'item2-2', value: 'value2-2'}
      ]
    }
  ]

  const expected = {
    0: {
      _id: '0',
      _children: [
        '0-0',
        '0-1'
      ],
      _depth: 0,
      name: 'item1',
      value: 'value1'
    },
    1: {
      _id: '1',
      _children: [
        '1-0',
        '1-1'
      ],
      _depth: 0,
      name: 'item2',
      value: 'value2'
    },
    '0-0': {
      _id: '0-0',
      _parent: '0',
      _children: [
        '0-0-0',
        '0-0-1'
      ],
      _depth: 1,
      name: 'item1-1',
      value: 'value1-1'
    },
    '0-1': {
      _id: '0-1',
      _parent: '0',
      _depth: 1,
      name: 'item1-2',
      value: 'value1-2'
    },
    '0-0-0': {
      _id: '0-0-0',
      _parent: '0-0',
      _depth: 2,
      name: 'item1-1-1',
      value: 'value1-1-1'
    },
    '0-0-1': {
      _id: '0-0-1',
      _parent: '0-0',
      _depth: 2,
      name: 'item1-1-2',
      value: 'value1-1-2'
    },
    '1-0': {
      _id: '1-0',
      _parent: '1',
      _children: [
        '1-0-0',
        '1-0-1',
        '1-0-2'
      ],
      _depth: 1,
      name: 'item2-1',
      value: 'value2-1'
    },
    '1-1': {
      _id: '1-1',
      _parent: '1',
      _depth: 1,
      name: 'item2-2',
      value: 'value2-2'
    },
    '1-0-0': {
      _id: '1-0-0',
      _parent: '1-0',
      _depth: 2,
      name: 'item2-1-1',
      value: 'value2-1-1'
    },
    '1-0-1': {
      _id: '1-0-1',
      _parent: '1-0',
      _depth: 2,
      name: 'item2-1-2',
      value: 'value2-1-2'
    },
    '1-0-2': {
      _id: '1-0-2',
      _parent: '1-0',
      _children: [
        '1-0-2-0'
      ],
      _depth: 2,
      name: 'item2-1-3',
      value: 'value2-1-3'
    },
    '1-0-2-0': {
      _id: '1-0-2-0',
      _parent: '1-0-2',
      _depth: 3,
      name: 'item2-1-3-1',
      value: 'value2-1-3-1'
    }
  }

  const list = flattenTree(tree)
  t.deepEqual(mapToObj(list), expected)
})

test('flattens tree with root', t => {
  const tree = {
    name: 'item1',
    value: 'value1',
    children: [
      {
        name: 'item1-1',
        value: 'value1-1',
        children: [{name: 'item1-1-1', value: 'value1-1-1'}, {name: 'item1-1-2', value: 'value1-1-2'}]
      },
      {name: 'item1-2', value: 'value1-2'}
    ]
  }

  const expected = {
    0: {
      _id: '0',
      _children: [
        '0-0',
        '0-1'
      ],
      _depth: 0,
      name: 'item1',
      value: 'value1'
    },
    '0-0': {
      _id: '0-0',
      _parent: '0',
      _children: [
        '0-0-0',
        '0-0-1'
      ],
      _depth: 1,
      name: 'item1-1',
      value: 'value1-1'
    },
    '0-1': {
      _id: '0-1',
      _parent: '0',
      _depth: 1,
      name: 'item1-2',
      value: 'value1-2'
    },
    '0-0-0': {
      _id: '0-0-0',
      _parent: '0-0',
      _depth: 2,
      name: 'item1-1-1',
      value: 'value1-1-1'
    },
    '0-0-1': {
      _id: '0-0-1',
      _parent: '0-0',
      _depth: 2,
      name: 'item1-1-2',
      value: 'value1-1-2'
    }
  }

  const list = flattenTree(tree)
  t.deepEqual(mapToObj(list), expected)
})
