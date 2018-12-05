import test from 'ava'
import flattenTree from '../flatten-tree'
import { mapToObject } from '../../utils'

test('flattens tree with no root', t => {
  const tree = [
    {
      name: 'item1',
      value: 'value1',
      children: [
        {
          name: 'item1-1',
          value: 'value1-1',
          children: [{ name: 'item1-1-1', value: 'value1-1-1' }, { name: 'item1-1-2', value: 'value1-1-2' }]
        },
        { name: 'item1-2', value: 'value1-2' }
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
            { name: 'item2-1-1', value: 'value2-1-1' },
            { name: 'item2-1-2', value: 'value2-1-2' },
            {
              name: 'item2-1-3',
              value: 'value2-1-3',
              children: [{ name: 'item2-1-3-1', value: 'value2-1-3-1' }]
            }
          ]
        },
        { name: 'item2-2', value: 'value2-2' }
      ]
    }
  ]

  const expected = {
    0: {
      _id: '0',
      _children: ['0-0', '0-1'],
      _depth: 0,
      children: undefined,
      name: 'item1',
      value: 'value1'
    },
    1: {
      _id: '1',
      _children: ['1-0', '1-1'],
      _depth: 0,
      children: undefined,
      name: 'item2',
      value: 'value2'
    },
    '0-0': {
      _id: '0-0',
      _parent: '0',
      _children: ['0-0-0', '0-0-1'],
      _depth: 1,
      children: undefined,
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
      _children: ['1-0-0', '1-0-1', '1-0-2'],
      _depth: 1,
      children: undefined,
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
      _children: ['1-0-2-0'],
      _depth: 2,
      children: undefined,
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

  const { list } = flattenTree(tree)
  t.deepEqual(mapToObject(list), expected)
})

test('flattens tree with root', t => {
  const tree = {
    name: 'item1',
    value: 'value1',
    children: [
      {
        name: 'item1-1',
        value: 'value1-1',
        children: [{ name: 'item1-1-1', value: 'value1-1-1' }, { name: 'item1-1-2', value: 'value1-1-2' }]
      },
      { name: 'item1-2', value: 'value1-2' }
    ]
  }

  const expected = {
    0: {
      _id: '0',
      _children: ['0-0', '0-1'],
      _depth: 0,
      children: undefined,
      name: 'item1',
      value: 'value1'
    },
    '0-0': {
      _id: '0-0',
      _parent: '0',
      _children: ['0-0-0', '0-0-1'],
      _depth: 1,
      children: undefined,
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

  const { list } = flattenTree(tree)
  t.deepEqual(mapToObject(list), expected)
})

test('sets default values', t => {
  const tree = [
    {
      name: 'item1',
      value: 'value1',
      children: [
        {
          name: 'item1-1',
          value: 'value1-1',
          children: [{ name: 'item1-1-1', value: 'value1-1-1' }, { name: 'item1-1-2', value: 'value1-1-2' }]
        },
        {
          name: 'item1-2',
          value: 'value1-2',
          isDefaultValue: true
        }
      ]
    },
    {
      name: 'item2',
      value: 'value2',
      isDefaultValue: true,
      children: [
        {
          name: 'item2-1',
          value: 'value2-1',
          children: [
            { name: 'item2-1-1', value: 'value2-1-1' },
            { name: 'item2-1-2', value: 'value2-1-2' },
            {
              name: 'item2-1-3',
              value: 'value2-1-3',
              children: [{ name: 'item2-1-3-1', value: 'value2-1-3-1' }]
            }
          ]
        },
        { name: 'item2-2', value: 'value2-2' }
      ]
    }
  ]

  const expectedDefaultValues = ['0-1', '1']
  const expectedTree = {
    0: {
      _id: '0',
      _children: ['0-0', '0-1'],
      _depth: 0,
      children: undefined,
      name: 'item1',
      value: 'value1'
    },
    1: {
      _id: '1',
      _children: ['1-0', '1-1'],
      _depth: 0,
      children: undefined,
      name: 'item2',
      value: 'value2',
      checked: true,
      isDefaultValue: true
    },
    '0-0': {
      _id: '0-0',
      _parent: '0',
      _children: ['0-0-0', '0-0-1'],
      _depth: 1,
      children: undefined,
      name: 'item1-1',
      value: 'value1-1'
    },
    '0-1': {
      _id: '0-1',
      _parent: '0',
      _depth: 1,
      name: 'item1-2',
      value: 'value1-2',
      checked: true,
      isDefaultValue: true
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
      _children: ['1-0-0', '1-0-1', '1-0-2'],
      _depth: 1,
      children: undefined,
      name: 'item2-1',
      value: 'value2-1',
      checked: true
    },
    '1-1': {
      _id: '1-1',
      _parent: '1',
      _depth: 1,
      name: 'item2-2',
      value: 'value2-2',
      checked: true
    },
    '1-0-0': {
      _id: '1-0-0',
      _parent: '1-0',
      _depth: 2,
      name: 'item2-1-1',
      value: 'value2-1-1',
      checked: true
    },
    '1-0-1': {
      _id: '1-0-1',
      _parent: '1-0',
      _depth: 2,
      name: 'item2-1-2',
      value: 'value2-1-2',
      checked: true
    },
    '1-0-2': {
      _id: '1-0-2',
      _parent: '1-0',
      _children: ['1-0-2-0'],
      _depth: 2,
      children: undefined,
      name: 'item2-1-3',
      value: 'value2-1-3',
      checked: true
    },
    '1-0-2-0': {
      _id: '1-0-2-0',
      _parent: '1-0-2',
      _depth: 3,
      name: 'item2-1-3-1',
      value: 'value2-1-3-1',
      checked: true
    }
  }

  const { defaultValues, list } = flattenTree(tree)
  t.deepEqual(defaultValues, expectedDefaultValues)
  t.deepEqual(mapToObject(list), expectedTree)
})

test('does not check parent with empty children when showing partial state', t => {
  const tree = [
    {
      name: 'item1',
      value: 'value1',
      children: []
    },
    {
      name: 'item2',
      value: 'value2',
      children: []
    },
    {
      name: 'item3',
      value: 'value3',
      children: []
    }
  ]

  const expectedTree = {
    0: {
      _id: '0',
      _children: [],
      _depth: 0,
      children: undefined,
      name: 'item1',
      value: 'value1',
      partial: false
    },
    1: {
      _id: '1',
      _children: [],
      _depth: 0,
      children: undefined,
      name: 'item2',
      value: 'value2',
      partial: false
    },
    2: {
      _id: '2',
      _children: [],
      _depth: 0,
      children: undefined,
      name: 'item3',
      value: 'value3',
      partial: false
    },
  }

  const { list } = flattenTree(tree, false, true)
  t.deepEqual(mapToObject(list), expectedTree)
})
